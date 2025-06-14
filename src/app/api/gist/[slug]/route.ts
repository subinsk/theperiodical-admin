import { getServerSession } from "next-auth/next"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma-client"
import { slugify } from "@/utils"
import { NextRequest, NextResponse } from "next/server"

export async function GET(
  req: NextRequest,
  { params }: { params: { slug: string } }
) {
  try {
    const response = await prisma.gist.findUnique({
      where: {
        slug: params.slug,
      },
      include: {
        topics: {
          orderBy: {
            order: 'asc'
          },
        },
        author: {
          select: {
            id: true,
            name: true,
            email: true,
            image: true,
            role: true
          }
        }
      },
    })

    if (!response) {
      return NextResponse.json(
        {
          message: "Gist not found",
          success: false,
        },
        { status: 404 }
      )
    }

    return NextResponse.json({
      message: "Gist fetched successfully!",
      success: true,
      gist: response,
    })

  } catch (error) {
    console.error('Error fetching gist:', error)
    return NextResponse.json(
      {
        message: "Internal server error",
        success: false,
      },
      { status: 500 }
    )
  }
}

export async function PUT(
  req: NextRequest,
  { params }: { params: { slug: string } }
) {
  try {
    // Get session from NextAuth
    const session = await getServerSession(authOptions)

    // Check if user is authenticated
    if (!session || !session.user) {
      return NextResponse.json(
        {
          message: "Unauthorized - Please sign in",
          success: false
        },
        { status: 401 }
      )
    }

    // Get request body
    const res = await req.json()

    // Get user from database
    const user = await prisma.user.findUnique({
      where: {
        email: session.user.email!
      }
    })

    if (!user) {
      return NextResponse.json(
        {
          message: "User not found in database",
          success: false
        },
        { status: 404 }
      )
    }

    // Check if gist exists and belongs to the user
    const existingGist = await prisma.gist.findFirst({
      where: {
        slug: params.slug,
        author_id: user.id
      }
    })

    if (!existingGist) {
      return NextResponse.json(
        {
          message: "Gist not found or you don't have permission to update it",
          success: false
        },
        { status: 403 }
      )
    }

    // Update the gist
    const response = await prisma.gist.update({
      where: {
        slug: params.slug,
      },
      data: {
        title: res.title,
        slug: slugify(res.title),
        description: res.description || null,
        from: res.from,
        to: res.to,
      },
      include: {
        topics: true,
        author: {
          select: {
            id: true,
            name: true,
            email: true
          }
        }
      }
    })

    return NextResponse.json({
      message: "Gist updated successfully!",
      success: true,
      gist: response,
    })

  } catch (error) {
    console.error('Error updating gist:', error)
    return NextResponse.json(
      {
        message: "Internal server error",
        success: false,
        error: process.env.NODE_ENV === 'development' ? error : undefined
      },
      { status: 500 }
    )
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: { slug: string } }
) {
  try {
    // Get session from NextAuth
    const session = await getServerSession(authOptions)

    // Check if user is authenticated
    if (!session || !session.user) {
      return NextResponse.json(
        {
          message: "Unauthorized - Please sign in",
          success: false
        },
        { status: 401 }
      )
    }

    // Get user from database
    const user = await prisma.user.findUnique({
      where: {
        email: session.user.email!
      }
    })

    if (!user) {
      return NextResponse.json(
        {
          message: "User not found in database",
          success: false
        },
        { status: 404 }
      )
    }

    // Check if gist exists and belongs to the user
    const existingGist = await prisma.gist.findFirst({
      where: {
        slug: params.slug,
        author_id: user.id
      }
    })

    if (!existingGist) {
      return NextResponse.json(
        {
          message: "Gist not found or you don't have permission to delete it",
          success: false
        },
        { status: 403 }
      )
    }

    // Delete the gist (this will also delete related topics due to cascade)
    const response = await prisma.gist.delete({
      where: {
        slug: params.slug,
      },
    })

    return NextResponse.json({
      message: "Gist deleted successfully!",
      success: true,
      data: response,
    })

  } catch (error) {
    console.error('Error deleting gist:', error)
    return NextResponse.json(
      {
        message: "Internal server error",
        success: false,
        error: process.env.NODE_ENV === 'development' ? error : undefined
      },
      { status: 500 }
    )
  }
}