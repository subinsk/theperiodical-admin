import { auth } from "@/auth";
import { prisma } from "@/lib";
import { slugify } from "@/utils";

export async function GET() {
  const response = await prisma.gist.findMany({
    include: {
      topics: true,
    },
  });

  return Response.json({
    message: "Gists fetched successfully!",
    gists: response,
  });
}

export async function POST(req: Request) {
  const res = await req.json();
  const authObj: any = await auth();

  const response = await prisma.gist.create({
    data: {
      title: res.title,
      slug: slugify(res.title),
      description: res.description,
      author: {
        connect: {
          id: authObj.userId,
        },
      },
      from: res.from,
      to: res.to,
    },
  });

  return Response.json({
    message: "Gist created successfully!",
    data: response,
  });
}
