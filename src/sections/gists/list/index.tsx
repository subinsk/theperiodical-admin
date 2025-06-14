import { Button, DataTable } from "@/components";
import { deleteGist, useGetGists } from "@/services/gist.service";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { ColumnDef } from "@tanstack/react-table";
import { Gist } from "@prisma/client";
import { fDate } from "@/utils/format-time";
import Link from "next/link";
import { paths } from "@/lib";
import { Icon } from "@iconify/react/dist/iconify.js";
import { ConfirmDialog } from "@/components/ui/confirm-dialog";

export default function GistListTableSection() {
  const {
    gists: data,
    gistsLoading: isLoading,
    gistsError: error,
    gistsValidating: isValidating,
    gistsEmpty: isEmpty,
    refetch: refetchGists,
  } = useGetGists();

  // states
  const [openConfirmGistDeleteDialog, setOpenConfirmGistDeleteDialog] =
    useState<boolean>(false);
  const [selectedGistToDelete, setSelectedGistToDelete] =
    useState<Gist | null>(null);
  const [isGistDeleteLoading, setIsGistDeleteLoading] =
    useState<boolean>(false);

  // functions
  const handleDeleteGist = async () => {
    try {
      setIsGistDeleteLoading(true);
      await deleteGist(selectedGistToDelete?.slug || "");
      refetchGists();
      toast.success("Gist deleted successfully!");
    } catch (error) {
      console.error("Error deleting gist:", error);
      toast.error("An error occurred while deleting the gist.");
    } finally {
      setOpenConfirmGistDeleteDialog(false);
      setIsGistDeleteLoading(false);
      setSelectedGistToDelete(null);
    }
  }

  const columns: ColumnDef<Gist>[] = [
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
        return <div className="text-nowrap">{props.row.original.author.name}</div>;
      },
    },
    {
      accessorKey: "assigner",
      header: "Assigner",
      cell(props: any) {
        return <div className="text-nowrap">{props.row.original.assigner.name}</div>;
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
              onClick={() => {
                setOpenConfirmGistDeleteDialog(true);
                setSelectedGistToDelete(props.row.original);
              }}
            >
              <Icon icon="tabler:trash" width={16} />
            </Button>
          </div>
        );
      },
    },
  ];

  // const data = [
  //   {
  //     id: "701804a8-ca23-4c4e-85af-06d0e18bd569",
  //     title: "Revitalizing the India-Myanmar-Thailand Trilateral Highway",
  //     description:
  //       "India's External affairs minister recently met his Myanmar counterpart and discussed expediting projects, especially the India-Myanmar-Thailand trilateral highway",
  //     from: new Date("2024-02-11 18:30:00"),
  //     to: new Date("2024-02-18 18:30:00"),
  //     createdAt: new Date("2024-04-18 20:08:32.379"),
  //     updatedAt: new Date("2024-04-18 20:08:32.379"),
  //     authorId: "1316ce29-08bd-4578-a536-33ef6fed601c",
  //     slug: "revitalizing-the-india-myanmar-thailand-trilateral-highway",
  //   },
  //   {
  //     id: "af071dc6-f10e-4539-b6b8-78aeaaad396e",
  //     title:
  //       "Exploring the Impact and Implications of Windfall Taxes on India's Petroleum Industry",
  //     description:
  //       "The Indian government recently reimposed a windfall tax on domestic petroleum crude.",
  //     from: new Date("2024-02-18 18:30:00"),
  //     to: new Date("2024-02-24 18:30:00"),
  //     createdAt: new Date("2024-04-18 20:17:46.926"),
  //     updatedAt: new Date("2024-04-18 20:17:46.926"),
  //     authorId: "1316ce29-08bd-4578-a536-33ef6fed601c",
  //     slug: "exploring-the-impact-and-implications-of-windfall-taxes-on-indias-petroleum-industry",
  //   },
  //   {
  //     id: "f8169450-b033-40a6-ba86-ff25c0846128",
  //     title:
  //       "International Military Drills: Strategic Collaboration in the Sea of Japan",
  //     description:
  //       'A Chinese naval flotilla recently set off to join Russian naval and air forces in the Sea of Japan to participate in the "Northern/Interaction-2023" military drills.',
  //     from: new Date("2024-01-28 18:30:00"),
  //     to: new Date("2024-02-03 18:30:00"),
  //     createdAt: new Date("2024-04-18 22:22:45.422"),
  //     updatedAt: new Date("2024-04-18 22:22:45.422"),
  //     authorId: "1316ce29-08bd-4578-a536-33ef6fed601c",
  //     slug: "international-military-drills-strategic-collaboration-in-the-sea-of-japan",
  //   },
  //   {
  //     id: "f5922b35-32d7-4e65-8c99-3ec03e508b33",
  //     title: "Conservation Efforts for Hoolock Gibbons",
  //     description:
  //       "It has a much wider range, as it is found in all the states of the north-east, restricted between the south of the Brahmaputra river and east of the Dibang river.",
  //     from: new Date("2024-01-21 18:30:00"),
  //     to: new Date("2024-01-27 18:30:00"),
  //     createdAt: new Date("2024-04-18 22:33:17.594"),
  //     updatedAt: new Date("2024-04-18 22:33:17.594"),
  //     authorId: "1316ce29-08bd-4578-a536-33ef6fed601c",
  //     slug: "conservation-efforts-for-hoolock-gibbons",
  //   },
  //   {
  //     id: "da577bbc-e3e6-4e8e-8a65-bbab793f1cb9",
  //     title: "Revival of Namda Craft in Kashmir",
  //     description:
  //       "The Namda craft of Kashmir is being successfully revived under a Skill India's Pilot Project as part of the Pradhan Mantri Kaushal Vikas Yojana (PMKVY), with nearly 2,200 candidates from across six districts of the state, receiving training in the dying art form.",
  //     from: new Date("2024-01-14 18:30:00"),
  //     to: new Date("2024-01-20 18:30:00"),
  //     createdAt: new Date("2024-04-18 22:35:05.008"),
  //     updatedAt: new Date("2024-04-18 22:35:05.008"),
  //     authorId: "1316ce29-08bd-4578-a536-33ef6fed601c",
  //     slug: "revival-of-namda-craft-in-kashmir",
  //   },
  //   {
  //     id: "9a381f18-283c-4083-a03a-c70a4bc7077b",
  //     title:
  //       "Coal Gasification: Promise and Challenges for India's Energy Transition",
  //     description:
  //       "The Coal Ministry announced that it is considering a comprehensive scheme to promote coal gasification projects for both government Public Sector Undertakings (PSUs) and the private sector with an outlay of Rs 6,000 crores.",
  //     from: new Date("2024-01-07 18:30:00"),
  //     to: new Date("2024-01-13 18:30:00"),
  //     createdAt: new Date("2024-04-18 22:39:38.804"),
  //     updatedAt: new Date("2024-04-18 22:39:38.804"),
  //     authorId: "1316ce29-08bd-4578-a536-33ef6fed601c",
  //     slug: "coal-gasification-promise-and-challenges-for-indias-energy-transition",
  //   },
  //   {
  //     id: "b729734e-1be7-460b-bee1-da3220f42080",
  //     title: "title 1",
  //     description: "desc 1",
  //     from: new Date("2024-04-19 07:15:13.617"),
  //     to: new Date("2024-04-21 18:30:00"),
  //     createdAt: new Date("2024-04-19 07:15:31.188"),
  //     updatedAt: new Date("2024-04-19 07:15:31.188"),
  //     authorId: "1316ce29-08bd-4578-a536-33ef6fed601c",
  //     slug: "title-1",
  //   },
  // ];

  return (
    <div className="container mx-auto py-10">
      <DataTable columns={columns} data={data} />
      <ConfirmDialog
        open={openConfirmGistDeleteDialog && !!selectedGistToDelete}
        setOpen={setOpenConfirmGistDeleteDialog}
        title="Delete Gist"
        description="Are you sure you want to delete this gist? This action cannot be undone."
        isLoading={isGistDeleteLoading}
        onConfirm={handleDeleteGist}
        onCancel={() => setOpenConfirmGistDeleteDialog(false)}
      />
    </div>
  );
}
