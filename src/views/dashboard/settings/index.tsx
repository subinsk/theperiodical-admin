"use client";

import {
  DataTable,
  DropdownMenuGroup,
  DropdownMenuItem,
  Stack,
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
  Popover,
  PopoverContent,
  PopoverTrigger,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenu,
} from "@/components";

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
import { useGetUsers } from "@/services/user.service";
import { useState } from "react";
import AddUserDialog from "@/sections/users/add-user-dialog";
import Profile from "@/sections/profile";
import EditUserDialog from "@/sections/users/edit-user-dialog";

const ROLES_MAP = {
  user: {
    label: "User",
    value: "user",
  },
  member: {
    label: "Member",
    value: "member",
  },
  admin: {
    label: "Admin",
    value: "admin",
  },
};

const STATUS_MAP = {
  active: {
    label: "Active",
    value: "active",
  },
  inactive: {
    label: "Inactive",
    value: "inactive",
  },
};

enum User {
  user = "user",
  member = "member",
  admin = "admin",
}

export default function SettingsView() {
  // hooks
  const { users } = useGetUsers();

  // states
  const [openAddUserDialog, setOpenAddUserDialog] = useState<boolean>(false);
  const [openEditUserDialog, setOpenEditUserDialog] = useState<any | null>(
    null
  );

  const columns: ColumnDef<Gist>[] = [
    {
      accessorKey: "name",
      header: "Name",
      cell: (props: any) => props.row.original.name || "-",
    },
    {
      accessorKey: "email",
      header: "Email",
      minSize: 200,
    },
    {
      accessorKey: "role",
      header: "Role",
      cell: (props: any) =>
        ROLES_MAP[props.row.original.role as keyof typeof ROLES_MAP].label,
    },
    {
      accessorKey: "status",
      header: "Status",
      cell: (props: any) =>
        STATUS_MAP[props.row.original.status as keyof typeof STATUS_MAP].label,
    },
    {
      accessorKey: "actions",
      header: "Actions",
      cell: (props: any) => (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" size="icon">
              <Icon icon="tabler:dots-vertical" className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-42">
            <DropdownMenuGroup>
              <DropdownMenuItem
                className="cursor-pointer"
                onClick={() => {
                  setOpenEditUserDialog(props.row.original);
                }}
              >
                Edit
              </DropdownMenuItem>
            </DropdownMenuGroup>
          </DropdownMenuContent>
        </DropdownMenu>
      ),
    },
  ];

  return (
    <>
      <Tabs defaultValue="profile" className="">
        <TabsList className="grid grid-cols-2 mx-auto w-1/2">
          <TabsTrigger value="profile">Profile</TabsTrigger>
          <TabsTrigger value="users">Users</TabsTrigger>
        </TabsList>
        <TabsContent value="profile">
          <Profile />
        </TabsContent>
        <TabsContent value="users">
          <Stack gap={3}>
            <div className="w-full flex justify-end">
              <Button
                onClick={() => {
                  setOpenAddUserDialog(true);
                }}
              >
                <Icon icon="tabler:plus" />
                Add User
              </Button>
            </div>
            <DataTable data={users} columns={columns} />
          </Stack>
        </TabsContent>
      </Tabs>
      <AddUserDialog open={openAddUserDialog} setOpen={setOpenAddUserDialog} />
      <EditUserDialog
        open={!!openEditUserDialog}
        setOpen={setOpenEditUserDialog}
        user={openEditUserDialog}
      />
    </>
  );
}
