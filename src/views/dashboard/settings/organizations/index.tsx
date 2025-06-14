import { Button, Stack } from "@/components";
import { Loader } from "@/components/ui/loader";
import AddOrganizationDialog from "@/sections/organization/add-organization-dialog";
import { OrganizationsTable } from "@/sections/organization/organizations-table";
import { useGetOrganizations } from "@/services/organization.service";
import { Icon } from "@iconify/react/dist/iconify.js";
import { useSession } from "next-auth/react";
import { useState } from "react";

export const SettingsOrganizationsView = () => {
    // hooks
    const {
        data: session,
        status
    } = useSession();

    const isSuperAdmin = session?.user?.role === 'super_admin';

    const {
        organizations,
        organizationsLoading,
        organizationsError,
        organizationsValidating,
        organizationsEmpty,
        refetch: refetchOrganizations
    } = useGetOrganizations({ shouldFetch: status === 'loading' ? false : isSuperAdmin });

    // states
    const [openAddOrganizationDialog, setOpenAddOrganizationDialog] =
        useState<boolean>(false);
        
    return (
        organizationsLoading ?
            <Loader />
            :
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
                <OrganizationsTable organizations={organizations} refetchOrganizations={refetchOrganizations} />
                <AddOrganizationDialog open={openAddOrganizationDialog} setOpen={setOpenAddOrganizationDialog} refetchOrganizations={refetchOrganizations} />
            </Stack>
    )
}