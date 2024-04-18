import { auth } from "@/auth";
import { prisma } from "@/lib";

export async function POST(req: Request) {
  const res = await req.json();
  const authObj: any = await auth();

  console.log("res", res, authObj);

  // const response = await prisma.gist.create({
  //   data: {
  //     title: res.title,
  //     content: res.content,
  //     authorId: authObj.,
  //   },

  // })

  return Response.json({
    message: "Gist created successfully!",
  });
}
