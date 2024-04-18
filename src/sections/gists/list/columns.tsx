"use client";

import { Button } from "@/components";
import { paths } from "@/lib";
import { fDate } from "@/utils/format-time";
import { Icon } from "@iconify/react";
import { Gist } from "@prisma/client";
import { ColumnDef } from "@tanstack/react-table";
import Link from "next/link";

export const columns: ColumnDef<Gist>[] = [
  {
    accessorKey: "title",
    header: "Title",
  },
  {
    accessorKey: "from",
    header: "From",
    cell(props: any) {
      return <div>{fDate(props.row.original.from)}</div>;
    },
  },
  {
    accessorKey: "to",
    header: "To",
    cell(props: any) {
      return <div>{fDate(props.row.original.from)}</div>;
    },
  },
  {
    accessorKey: "actions",
    header: "Actions",
    cell(props: any) {
      return (
        <div className="flex gap-2 items-center">
          <Link href={paths.dashboard.gists.edit(props.row.original.slug)}>
            <Button variant="outline" size="icon">
              <Icon icon="tabler:pencil" width={16} />
            </Button>
          </Link>
          <Button variant="outline" size="icon">
            <Icon icon="tabler:trash" width={16} />
          </Button>
        </div>
      );
    },
  },
];
