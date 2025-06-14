"use client";

import { Button } from "@/components";
import { paths } from "@/lib";
import { endpoints } from "@/lib/axios";
import { deleteGist } from "@/services/gist.service";
import { fDate } from "@/utils/format-time";
import { Icon } from "@iconify/react";
import { Gist } from "@prisma/client";
import { ColumnDef } from "@tanstack/react-table";
import Link from "next/link";
import toast from "react-hot-toast";
import { mutate } from "swr";

export const columns: ColumnDef<Gist>[] = [
  {
    accessorKey: "title",
    header: "Title",
  },
  {
    accessorKey: "from",
    header: "From",
    cell(props: any) {
      return (
        <div className="text-nowrap">{fDate(props.row.original.from)}</div>
      );
    },
    minSize: 200,
  },
  {
    accessorKey: "to",
    header: "To",
    cell(props: any) {
      return <div className="text-nowrap">{fDate(props.row.original.to)}</div>;
    },
  },
  {
    accessorKey: "author",
    header: "Author",
    cell(props: any) {
      return <div className="text-nowrap">{props.row.original.author}</div>;
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
          <Button
            variant="outline"
            size="icon"
            onClick={async () => {
              const toastId = toast.loading("Deleting...");

              const response = await deleteGist(props.row.original.slug);

              if (response.success) {
                mutate(endpoints.gist);
                toast.success("Gist deleted successfully!", {
                  id: toastId,
                });
              } else {
                toast.error("Gist deletion failed!", {
                  id: toastId,
                });
              }
            }}
          >
            <Icon icon="tabler:trash" width={16} />
          </Button>
        </div>
      );
    },
  },
];
