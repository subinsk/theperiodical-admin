// lib/auth.ts
import type { NextAuthOptions } from "next-auth"
import { PrismaAdapter } from "@next-auth/prisma-adapter"
import CredentialsProvider from "next-auth/providers/credentials"
import GoogleProvider from "next-auth/providers/google"
import type { Adapter } from "next-auth/adapters"
import { prisma } from "@/lib/prisma-client" // Adjust path as needed
import bcrypt from "bcryptjs"
import type { Role, Status } from "@prisma/client"

interface AuthorizeCredentials {
    email: string
    password: string
}

interface DatabaseUser {
    id: string
    email: string
    name: string | null
    password: string | null
    image: string | null
    role: Role | null
    status: Status | null
    organization_id?: string | null
    organization?: {
        id: string
        name: string
        slug: string
    } | null
    
}

export const authOptions: NextAuthOptions = {
    adapter: PrismaAdapter(prisma) as Adapter,
    providers: [
        GoogleProvider({
            clientId: process.env.AUTH_GOOGLE_ID as string,
            clientSecret: process.env.AUTH_GOOGLE_SECRET as string,
        }),
        CredentialsProvider({
            name: "credentials",
            credentials: {
                email: { label: "Email", type: "email" },
                password: { label: "Password", type: "password" }
            },
            async authorize(credentials: Record<keyof AuthorizeCredentials, string> | undefined) {
                if (!credentials?.email || !credentials?.password) {
                    return null
                }

                const user: DatabaseUser | null = await prisma.user.findUnique({
          where: { email: credentials.email },
          include: {
            organization: {
              select: { id: true, name: true, slug: true }
            }
          }
        });

                if (!user || !user.password) {
                    return null
                }

                const isPasswordValid: boolean = await bcrypt.compare(
                    credentials.password,
                    user.password
                )

                if (!isPasswordValid) {
                    return null
                }

                return {
                    id: user.id,
                    email: user.email,
                    name: user.name,
                    image: user.image,
                    role: user.role,
                    status: user.status,
                    organization_id: user.organization_id,
          organization: user.organization,
                }
            }
        })
    ],
    session: {
        strategy: "jwt" as const,
    },
    callbacks: {
        async jwt({ token, user }) {
            if (user) {
                token.role = user.role
                token.status = user.status
                token.organization_id = user.organization_id;
        token.organization = user.organization;
            }
            return token
        },
        async session({ session, token }) {
            if (token && token.sub) {
                session.user.id = token.sub
                session.user.role = token.role
                session.user.status = token.status
                session.user.organization_id = token.organization_id;
                session.user.organization = token.organization;
            }
            return session
        },
        async redirect({ url, baseUrl }): Promise<string> {
            // Redirect to dashboard after login
            if (url.startsWith("/auth/login") || url === baseUrl) {
                return `${baseUrl}/dashboard`
            }
            // Allows relative callback URLs
            if (url.startsWith("/")) return `${baseUrl}${url}`
            // Allows callback URLs on the same origin
            if (new URL(url).origin === baseUrl) return url
            return baseUrl
        }
    },
    pages: {
        signIn: "/auth/login",
        // signUp: "/auth/register", // If you have a custom signup page
    },
    secret: process.env.NEXTAUTH_SECRET as string,
}