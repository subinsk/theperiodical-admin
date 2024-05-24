import { prisma } from "@/lib";
import { createClient } from "@/lib/supabase/server";

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

export async function POST(req: Request) {
  const supabase = createClient()

  const res = await req.json();

  const { data: {
    user
  } }: any = await supabase.auth.getUser()

  const response = await prisma.topic.create({
    data: {
      title: res.title,
      content: res.content,
      gist: {
        connect: {
          id: res.gistId,
        },
      },
    },
  });

  return Response.json({
    message: "Topic created successfully!",
    success: true,
    data: response,
  });
}
