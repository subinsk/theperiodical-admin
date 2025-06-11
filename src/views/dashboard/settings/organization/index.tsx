"use client";

import {
  Button,
  Stack,
  Separator,
  DataTable,
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  Typography
} from "@/components";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import toast from "react-hot-toast";
import { Organization, User, Invitation } from '@prisma/client';
import { Icon } from "@iconify/react";
import { useGetUsers } from "@/services/user.service";
import { ColumnDef } from "@tanstack/react-table";
import { ROLES_MAP, STATUS_MAP } from "@/constants";
import AddUserDialog from "@/sections/users/add-user-dialog";
import { fetchInvitations } from "@/services/invitations.service";

export default function OrganizationView({
  organization
}: {
  organization: Organization
}) {
  // states
  const [openAddUserDialog, setOpenAddUserDialog] = useState<boolean>(false)
  const [invitations, setInvitations] = useState<Invitation[]>([]);
  const [loading, setLoading] = useState(true);
  const [usersAndInvitations, setUsersAndInvitations] = useState<User | Invitation[]>([]);

  //hooks
  const {
    users,
    usersLoading,
    usersError,
    usersValidating,
    usersEmpty,
    refetch: refetchUsers
  } = useGetUsers({ organizationId: organization.id });


  // schema
  const userSchema = z.object({
    name: z
      .string({
        required_error: "Name is required",
      })
      .min(2, {
        message: "Name must be at least 2 characters long",
      }),
  });

  const form = useForm<z.infer<typeof userSchema>>({
    resolver: zodResolver(userSchema),
    defaultValues: {
      name: organization.name || "",
    },
  });

  const userColumns: ColumnDef<User>[] = [
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

  // functions
  const getInvitations = async () => {
    try {
      setLoading(true);

      const response = await fetchInvitations()
      console.log("Fetched invitations:", response);
      setInvitations(response.invitations);

    } catch (error) {
      console.error("Failed to fetch invitations:", error);
      toast.error("Failed to fetch invitations");
    }
    finally {
      setLoading(false);
    }
  }

  //effects
  useEffect(() => {
    getInvitations();
  }, []);

  useEffect(() => {
    setUsersAndInvitations([...invitations, ...users]);
  }, [users, invitations]);

  return (
    <Stack gap={8}>
      <div className="w-full flex justify-between">
        <Typography variant="h1">
          {organization.name}
        </Typography>
        <Button
          onClick={() => {
            setOpenAddUserDialog(true);
          }}
        >
          <Icon icon="tabler:plus" />
          Add User
        </Button>
      </div>
      <Separator />
      <Stack gap={3}>
        <Typography variant="h3">
          Users
        </Typography>
        <DataTable data={users} columns={userColumns} />
      </Stack>
      <AddUserDialog open={openAddUserDialog} setOpen={setOpenAddUserDialog} organizationId={organization.id} organizationName={organization.name} isSuperAdmin setInvitations={setInvitations}/>
    </Stack>
  )
}