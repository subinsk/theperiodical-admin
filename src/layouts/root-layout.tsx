// layouts/root-layout.tsx
"use client"

import { AppProgressBar as ProgressBar } from "next-nprogress-bar"
import { Toaster } from "react-hot-toast"
import { ReactNode, useEffect, useState } from "react"
import { DesktopOnlyView } from "@/components/desktop-only-view"
import { Loader } from "@/components/ui/loader"

interface RootLayoutProps {
  children: ReactNode
}

export default function RootLayout({ children }: RootLayoutProps): JSX.Element {  
  // states
  const [isMobile, setIsMobile] = useState<boolean | null>(null);

  // effects
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  if(isMobile === null) {
    return <Loader/>;
  }

  return (
    <>
      {isMobile ? <DesktopOnlyView /> : children}
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