import { prisma } from "@/lib/prisma-client";
import sendResponse from "@/lib/response";

export async function GET() {
    const response = await prisma.user.findMany({
        where: {
            OR: [
                {
                    role: "member"
                },
                {
                    role: "admin"
                }
            ]
        }
    });

    return sendResponse({
        message: "Users fetched successfully!",
        success: true,
        data: response,
    });
}