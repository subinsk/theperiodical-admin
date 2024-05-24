"use client";

import { AppProgressBar as ProgressBar } from "next-nprogress-bar";
import { Toaster } from "react-hot-toast";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
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
  );
}
