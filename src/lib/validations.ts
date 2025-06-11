import { Role } from "@prisma/client";
import { NextResponse } from "next/server";

export const validateRole = (role: any) => {
    if (!Object.values(Role).includes(role)) {
        return NextResponse.json({ error: 'Invalid role' }, { status: 400 });
    }
}

export const validateParameters = (params: Record<string, any>, requiredParams: string[]) => {
    const missingParams = requiredParams.filter(param => !params[param]);
    if (missingParams.length > 0) {
        return NextResponse.json({ error: `${missingParams.join(', ')} ${missingParams.length > 1 ? 'are' : 'is'} required` }, { status: 400 });
    }
    return null;
}

