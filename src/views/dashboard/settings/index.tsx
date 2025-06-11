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
  Typography,
} from "@/components";

import { Button } from "@/components";
import { paths } from "@/lib";
import { Icon } from "@iconify/react";
import { Invitation, Organization, User } from "@prisma/client";
import { ColumnDef } from "@tanstack/react-table";
import Link from "next/link";
import toast from "react-hot-toast";
import { useGetUsers } from "@/services/user.service";
import { useEffect, useState } from "react";
import AddUserDialog from "@/sections/users/add-user-dialog";
import Profile from "@/sections/profile";
import EditUserDialog from "@/sections/users/edit-user-dialog";
import { updateOrganization, useGetOrganizations } from "@/services/organization.service";
import Image from "next/image";
import { useSession } from "next-auth/react";
import { Loader } from "@/components/ui/loader";
import AddOrganizationDialog from "@/sections/organization/add-organization-dialog";
import { ROLES_MAP, STATUS_MAP } from "@/constants";
import { ConfirmDialog } from "@/components/ui/confirm-dialog";
import { deleteInvitation, useGetInvitations } from "@/services/invitations.service";

export default function SettingsView() {
  // hooks
  const {
    data: session,
    status
  } = useSession();

  const isSuperAdmin = session?.user?.role === 'super_admin';

  const {
    users,
    usersLoading,
    usersError,
    usersValidating,
    usersEmpty,
    refetch: refetchUsers
  } = useGetUsers({ organizationId: session?.user.organization_id, shouldFetch: status === 'loading' ? false : true });

  const {
    organizations,
    organizationsLoading,
    organizationsError,
    organizationsValidating,
    organizationsEmpty,
    refetch: refetchOrganizations
  } = useGetOrganizations({ shouldFetch: status === 'loading' ? false : isSuperAdmin });

  const {
    invitations,
    invitationsLoading,
    invitationsError,
    invitationsValidating,
    refetch: refetchInvitations
  } = useGetInvitations({
    organizationId: session?.user.organization_id, shouldFetch: status === 'loading' ? false : true
  })

  // states
  const [openAddUserDialog, setOpenAddUserDialog] = useState<boolean>(false);
  const [openEditUserDialog, setOpenEditUserDialog] = useState<any | null>(
    null
  );
  const [openDeactivateOrganizationDialog, setOpenDeactivateOrganizationDialog] =
    useState<any | null>(null);
  const [openRemoveUserDialog, setOpenRemoveUserDialog] =
    useState<any | null>(null);
  const [openRemoveInvitationDialog, setOpenRemoveInvitationDialog] =
    useState<any | null>(null);
  const [openAddOrganizationDialog, setOpenAddOrganizationDialog] =
    useState<boolean>(false);
  const [isDeactivating, setIsDeactivating] = useState<boolean>(false);
  const [isRemovingUser, setIsRemovingUser] = useState<boolean>(false);
  const [isRemovingInvitation, setIsRemovingInvitation] = useState<boolean>(false);
  const [inviting, setInviting] = useState(true);
  const [usersAndInvitations, setUsersAndInvitations] = useState<User[]>([]);


  const usersColumns: ColumnDef<User>[] = [
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
      cell: (props: any) => {
        const currStatus = props.row.original.status
        let icon = null
        let label = ''

        if (currStatus) {
          if (currStatus === 'active') {
            icon = 'tabler:check';
            label = STATUS_MAP['active'].label;
          }
          else if (currStatus === 'inactive') {
            icon = 'tabler:x';
            label = STATUS_MAP['inactive'].label;
          }
        }
        else if (props.row.original.inviter) {
          icon = 'material-symbols:notifications-active-outline';
          label = STATUS_MAP['invited'].label;
        }

        return (
          <Stack direction="row" align="center" gap={1}>
            {
              icon &&
              <Icon icon={icon} className="h-4 w-4" />
            }
            <Typography variant="p">
              {label}
            </Typography>
          </Stack>
        )
      },
    },
    {
      accessorKey: "actions",
      header: "Actions",
      cell: (props: any) => (
        props.row.original.id === session?.user.id ? null :
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="icon">
                <Icon icon="tabler:dots-vertical" className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-42">
              <DropdownMenuGroup>
                {
                  !props.row.original.inviter &&
                <DropdownMenuItem
                className="cursor-pointer"
                onClick={() => {
                  setOpenEditUserDialog(props.row.original);
                }}
                >
                  Edit
                </DropdownMenuItem>
                }
                <DropdownMenuItem
                  className="cursor-pointer text-red-500"
                  onClick={() => {
                    setOpenRemoveInvitationDialog(props.row.original);
                  }}
                >
                  Remove
                </DropdownMenuItem>
              </DropdownMenuGroup>
            </DropdownMenuContent>
          </DropdownMenu>
      ),
    },
  ];

  const organizationsColumn: ColumnDef<Organization>[] = [
    {
      accessorKey: "logo",
      header: " ",
      cell: (props: any) => (
        <Image
          src={props.row.original.logo || "/img/dashboards/organization.png"}
          alt={props.row.original.name || "Organization Logo"}
          width={40}
          height={40}
        />
      )
    },
    {
      accessorKey: "name",
      header: "Name",
      cell: (props: any) => (props.row.original.name),
    },
    {
      accessorKey: "status",
      header: "Status",
      cell: (props: any) => (STATUS_MAP[props.row.original.status as keyof typeof STATUS_MAP].label),
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
              >
                <Link href={`${paths.dashboard.organization.edit(props.row.original.slug)}`}>
                  View
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem
                className="cursor-pointer"
                onClick={() => {
                  setOpenDeactivateOrganizationDialog(props.row.original);
                }}
              >
                {props.row.original.status === 'active' ? 'Deactivate' : 'Activate'}
              </DropdownMenuItem>
            </DropdownMenuGroup>
          </DropdownMenuContent>
        </DropdownMenu>
      ),
    },
  ]

  // Handlers
  const handleDeactivateOrganization = async (organizationId: string, status: string) => {
    setIsDeactivating(true);
    try {
      const response = await updateOrganization(organizationId, {
        id: organizationId,
        status: status === 'active' ? 'inactive' : 'active',
      });
      toast.success(
        `Organization ${status === 'active' ? 'deactivated' : 'activated'} successfully`
      );
      refetchOrganizations();
    } catch (error) {
      console.error("Error deactivating organization:", error);
      toast.error("An error occurred while deactivating the organization");
    } finally {
      setIsDeactivating(false);
    }
  }

  const handleRemoveUser = async (userId: string) => {
    try {
      // Call your API to remove the user
      // await removeUser(userId);
      toast.success("User removed successfully");
      refetchUsers();
    } catch (error) {
      console.error("Error removing user:", error);
      toast.error("An error occurred while removing the user");
    } finally {
      setOpenRemoveUserDialog(null);
    }
  };

  const handleRemoveInvitation = async (invitationId: string) => {
    try {
      setIsRemovingInvitation(true);
      const response = await deleteInvitation(invitationId);
      toast.success("Invitation removed successfully");
      refetchInvitations();
    } catch (error) {
      console.error("Error removing invitation:", error);
      toast.error("An error occurred while removing the invitation");
    } finally {
      setOpenRemoveInvitationDialog(null);
      setIsRemovingInvitation(false);
    }
  };

  //effects
  useEffect(() => {
    if (usersLoading || invitationsLoading) return;

    if (invitations && users) {
      setUsersAndInvitations([...invitations, ...users]);
    }
  }
    , [users, invitations]);

  return (
    <>
      {status === 'loading' && <Loader />}
      {
        status === 'authenticated' &&
        <>
          <Tabs defaultValue="profile">
            <TabsList className={`grid grid-cols-2 mx-auto w-1/2`}>
            <TabsTrigger value="profile" className={`${session?.user.role === 'content_writer' ? 'col-span-2' : 'col-span-1'}`}>Profile</TabsTrigger>
              {
                session?.user.role === 'super_admin' &&
                <TabsTrigger value="organizations">Organizations</TabsTrigger>
              }
              {
                session?.user.role !== 'content_writer' &&
              <TabsTrigger value="users">Users</TabsTrigger>
              }
            </TabsList>
            <TabsContent value="profile">
              <Profile />
            </TabsContent>
            <TabsContent value="organizations">
              <Stack gap={3}>
                <div className="w-full flex justify-end">
                  <Button
                    onClick={() => {
                      setOpenAddOrganizationDialog(true);
                    }}
                  >
                    <Icon icon="tabler:plus" />
                    Add Organization
                  </Button>
                </div>
                <DataTable data={organizations} columns={organizationsColumn} />
              </Stack>
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
                <DataTable data={usersAndInvitations} columns={usersColumns} />
              </Stack>
            </TabsContent>
          </Tabs>
          <AddOrganizationDialog open={openAddOrganizationDialog} setOpen={
            setOpenAddOrganizationDialog
          } refetchOrganizations={refetchOrganizations}
          />
          <AddUserDialog open={!!openAddUserDialog} setOpen={setOpenAddUserDialog} isSuperAdmin={isSuperAdmin} refetchInvitations={refetchInvitations} refetchUsers={refetchUsers}/>
          <AddUserDialog open={!!openEditUserDialog} user={openEditUserDialog} setOpen={setOpenEditUserDialog} isSuperAdmin={isSuperAdmin} refetchInvitations={refetchInvitations} refetchUsers={refetchUsers}/>
          {
            openDeactivateOrganizationDialog &&
            (<ConfirmDialog
              title={`Do you want to ${openDeactivateOrganizationDialog.status === 'active' ? 'deactivate' : 'activate'} this organization?`}
              description={
                `Are you sure you want to ${openDeactivateOrganizationDialog.status === 'active' ? 'deactivate' : 'activate'} the organization "${openDeactivateOrganizationDialog.name}"? This action cannot be undone.`
              }
              open={openDeactivateOrganizationDialog}
              setOpen={setOpenDeactivateOrganizationDialog}
              isLoading={isDeactivating}
              onCancel={() => setIsDeactivating(false)}
              onDelete={() => handleDeactivateOrganization(openDeactivateOrganizationDialog.id, openDeactivateOrganizationDialog.status)}
            />)
}
{
            openRemoveInvitationDialog &&
            <ConfirmDialog
              title="Remove Invitation"
              description={`Are you sure you want to remove the invitation for ${openRemoveInvitationDialog.email}? This action cannot be undone.`}
              open={!!openRemoveInvitationDialog}
              setOpen={setOpenRemoveInvitationDialog}
              isLoading={isRemovingInvitation}
              onCancel={() => setOpenRemoveInvitationDialog(null)}
              onDelete={() => handleRemoveInvitation(openRemoveInvitationDialog.id)}
            />
          }
        </>
      }
    </>
  );
}
