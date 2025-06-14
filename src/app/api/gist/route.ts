import { getServerSession } from "next-auth/next"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma-client"
import { NextRequest, NextResponse } from "next/server"
import { slugify } from "@/utils";


export async function GET() {
  const response = await prisma.gist.findMany({
    include: {
      topics: true,
      author: true,
      assigner: true,
    },
  });

  return NextResponse.json({
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
      return NextResponse.json(
        {
          error: "Unauthorized - Please sign in",
        },
        { status: 401 }
      )
    }

    // Get request body
    const res = await req.json()

    // Validate required fields
    if (!res.title || !res.from || !res.to || !res.organizationId ) { 
      return NextResponse.json(
        {
          error: `Missing required fields: ${["title", "from", "to", "organizationId"].filter(field => !res[field]).join(", ")}`,
        },
        { status: 400 }
      )
    }

    // Create the gist
    const response = await prisma.gist.create({
      data: {
        title: res.title,
        slug: slugify(res.title),
        description: res.description,
        from: new Date(res.from),
        to: new Date(res.to),
        organization:{
          connect: {
            id: res.organizationId
          }
        },
        author: {
          connect: {
            id: res.authorId
          }
        },
        assigner:{
          connect:{id: res.assignedBy}
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

    return NextResponse.json({
      message: "Gist created successfully!",
      data: response,
    })

  } catch (error) {
    console.error('Error creating gist:', error)

    return NextResponse.json(
      {
        message: "Internal server error",
        error: process.env.NODE_ENV === 'development' ? error : undefined
      },
      { status: 500 }
    )
  }
}