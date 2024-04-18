import { auth } from "@/auth";
import { prisma } from "@/lib";

export async function GET(
  req: Request,
  { params }: { params: { slug: string } }
) {
  const response = await prisma.gist.findUnique({
    where: {
      slug: params.slug,
    },
  });

  return Response.json({
    message: "Gist fetched successfully!",
    gists: [response],
  });
}

export async function PUT(
  req: Request,
  { params }: { params: { slug: string } }
) {
  const res = await req.json();
  const authObj: any = await auth();

  const response = await prisma.gist.update({
    where: {
      slug: params.slug,
    },
    data: {
      title: res.title,
      description: res.description,
      from: res.from,
      to: res.to,
    },
  });

  return Response.json({
    message: "Gist updated successfully!",
    data: response,
  });
}
