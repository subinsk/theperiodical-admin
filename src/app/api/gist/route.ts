import { prisma } from "@/lib";
import { createClient } from "@/lib/supabase/server";
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

export async function POST(req: Request) {
  const supabase = createClient()

  const res = await req.json();

  const { data: {
    user
  } }: any = await supabase.auth.getUser()

  const response = await prisma.gist.create({
    data: {
      title: res.title,
      slug: slugify(res.title),
      description: res.description,
      from: res.from,
      to: res.to,
      author: {
        connect: {
          id: user.id
        }
      }
    },
  });

  return Response.json({
    message: "Gist created successfully!",
    success: true,
    data: response,
  });
}
