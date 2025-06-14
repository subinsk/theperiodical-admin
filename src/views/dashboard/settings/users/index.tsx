import { Button, Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList, Popover, PopoverContent, PopoverTrigger, Stack } from "@/components";
import { Loader } from "@/components/ui/loader";
import AddUserDialog from "@/sections/users/add-user-dialog";
import { UsersTable } from "@/sections/users/users-table";
import { useGetInvitations } from "@/services/invitations.service";
import { useGetUsers } from "@/services/user.service";
import { Icon } from "@iconify/react";
import { useSession } from "next-auth/react";
import { useState, useEffect } from "react";

export const SettingsUserView = ({
    organizationId
}: {
    organizationId?: string
}) => {
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
    } = useGetUsers({
        organizationId: organizationId || session?.user.organization_id,
        shouldFetch: status === 'authenticated'
    });

    const {
        invitations,
        invitationsLoading,
        invitationsError,
        invitationsValidating,
        refetch: refetchInvitations
    } = useGetInvitations({
        organizationId: organizationId || session?.user.organization_id,
        shouldFetch: status === 'authenticated'
    })

    const [openAddUserDialog, setOpenAddUserDialog] = useState<boolean>(false);
    const [initialLoading, setInitialLoading] = useState<boolean>(true);

    useEffect(() => {
        if (!invitationsLoading && !usersLoading && initialLoading) {
            setInitialLoading(false);
        }
    }, [invitationsLoading, usersLoading]);

    return (
        initialLoading ?
            <Loader />
            :
            (
                <>
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
                        <UsersTable
                            invitations={invitations}
                            invitationsLoading={invitationsLoading}
                            refetchInvitations={refetchInvitations}
                            refetchUsers={refetchUsers}
                            users={users}
                            usersLoading={usersLoading}
                        />
                    </Stack>
                    <AddUserDialog open={!!openAddUserDialog} setOpen={setOpenAddUserDialog} isSuperAdmin={isSuperAdmin} refetchInvitations={refetchInvitations} refetchUsers={refetchUsers} organizationId={organizationId} />
                </>
            )
    )
}