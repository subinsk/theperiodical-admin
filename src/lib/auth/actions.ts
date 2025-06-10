// lib/auth/actions.ts
"use server"

import { signOut as nextAuthSignOut } from "next-auth/react"
import { redirect } from "next/navigation"

export async function signOut(): Promise<void> {
    try {
        await nextAuthSignOut({
            redirect: false,
        })
    } catch (error) {
        console.error("Sign out error:", error)
        // Even if there's an error, redirect to login
    }

    redirect("/auth/login")
}

// For client-side usage
export async function clientSignOut(): Promise<void> {
    try {
        await nextAuthSignOut({
            callbackUrl: "/auth/login",
        })
    } catch (error) {
        console.error("Client sign out error:", error)
        window.location.href = "/auth/login"
    }
}