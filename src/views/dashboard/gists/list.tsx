"use client";

import { Button } from "@/components";
import { paths } from "@/lib";
import GistListTableSection from "@/sections/gists/list";
import { Icon } from "@iconify/react";
import Link from "next/link";

export default function GistsListView(): JSX.Element {
  return (
    <div className="flex flex-col ">
      <div className="flex w-full justify-end">
        <Button>
          <Link
            href={paths.dashboard.gists.create}
            className="inline-flex align-middleinline-flex items-center justify-center whitespace-nowrap"
          >
            <Icon icon="tabler:plus" />
            Add Gist
          </Link>
        </Button>
      </div>
      <GistListTableSection />
    </div>
  );
}
