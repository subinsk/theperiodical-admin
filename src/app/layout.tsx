// app/layout.tsx
import type { Metadata } from "next"
import "./globals.css"
import RootLayout from "@/layouts/root-layout"
import { SessionProviderWrapper } from "@/components/providers/session-provider"
import type { ReactNode } from "react"

export const metadata: Metadata = {
  title: "The Periodical",
  description: "Admin panel for The Periodical",
}

interface LayoutProps {
  children: ReactNode
}

export default function Layout({ children }: Readonly<LayoutProps>): JSX.Element {
  return (
    <html lang="en">
      <body>
        <SessionProviderWrapper>
          <RootLayout>{children}</RootLayout>
        </SessionProviderWrapper>
      </body>
    </html>
  )
}