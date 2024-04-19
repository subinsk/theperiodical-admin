import { auth } from "@/auth";
import { prisma } from "@/lib";
import { slugify } from "@/utils";

export async function GET(
  req: Request,
  { params }: { params: { slug: string } }
) {
  const response = await prisma.gist.findUnique({
    where: {
      slug: params.slug,
    },
    include: {
      topics: true,
    },
  });

  return Response.json({
    message: "Gist fetched successfully!",
    success: true,
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
      slug: slugify(res.title),
      description: res.description,
      from: res.from,
      to: res.to,
    },
  });

  return Response.json({
    message: "Gist updated successfully!",
    success: true,
    data: response,
  });
}

export async function DELETE(
  req: Request,
  { params }: { params: { slug: string } }
) {
  const response = await prisma.gist.delete({
    where: {
      slug: params.slug,
    },
  });

  return Response.json({
    message: "Gist deleted successfully!",
    success: true,
    data: response,
  });
}
