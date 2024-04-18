import type { Metadata } from "next";
import "./globals.css";
import RootLayout from "@/layouts/root-layout";

export const metadata: Metadata = {
  title: "The Periodical",
  description: "Admin panel for The Periodical",
};

export default function Layout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <RootLayout>{children}</RootLayout>
      </body>
    </html>
  );
}
