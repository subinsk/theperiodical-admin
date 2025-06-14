"use client";

import {
  Button,
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  InputField,
  Stack,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  Popover,
  PopoverTrigger,
  PopoverContent,
  Command,
  CommandInput,
  CommandList,
  CommandEmpty,
  CommandGroup,
  CommandItem,
} from "@/components";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import toast from "react-hot-toast";
import { Check, ChevronsUpDown, Loader2 } from "lucide-react";
import { Invitation, User } from '@prisma/client';
import { createInvitation } from "@/services/invitations.service";
import { ROLES_MAP, getAvailableRoles } from "@/constants";
import { useSession } from "next-auth/react";
import { STATUS_MAP } from '@/constants/status';
import { updateUser } from "@/services/user.service";
import { cn } from "@/lib";
import { useGetOrganizations } from "@/services/organization.service";

export default function AddUserDialog({
  open,
  setOpen,
  organizationId,
  user,
  isSuperAdmin,
  refetchInvitations,
  refetchUsers
}: {
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  organizationId?: string;
  isSuperAdmin?: boolean;
  user?: User,
  refetchInvitations: () => void
  refetchUsers: () => void
}) {
  // hooks
  const {
    data: session,
    status
  } = useSession();

  const currUser = session?.user;

  const {
    organizations,
    organizationsLoading,
    organizationsError,
    organizationsValidating,
    organizationsEmpty,
    refetch: refetchOrganizations
  } = useGetOrganizations({ shouldFetch: true });

  // form
  const userSchema = z.object({
    email: z
      .string({
        required_error: "Email is required",
      })
      .email({
        message: "Email must be a valid email",
      }),
    role: z.enum(["org_admin", "content_writer", "manager", "super_admin"]),
    status: z.enum(["active", "inactive"]).optional(),
    organization: z.string(),
  });  const form = useForm<z.infer<typeof userSchema>>({
    resolver: zodResolver(userSchema),
    defaultValues: {
      email: "",
      role: isSuperAdmin ? "org_admin" : "content_writer",
      status: undefined,
      organization: "",
    },
  });

  // states
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  // functions
  const getButtonText = () => {
    if (isSubmitting) {
      if (user) {
        return "Updating..."
      }
      return "Inviting...";
    }
    if (user) {
      return "Update"
    }
    return "Send Invitation";
  };

  const handleInviteUser = async (values: z.infer<typeof userSchema>) => {
    try {
      setIsSubmitting(true);

      const payload = {
        email: values.email,
        role: values.role,
      }

      const response = await createInvitation(payload, organizationId);
      toast.success("User invited successfully");

      refetchInvitations()
      setOpen(false);
      form.reset();
    } catch (error: any) {
      console.error(error);
      toast.error(error ? error.error : "Failed to add user");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleUpdateUser = async (values: z.infer<typeof userSchema>) => {
    try {
      setIsSubmitting(true);

      if (!user) {
        throw new Error("User is not defined.");
      }

      const payload = {
        email: values.email,
        role: values.role,
        status: values.status
      };

      await updateUser(user.id, payload);
      toast.success("User updated successfully");
      refetchUsers()
      setOpen(false);
      form.reset();
    } catch (error: any) {
      console.error(error);
      toast.error(error ? error.error : "Failed to update user");
    } finally {
      setIsSubmitting(false);
    }
  }

  useEffect(() => {
    if (form) {
      const newValues: Partial<z.infer<typeof userSchema>> = {};
      
      if (user) {
        newValues.email = user.email;
        newValues.role = user.role;
        newValues.status = user.status;
        if (user.organization_id) {
          newValues.organization = user.organization_id;
        }
      }
      
      if (organizationId && !newValues.organization) {
        newValues.organization = organizationId;
      }

      if (Object.keys(newValues).length > 0) {
        form.reset({ ...form.getValues(), ...newValues });
      }
    }
  }, [user, organizationId, form]);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="max-w-xl">
        <DialogHeader>
          <DialogTitle>{user ? 'Update User' : 'Invite a User'}</DialogTitle>
          <DialogDescription>
            {user ? 'Update user details by changing their role or status' : 'Invite a user to your organization by entering their email and selecting a role. The user will receive an email invitation to join your organization.'}
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(user ? handleUpdateUser : handleInviteUser)}>
            <Stack gap={4}>
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <InputField
                        id="email"
                        placeholder="Enter email"
                        disabled={!!user}
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="role"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Role</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                      disabled={isSuperAdmin}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select role" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {getAvailableRoles(currUser?.role, isSuperAdmin)
                          .map((role) => (
                            <SelectItem key={role} value={role}>
                              {ROLES_MAP[role].label}
                            </SelectItem>
                          ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              {user &&
                <FormField
                  control={form.control}
                  name="status"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Status</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select status" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {Object.keys(STATUS_MAP).filter((item) => item !== "invited").map((status) => (
                            <SelectItem key={status} value={status}>
                              {STATUS_MAP[status as keyof typeof STATUS_MAP].label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />}
              <FormField
                control={form.control}
                name="organization"
                render={({ field }) => (
                  <FormItem className={cn("flex flex-col gap-1", !!user?.organization_id || !!organizationId ? "cursor-not-allowed" : "")}>
                    <FormLabel>Organization</FormLabel>
                    <Popover>
                      <PopoverTrigger asChild>
                        <FormControl>
                          <Button
                            variant="outline"
                            role="combobox"
                            disabled={!!user?.organization_id || !!organizationId} 
                            className={cn(
                              "justify-between",
                              !field.value && "text-muted-foreground"
                            )}
                          >
                            {field.value
                              ? organizations.map((organization: any) => {
                                if (organization.id === field.value) {
                                  return organization.name;
                                }
                              })
                              : "Select organization"}
                            <ChevronsUpDown className="opacity-50" />
                          </Button>
                        </FormControl>
                      </PopoverTrigger>
                      <PopoverContent aria-modal={true} style={{ pointerEvents: "auto" }} className="p-0 z-50">
                        <Command>
                          <CommandInput
                            placeholder="Search organization..."
                            className="h-9"
                          />
                          <CommandList>
                            <CommandEmpty>No organization found.</CommandEmpty>
                            <CommandGroup>
                              {organizations
                                .map((organization: any) => (
                                  <CommandItem
                                    value={organization.name}
                                    key={organization.id}
                                    onSelect={() => {
                                      if (organization.id === field.value) {
                                        form.setValue("organization", "");
                                      }
                                      else {
                                        form.setValue("organization", organization.id)
                                      }
                                    }}
                                  >
                                    {organization.name}
                                    <Check
                                      className={cn(
                                        "ml-auto",
                                        organization.id === field.value
                                          ? "opacity-100"
                                          : "opacity-0"
                                      )}
                                    />
                                  </CommandItem>
                                ))}
                            </CommandGroup>
                          </CommandList>
                        </Command>
                      </PopoverContent>
                    </Popover>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </Stack>
            <Button type="submit" className="mt-5">
              {isSubmitting && (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              )}
              {getButtonText()}
            </Button>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
