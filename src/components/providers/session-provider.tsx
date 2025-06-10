// components/providers/session-provider.tsx
"use client"

import { SessionProvider } from "next-auth/react"
import type { ReactNode } from "react"
import type { Session } from "next-auth"

interface SessionProviderWrapperProps {
    children: ReactNode
    session?: Session | null
}

export function SessionProviderWrapper({
    children,
    session
}: SessionProviderWrapperProps): JSX.Element {
    return (
        <SessionProvider session={session}>
            {children}
        </SessionProvider>
    )
}