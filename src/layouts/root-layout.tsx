// layouts/root-layout.tsx
"use client"

import { AppProgressBar as ProgressBar } from "next-nprogress-bar"
import { Toaster } from "react-hot-toast"
import type { ReactNode } from "react"

interface RootLayoutProps {
  children: ReactNode
}

export default function RootLayout({ children }: RootLayoutProps): JSX.Element {
  return (
    <>
      {children}
      <ProgressBar
        height="4px"
        color="#4318FF"
        options={{ showSpinner: false }}
        shallowRouting
      />
      <Toaster />
    </>
  )
}