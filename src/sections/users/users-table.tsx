import { Button, DataTable, DropdownMenu, DropdownMenuContent, DropdownMenuGroup, DropdownMenuItem, DropdownMenuTrigger, Stack, Typography } from "@/components";
import { hasRolePermission, ROLES_MAP, STATUS_MAP } from "@/constants";
import { Icon } from "@iconify/react";
import { Role, User } from "@prisma/client";
import { ColumnDef } from "@tanstack/react-table";
import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import { deleteInvitation } from "@/services/invitations.service";
import toast from "react-hot-toast";
import AddUserDialog from "./add-user-dialog";
import { ConfirmDialog } from "@/components/ui/confirm-dialog";


export const UsersTable = ({
  users, invitations, usersLoading, invitationsLoading, refetchUsers, refetchInvitations
}: {
  users: Array<any>
  invitations: Array<any>
  usersLoading: boolean
  invitationsLoading: boolean
  refetchUsers: () => void
  refetchInvitations: () => void
}) => {
  // hooks
  const {
    data: session,
    status
  } = useSession();

  const isSuperAdmin = session?.user?.role === 'super_admin';


  // states
  const [openEditUserDialog, setOpenEditUserDialog] = useState<any | null>(
    null
  );
  const [usersAndInvitations, setUsersAndInvitations] = useState<User[]>([]);
  const [isRemovingUser, setIsRemovingUser] = useState<boolean>(false);
  const [isRemovingInvitation, setIsRemovingInvitation] = useState<boolean>(false);
  const [openRemoveUserDialog, setOpenRemoveUserDialog] =
    useState<any | null>(null);
  const [openRemoveInvitationDialog, setOpenRemoveInvitationDialog] =
    useState<any | null>(null);
  const [inviting, setInviting] = useState(true);

  console.log('open: ', usersAndInvitations)

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

        if (currStatus && !props.row.original.inviter) {
          if (currStatus === 'active') {
            icon = 'tabler:check';
            label = STATUS_MAP['active'].label;
          }
          else if (currStatus === 'inactive') {
            icon = 'tabler:x';
            label = STATUS_MAP['inactive'].label;
          }
        }
        if (props.row.original.inviter) {
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
      cell: (props: any) => {
        // Don't show actions for own user or if user is inactive
        if (props.row.original.id === session?.user.id || props.row.original.status === 'inactive') {
          return null;
        }

        // Check if current user has permission to manage this user based on roles
        const userRole = session?.user.role as Role;
        const targetRole = props.row.original.role as Role;
        const canManageUser = hasRolePermission(userRole, targetRole);

        if (!canManageUser) {
          return null;
        }

        return (
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
                    if (props.row.original.inviter) {
                      setOpenRemoveInvitationDialog(props.row.original);
                    } else {
                      setOpenRemoveUserDialog(props.row.original);
                    }
                  }}
                >
                  Remove
                </DropdownMenuItem>
              </DropdownMenuGroup>
            </DropdownMenuContent>
          </DropdownMenu>
        );
      },
    },
  ];

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
      <DataTable data={usersAndInvitations} columns={usersColumns} />
      <AddUserDialog open={!!openEditUserDialog} user={openEditUserDialog} setOpen={setOpenEditUserDialog} isSuperAdmin={isSuperAdmin} refetchInvitations={refetchInvitations} refetchUsers={refetchUsers} />
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
  )
}