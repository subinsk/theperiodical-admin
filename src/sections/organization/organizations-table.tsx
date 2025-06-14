import { Button, DataTable, DropdownMenu, DropdownMenuContent, DropdownMenuGroup, DropdownMenuItem, DropdownMenuTrigger } from "@/components";
import { ConfirmDialog } from "@/components/ui/confirm-dialog";
import { STATUS_MAP } from "@/constants";
import { paths } from "@/lib";
import { updateOrganization } from "@/services/organization.service";
import { Icon } from "@iconify/react";
import { Organization } from "@prisma/client";
import { ColumnDef } from "@tanstack/react-table";
import { useSession } from "next-auth/react";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import toast from "react-hot-toast";
import {PLANS_MAP} from "@/constants"

export const OrganizationsTable = ({
    organizations,
    refetchOrganizations
}: {
    organizations: Array<any>
    refetchOrganizations: () => void
}) => {
    const {
        data: session,
        status
    } = useSession();

    const isSuperAdmin = session?.user?.role === 'super_admin';

    const [openDeactivateOrganizationDialog, setOpenDeactivateOrganizationDialog] =
        useState<any | null>(null);


    const [isDeactivating, setIsDeactivating] = useState<boolean>(false);

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
            accessorKey: "members",
            header: "Members",
            cell: (props: any) => (props.row.original._count.users),
        },
        {
            accessorKey: "planType",
            header: "Plan Type",
            cell: (props: any) => (PLANS_MAP[props.row.original.plan_type as keyof typeof PLANS_MAP].label),
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

    return (
        <>
            <DataTable data={organizations} columns={organizationsColumn} />

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
                    onConfirm={() => handleDeactivateOrganization(openDeactivateOrganizationDialog.id, openDeactivateOrganizationDialog.status)}
                />)
            }
        </>
    )
}