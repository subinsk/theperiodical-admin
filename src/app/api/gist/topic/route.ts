import { getServerSession } from "next-auth/next"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma-client"
import { NextRequest } from "next/server"

export async function GET() {
  const response = await prisma.topic.findMany({
    include: {
      gist: true,
    },
  });

  return Response.json({
    message: "Topics fetched successfully!",
    data: response,
  });
}

export async function POST(req: NextRequest) {
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
    if (!res.title || !res.content || !res.gistId) {
      return Response.json(
        {
          message: "Missing required fields: title, content, gistId",
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

    // Verify that the gist exists and belongs to the user
    const gist = await prisma.gist.findFirst({
      where: {
        id: res.gistId,
        author_id: user.id
      }
    })

    if (!gist) {
      return Response.json(
        {
          message: "Gist not found or you don't have permission to add topics to it",
          success: false
        },
        { status: 403 }
      )
    }    // Get the highest order number from existing topics
    const highestOrderTopic = await prisma.topic.findFirst({
      where: {
        gist_id: res.gistId
      },
      orderBy: {
        order: 'desc'
      }
    });

    const nextOrder = (highestOrderTopic?.order ?? -1) + 1;

    // Create the topic with the next order number
    const response = await prisma.topic.create({
      data: {
        title: res.title,
        content: res.content,
        order: nextOrder,
        gist: {
          connect: {
            id: res.gistId,
          },
        },
      },
      include: {
        gist: {
          select: {
            id: true,
            title: true,
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
      message: "Topic created successfully!",
      success: true,
      data: response,
    })

  } catch (error) {
    console.error('Error creating topic:', error)

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
