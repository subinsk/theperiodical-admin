import { prisma } from "@/lib";
import sendResponse from "@/lib/response";

export async function GET(request: Request,
    { params }: { params: { id: string } }) {
    const { id } = params

    const response = await prisma.user.findUnique({
        where: {
            id
        }
    });

    return sendResponse({
        message: "User fetched successfully!",
        success: true,
        data: response,
    });
}

export async function PUT(request: Request,
    { params }: { params: { id: string } }) {
    const { id } = params
    const res: any = await request.json()

    const response = await prisma.user.update({
        where: {
            id
        },
        data: {
            ...res
        }
    });

    return sendResponse({
        message: "User updated successfully!",
        success: true,
        data: response,
    });
}