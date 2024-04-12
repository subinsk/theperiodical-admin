"use client";

import { usePathname } from "next/navigation";
import React, { useState } from "react";
import { Footer, Navbar } from "@/components";
import { Sidebar } from "@/components/sidebar";
import { routes } from "@/lib";
import { getActiveNavbar, getActiveRoute } from "@/utils";

export default function Layout({
  children,
}: {
  children: React.ReactNode;
}): JSX.Element {
  // states and functions
  const [open, setOpen] = useState(false);
  const pathname = usePathname();
  return (
    <div className="flex h-full w-full bg-background-100 dark:bg-background-900">
      <Sidebar open={open} routes={routes} setOpen={setOpen} variant="admin" />
      <div className="h-full w-full font-dm dark:bg-navy-900">
        <main
          className={`mx-2.5  flex-none transition-all dark:bg-navy-900 
              md:pr-2 xl:ml-[323px]`}
        >
          <div>
            <Navbar
              brandText={getActiveRoute(routes, pathname)}
              onOpenSidenav={() => {
                setOpen(!open);
              }}
              secondary={getActiveNavbar(routes, pathname)}
            />
            <div className="mx-auto min-h-screen p-2 !pt-[30px] md:p-2">
              {children}
            </div>
            <div className="p-3">
              <Footer />
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
