"use client";

import { Card, CardContent, Grid, Stack, Typography } from "@/components";
import Link from "next/link";
import { Icon } from "@iconify/react";
import { IoNewspaperOutline } from "react-icons/io5";
import { useSession } from "next-auth/react";
import { DataCards } from "@/sections/dashboard/data-cards";
import { TrendingChart } from "@/sections/dashboard/trending-chart";
import { TrendingBarChart } from "@/sections/dashboard/trending-bar-chart";

export default function Page(): JSX.Element {
  // hooks
  const {
    data: session,
    status
  } = useSession();

  // variables
  const items = [
    {
      title: "Gists",
      icon: <IoNewspaperOutline className="h-8 w-8" />,
      href: "/dashboard/gists",
    },
    {
      title: "Settings",
      icon: <Icon icon="tabler:settings" className="h-6 w-6" />,
      href: "/dashboard/settings",
    },
  ];

  return (
    <div className="grid grid-cols-12 gap-4">
      <Typography variant="h3" className="mb-4 col-span-12">
        Welcome, {session?.user?.name || session?.user?.email}!
      </Typography>

      <div className="col-span-5">
        <TrendingChart />

      </div>
      <div className="col-span-7">
        <DataCards />
      </div>
      <div className="col-span-12">
        <Typography variant="h4" className="mt-4 mb-2">
          Browse
        </Typography>
        <Stack direction="row" wrap="wrap" gap={4}>
          {items.map((item, index) => (
            <Link href={item.href} key={index}>
              <Card className="w-[250px] h-[180px] shadow-sm cursor-pointer transition-all duration-200 ease-in-out transform hover:shadow-lg">
                <CardContent className="px-4">
                  <Stack direction="row" align="center" gap={3}>
                    {item.icon}
                    <Typography variant="h3">{item.title}</Typography>
                  </Stack>
                </CardContent>
              </Card>
            </Link>
          ))}
        </Stack>
      </div>
      <div className="col-span-12">
        <Typography variant="h4" className="mt-4 mb-2">
          Trending By Device
        </Typography>
        <TrendingBarChart />
      </div>
    </div>
  );
}
