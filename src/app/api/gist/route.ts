import { getServerSession } from "next-auth/next"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma-client"
import { NextRequest } from "next/server"
import { slugify } from "@/utils";


export async function GET() {
  const response = await prisma.gist.findMany({
    include: {
      topics: true,
    },
  });

  return Response.json({
    message: "Gists fetched successfully!",
    success: true,
    gists: response,
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
    if (!res.title || !res.from || !res.to) {
      return Response.json(
        {
          message: "Missing required fields: title, from, to",
          success: false
        },
        { status: 400 }
      )
    }

    // Get user from database to ensure they exist
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

    // Create the gist
    const response = await prisma.gist.create({
      data: {
        title: res.title,
        slug: slugify(res.title),
        description: res.description || null,
        from: new Date(res.from),
        to: new Date(res.to),
        author: {
          connect: {
            id: user.id
          }
        }
      },
      include: {
        author: {
          select: {
            id: true,
            name: true,
            email: true,
            role: true
          }
        }
      }
    })

    return Response.json({
      message: "Gist created successfully!",
      success: true,
      data: response,
    })

  } catch (error) {
    console.error('Error creating gist:', error)

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