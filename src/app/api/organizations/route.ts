import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma-client';
import { Role } from '@prisma/client';
import { slugify } from '@/utils';

// GET all organizations (only for super_admin)
export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const user = await prisma.user.findUnique({ where: { id: session.user.id } });
    if (!user || user.role !== 'super_admin') {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    const { searchParams } = new URL(request.url);
    const slug = searchParams.get('slug');

    if (slug) {
      const organization = await prisma.organization.findUnique({
        where: { slug }
      });

      if (!organization) {
        return NextResponse.json({ error: 'Organization not found' }, { status: 404 });
      }

      return NextResponse.json({ organization });
    }
    else {
      const organizations = await prisma.organization.findMany({
        orderBy: { created_at: 'desc' }
      });

      return NextResponse.json({ organizations });
    }
  }
  catch (error) {
    console.error('Failed to fetch organization:', error);
    return NextResponse.json({ error: 'Failed to fetch organization' }, { status: 500 });
  }
}

// CREATE a new organization (only super_admin)
export async function POST(request: NextRequest) {
  // Ensure the user is authenticated and has super_admin role
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  // Check if the user is a super_admin
  const user = await prisma.user.findUnique({ where: { id: session.user.id } });
  if (!user || user.role !== 'super_admin') {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
  }

  const body = await request.json();
  const { name, description, logo, plan_type, max_writers } = body;

  // Validate required fields
  if (!name || !plan_type) {
    return NextResponse.json({ error: 'Name and plan type are required' }, { status: 400 });
  }

  // If existing organization with the same name, return error
  const slug = slugify(name)
  const existingOrg = await prisma.organization.findUnique({
    where: { slug }
  });

  if (existingOrg) {
    return NextResponse.json({ error: 'Organization with this name already exists' }, { status: 400 });
  }

  try {
    let maxWriters = max_writers

    if (!maxWriters) {
      if (plan_type === 'premium') {
        maxWriters = 20;
      }
      else if (plan_type === 'enterprise') {
        maxWriters = 50;
      } else {
        maxWriters = 5;
      }
    }

    const newOrg = await prisma.organization.create({
      data: {
        name,
        slug,
        description,
        logo,
        plan_type,
        max_writers: maxWriters
      }
    });

    return NextResponse.json({ message: 'Organization created', organization: newOrg });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to create organization', details: error }, { status: 500 });
  }
}

// UPDATE an organization (only super_admin)
export async function PUT(request: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const user = await prisma.user.findUnique({ where: { id: session.user.id } });
  if (!user || user.role !== 'super_admin') {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
  }

  const body = await request.json();
  const { id, ...updates } = body;

  if (!id) {
    return NextResponse.json({ error: 'Organization ID is required' }, { status: 400 });
  }

  try {
    const updatedOrg = await prisma.organization.update({
      where: { id },
      data: updates
    });

    return NextResponse.json({ message: 'Organization updated', organization: updatedOrg });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to update organization', details: error }, { status: 500 });
  }
}

// DELETE an organization (only super_admin)
export async function DELETE(request: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const user = await prisma.user.findUnique({ where: { id: session.user.id } });
  if (!user || user.role !== 'super_admin') {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
  }

  const { searchParams } = new URL(request.url);
  const id = searchParams.get('id');

  if (!id) return NextResponse.json({ error: 'Organization ID is required' }, { status: 400 });

  try {
    await prisma.organization.delete({ where: { id } });
    return NextResponse.json({ message: 'Organization deleted' });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to delete organization', details: error }, { status: 500 });
  }
}
