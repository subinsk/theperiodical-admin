"use server";

import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma-client";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export async function PATCH(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user) {
      return Response.json(
        { message: "Unauthorized", success: false },
        { status: 401 }
      );
    }

    const res = await req.json();
    
    if (!res.topics || !Array.isArray(res.topics)) {
      return Response.json(
        { message: "Topics array is required", success: false },
        { status: 400 }
      );
    }

    // First, verify the user has permission to update these topics
    const firstTopic = await prisma.topic.findFirst({
      where: {
        id: res.topics[0].id,
      },
      include: {
        gist: {
          select: {
            author_id: true
          }
        }
      }
    });

    if (!firstTopic || firstTopic.gist.author_id !== session.user.id) {
      return Response.json(
        { message: "You don't have permission to reorder these topics", success: false },
        { status: 403 }
      );
    }

    // Update all topics in a transaction
    await prisma.$transaction(
      res.topics.map((topic: { id: string; order: number }) =>
        prisma.topic.update({
          where: { id: topic.id },
          data: { order: topic.order }
        })
      )
    );

    return Response.json({
      message: "Topics reordered successfully!",
      success: true
    });

  } catch (error) {
    console.error('Error reordering topics:', error);
    return Response.json(
      { message: "Internal server error", success: false },
      { status: 500 }
    );
  }
}
