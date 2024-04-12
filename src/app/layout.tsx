import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "The Periodical",
  description: "Admin panel for The Periodical",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
