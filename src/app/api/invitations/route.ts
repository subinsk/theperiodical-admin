// app/api/invitations/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth'; // Your auth config
import { prisma } from '@/lib/prisma-client'; // Your prisma instance
import { Role as PrismaRole } from '@prisma/client';
import { Role, hasRolePermission, ROLES_MAP } from '@/constants/roles';
import crypto from 'crypto';
import { sendInvitationEmail } from '@/lib/email'; // You'll need to create this
import { validateParameters, validateRole } from '@/lib';

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { email, role, organizationName } = await request.json();
    const { searchParams } = new URL(request.url);
    const organization_id = searchParams.get('organization_id');

    // Validate input
    validateParameters({ email, role }, ['email', 'role']);
    validateRole(role)

    // Get current user with organization
    const currentUser = await prisma.user.findUnique({
      where: { id: session.user.id },
      include: { organization: true }
    });

    // Check if user is part of an organization or is a super_admin
    if (
      !currentUser ||
      (!currentUser.organization_id && currentUser.role !== 'super_admin')
    ) {
      return NextResponse.json({ error: 'User not found or not part of organization' }, { status: 404 });
    }

    // Permission check using role levels
    if (!hasRolePermission(currentUser.role as Role, role as Role)) {
      return NextResponse.json({
        error: `Your role (${ROLES_MAP[currentUser.role as Role].label}) cannot invite ${ROLES_MAP[role as Role].label}s`
      }, { status: 403 });
    }

    // Check if email is already registered
    const existingUser = await prisma.user.findUnique({
      where: { email }
    });

    if (existingUser) {
      // If user exists but not in this org, we can add them
      if (existingUser.organization_id === currentUser.organization_id) {
        return NextResponse.json({ error: 'User is already part of this organization' }, { status: 400 });
      }

      if (existingUser.organization_id) {
        return NextResponse.json({ error: 'User is already part of another organization' }, { status: 400 });
      }
    }

    const currOrgId = currentUser.role === "super_admin" ? organization_id : currentUser.organization_id

    // Check for existing pending invitation
    const existingInvitation = await prisma.invitation.findFirst({
      where: {
        email,
        organization_id: currOrgId,
        accepted_at: null,
        expires_at: { gt: new Date() }
      }
    });

    if (existingInvitation) {
      return NextResponse.json({ error: 'Pending invitation already exists for this email' }, { status: 400 });
    }

    // Check organization limits (for content_writer invitations)
    if (role === 'content_writer') {
      const currentWriterCount = await prisma.user.count({
        where: {
          organization_id: currOrgId,
          role: 'content_writer',
          status: 'active'
        }
      });

      const maxWriters = currentUser.organization.max_writers || 5;
      if (currentWriterCount >= maxWriters) {
        return NextResponse.json({
          error: `Organization has reached maximum limit of ${maxWriters} content writers`
        }, { status: 400 });
      }
    }

    // Generate unique invitation token
    const token = crypto.randomBytes(32).toString('hex');

    // Set expiration (7 days from now)
    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + 7);

    // Create invitation
    const invitation = await prisma.invitation.create({
      data: {
        email,
        role,
        organization_id: currOrgId,
        invited_by: currentUser.id,
        token,
        expires_at: expiresAt
      },
      include: {
        organization: true,
        inviter: {
          select: { name: true, email: true }
        }
      }
    });

    const currOrgName = currentUser.role === "super_admin" ? organizationName : currentUser.organization.name;
    // Send invitation email
    try {
      await sendInvitationEmail({
        to: email,
        inviterName: currentUser.name || currentUser.email,
        organizationName: currOrgName,
        role,
        acceptUrl: `${process.env.NEXTAUTH_URL}/invite/accept?token=${token}`,
        expiresAt
      });
    } catch (emailError) {
      console.error('Failed to send invitation email:', emailError);
      // You might want to delete the invitation if email fails
      await prisma.invitation.delete({ where: { id: invitation.id } });
      return NextResponse.json({ error: 'Failed to send invitation email' }, { status: 500 });
    }

    return NextResponse.json({
      message: 'Invitation sent successfully',
      invitation: {
        id: invitation.id,
        email: invitation.email,
        role: invitation.role,
        expires_at: invitation.expires_at
      }
    });

  } catch (error) {
    console.error('Invitation creation error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// Optional: GET endpoint to list pending invitations
export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const currentUser = await prisma.user.findUnique({
      where: { id: session.user.id }
    });

    if (!currentUser || !currentUser.organization_id) {
      return NextResponse.json({ error: 'User not found or not part of organization' }, { status: 404 });
    }

    // Only admins and managers can view invitations
    if (currentUser.role === 'content_writer') {
      return NextResponse.json({ error: 'Insufficient permissions' }, { status: 403 });
    }

    const invitations = await prisma.invitation.findMany({
      where: {
        organization_id: currentUser.organization_id,
        accepted_at: null // Only pending invitations
      },
      include: {
        inviter: {
          select: { name: true, email: true }
        }
      },
      orderBy: { created_at: 'desc' }
    });

    return NextResponse.json({ invitations });

  } catch (error) {
    console.error('Error fetching invitations:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const invitationId = searchParams.get('invitation_id');

    if (!invitationId) {
      return NextResponse.json({ error: 'Invitation ID is required' }, { status: 400 });
    }

    const currentUser = await prisma.user.findUnique({
      where: { id: session.user.id }
    });

    if (!currentUser || !currentUser.organization_id) {
      return NextResponse.json({ error: 'User not found or not part of organization' }, { status: 404 });
    }

    // Only admins and managers can delete invitations
    if (currentUser.role === 'content_writer') {
      return NextResponse.json({ error: 'Insufficient permissions' }, { status: 403 });
    }

    const invitation = await prisma.invitation.findUnique({
      where: { id: invitationId }
    });

    if (!invitation || invitation.organization_id !== currentUser.organization_id) {
      return NextResponse.json({ error: 'Invitation not found or does not belong to your organization' }, { status: 404 });
    }

    await prisma.invitation.delete({ where: { id: invitationId } });

    return NextResponse.json({ message: 'Invitation deleted successfully' });

  } catch (error) {
    console.error('Error deleting invitation:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}