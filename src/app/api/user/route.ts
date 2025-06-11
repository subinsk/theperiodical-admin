import { prisma } from "@/lib/prisma-client";
import sendResponse from "@/lib/response";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
    try {
        const { searchParams } = new URL(request.url);
        const organizationId = searchParams.get('organizationId');

        const response = await prisma.user.findMany({
            where: {
                OR: [
                    {
                        role: "org_admin"
                    },
                    {
                        role: "manager"
                    },
                    {
                        role: "content_writer"
                    }
                ],
                organization_id: organizationId ? organizationId : undefined
            }
        });

        return sendResponse({
            message: "Users fetched successfully!",
            success: true,
            data: response,
        });
    } catch (error) {
        console.error("Error fetching users:", error);
        return NextResponse.json({
            message: "Failed to fetch users",
            success: false,
            error: error instanceof Error ? error.message : "Unknown error"
        }, { status: 500 });
    }
}