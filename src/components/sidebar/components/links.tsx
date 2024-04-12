"use client";

import { DashIcon, NavLink } from "@/components";
import { RoutesType } from "@/types";
import { usePathname } from "next/navigation";
import { useCallback } from "react";

export function Links(props: { routes: RoutesType[] }): JSX.Element {
  // Chakra color mode
  const pathname = usePathname();

  const { routes } = props;

  // verifies if routeName is the one active (in browser input)
  const activeRoute = useCallback(
    (routeName: string) => {
      console.log(pathname, routeName);
      return pathname === routeName;
    },
    [pathname]
  );

  const createLinks = (_routes: RoutesType[]): (JSX.Element | null)[] => {
    return _routes.map((route, index) => {
      if (
        route.layout === "/dashboard" ||
        route.layout === "/auth" ||
        route.layout === "/rtl"
      ) {
        return (
          <NavLink href={`${route.layout}/${route.path}`} key={`${index + 1}`}>
            <div className="relative mb-3 flex hover:cursor-pointer">
              <li
                className="my-[3px] flex cursor-pointer items-center px-8"
                key={`${index + 1}`}
              >
                <span
                  className={`${
                    activeRoute(`${route.layout}/${route.path}`)
                      ? "font-bold text-brand-500 dark:text-white"
                      : "font-medium text-gray-600"
                  }`}
                >
                  {route.icon ? route.icon : <DashIcon />}{" "}
                </span>
                <p
                  className={`leading-1 ml-4 flex ${
                    activeRoute(`${route.layout}/${route.path}`)
                      ? "font-bold text-navy-700 dark:text-white"
                      : "font-medium text-gray-600"
                  }`}
                >
                  {route.name}
                </p>
              </li>
              {activeRoute(`${route.layout}/${route.path}`) ? (
                <div className="absolute right-0 top-px h-9 w-1 rounded-lg bg-brand-500 dark:bg-brand-400" />
              ) : null}
            </div>
          </NavLink>
        );
      }
      return null;
    });
  };
  // BRAND
  return <>{createLinks(routes)}</>;
}
