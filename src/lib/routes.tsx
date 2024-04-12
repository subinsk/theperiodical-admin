import React from "react";
import { IoNewspaperOutline } from "react-icons/io5";
import { MdDashboard } from "react-icons/md";

export const routes = [
  {
    name: "Dashboard",
    layout: "/dashboard",
    path: "",
    icon: <MdDashboard className="h-6 w-6" />,
  },
  {
    name: "Gists",
    layout: "/dashboard",
    path: "gists",
    icon: <IoNewspaperOutline className="h-6 w-6" />,
  },
];
