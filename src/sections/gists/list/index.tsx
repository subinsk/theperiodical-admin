import { DataTable } from "@/components";
import { columns } from "./columns";
import { useGetGists } from "@/services/gist.service";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";

export default function GistListTableSection() {
  const {
    gists: data,
    gistsLoading: isLoading,
    gistsError: error,
    gistsValidating: isValidating,
    gistsEmpty: isEmpty,
  } = useGetGists();

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
    </div>
  );
}
