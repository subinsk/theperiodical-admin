// types/next-auth.d.ts
import type NextAuth from "next-auth"
import type { Role, Status } from "@prisma/client"

declare module "next-auth" {
    interface Session {
        user: {
            id: string
            email: string
            name?: string | null
            image?: string | null
            role?: Role | null
            status?: Status | null
        }
    }

    interface User {
        id: string
        email: string
        name?: string | null
        image?: string | null
        role?: Role | null
        status?: Status | null
    }
}

declare module "next-auth/jwt" {
    interface JWT {
        sub?: string
        role?: Role | null
        status?: Status | null
    }
}