import { prisma } from "@/lib";

export async function GET(
  req: Request,
  { params }: { params: { id: string } }
) {
  const response = await prisma.topic.findUnique({
    where: {
      id: params.id,
    },
    include: {
      gist: true,
    },
  });

  return Response.json({
    message: "Topic fetched successfully!",
    data: response,
  });
}

export async function PUT(
  req: Request,
  { params }: { params: { id: string } }
) {
  const res = await req.json();
  const response = await prisma.topic.update({
    where: {
      id: params.id,
    },
    data: {
      title: res.title,
      content: res.content,
    },
  });

  return Response.json({
    message: "Topic updated successfully!",
    data: response,
  });
}

export async function DELETE(
  req: Request,
  { params }: { params: { id: string } }
) {
  const response = await prisma.topic.delete({
    where: {
      id: params.id,
    },
  });

  return Response.json({
    message: "Topic deleted successfully!",
    data: response,
  });
}
