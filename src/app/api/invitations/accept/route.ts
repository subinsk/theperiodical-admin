// app/api/invitations/accept/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma-client';
import bcrypt from 'bcryptjs';

export async function POST(request: NextRequest) {
  try {
    const { token, name, password } = await request.json();

    if (!token) {
      return NextResponse.json({ error: 'Token is required' }, { status: 400 });
    }

    // Find and validate invitation
    const invitation = await prisma.invitation.findUnique({
      where: { token },
      include: {
        organization: true
      }
    });

    if (!invitation) {
      return NextResponse.json({ error: 'Invalid invitation token' }, { status: 404 });
    }

    // Check if invitation has expired
    if (invitation.expires_at < new Date()) {
      return NextResponse.json({ error: 'Invitation has expired' }, { status: 400 });
    }

    // Check if invitation has already been accepted
    if (invitation.accepted_at) {
      return NextResponse.json({ error: 'Invitation has already been accepted' }, { status: 400 });
    }

    // Check if user exists
    const existingUser = await prisma.user.findUnique({
      where: { email: invitation.email }
    });

    let userId: string;

    if (existingUser) {
      // User exists - just update their organization and role
      if (existingUser.organization_id) {
        return NextResponse.json({ 
          error: 'User is already part of an organization' 
        }, { status: 400 });
      }

      const updatedUser = await prisma.user.update({
        where: { id: existingUser.id },
        data: {
          role: invitation.role,
          organization:{
            connect: { id: invitation.organization_id }
          },
        }
      });

      userId = updatedUser.id;
    } else {
      // New user - validate required fields
      if (!name || !password) {
        return NextResponse.json({ 
          error: 'Name and password are required for new users' 
        }, { status: 400 });
      }

      if (password.length < 8) {
        return NextResponse.json({ 
          error: 'Password must be at least 8 characters' 
        }, { status: 400 });
      }

      // Hash password
      const hashedPassword = await bcrypt.hash(password, 12);

      // Create new user
      const newUser = await prisma.user.create({
        data: {
          email: invitation.email,
          name,
          password: hashedPassword,
          organization:{
            connect: { id: invitation.organization_id }
          },
          role: invitation.role,
          email_verified: new Date() // Auto-verify email for invited users
        }
      });

      userId = newUser.id;
    }

    // Mark invitation as accepted
    await prisma.invitation.update({
      where: { id: invitation.id },
      data: {
        status: 'accepted',
        accepted_at: new Date(),
        invited_user:{
          connect: { id: userId }
        }
      }
    });

    return NextResponse.json({
      message: 'Invitation accepted successfully',
      userId,
      organizationId: invitation.organization_id
    });

  } catch (error) {
    console.error('Error accepting invitation:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}