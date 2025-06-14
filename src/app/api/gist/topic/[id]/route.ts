import { getServerSession } from "next-auth/next"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma-client"
import { NextRequest } from "next/server"

export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const response = await prisma.topic.findUnique({
      where: {
        id: params.id,
      },
      include: {
        gist: {
          include: {
            author: {
              select: {
                id: true,
                name: true,
                email: true,
                image: true,
                role: true
              }
            }
          }
        },
      },
    })

    if (!response) {
      return Response.json(
        {
          message: "Topic not found",
          success: false,
        },
        { status: 404 }
      )
    }

    return Response.json({
      message: "Topic fetched successfully!",
      success: true,
      data: response,
    })

  } catch (error) {
    console.error('Error fetching topic:', error)
    return Response.json(
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
  { params }: { params: { id: string } }
) {
  try {
    // Get session from NextAuth
    const session = await getServerSession(authOptions)

    // Check if user is authenticated
    if (!session || !session.user) {
      return Response.json(
        { 
          message: "Unauthorized - Please sign in", 
          success: false 
        },
        { status: 401 }
      )
    }

    // Get request body
    const res = await req.json()

    // Validate required fields
    if (!res.title || !res.content) {
      return Response.json(
        { 
          message: "Missing required fields: title, content", 
          success: false 
        },
        { status: 400 }
      )
    }

    // Get user from database
    const user = await prisma.user.findUnique({
      where: {
        email: session.user.email!
      }
    })

    if (!user) {
      return Response.json(
        { 
          message: "User not found in database", 
          success: false 
        },
        { status: 404 }
      )
    }

    // Check if topic exists and user owns the parent gist
    const existingTopic = await prisma.topic.findUnique({
      where: {
        id: params.id,
      },
      include: {
        gist: {
          select: {
            id: true,
            author_id: true,
            title: true
          }
        }
      }
    })

    if (!existingTopic) {
      return Response.json(
        { 
          message: "Topic not found", 
          success: false 
        },
        { status: 404 }
      )
    }

    if (existingTopic.gist?.author_id !== user.id) {
      return Response.json(
        { 
          message: "You don't have permission to update this topic", 
          success: false 
        },
        { status: 403 }
      )
    }

    // Update the topic
    const response = await prisma.topic.update({
      where: {
        id: params.id,
      },
      data: {
        title: res.title,
        content: res.content,
      },
      include: {
        gist: {
          select: {
            id: true,
            title: true,
            slug: true,
            author: {
              select: {
                id: true,
                name: true,
                email: true
              }
            }
          }
        }
      }
    })

    return Response.json({
      message: "Topic updated successfully!",
      success: true,
      data: response,
    })

  } catch (error) {
    console.error('Error updating topic:', error)
    return Response.json(
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
  { params }: { params: { id: string } }
) {
  try {
    // Get session from NextAuth
    const session = await getServerSession(authOptions)

    // Check if user is authenticated
    if (!session || !session.user) {
      return Response.json(
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
      return Response.json(
        { 
          message: "User not found in database", 
          success: false 
        },
        { status: 404 }
      )
    }

    // Delete the topic
    const response = await prisma.topic.delete({
      where: {
        id: params.id,
      },
    })

    return Response.json({
      message: "Topic deleted successfully!",
      success: true,
      data: response,
    })

  } catch (error) {
    console.error('Error deleting topic:', error)
    return Response.json(
      {
        message: "Internal server error",
        success: false,
        error: process.env.NODE_ENV === 'development' ? error : undefined
      },
      { status: 500 }
    )
  }
}