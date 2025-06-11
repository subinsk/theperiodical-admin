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
} from "@/components";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import toast from "react-hot-toast";
import { Loader2 } from "lucide-react";
import { Invitation, User } from '@prisma/client';
import { createInvitation } from "@/services/invitations.service";
import { ROLES_MAP, getAvailableRoles } from "@/constants";
import { useSession } from "next-auth/react";
import {STATUS_MAP} from '@/constants/status';
import { updateUser } from "@/services/user.service";

export default function AddUserDialog({
  open,
  setOpen,
  organizationId,
  organizationName,
  user,
  isSuperAdmin,
  refetchInvitations,
  refetchUsers
}: {
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  organizationId?: string;
  organizationName?: string;
  isSuperAdmin?: boolean;
  user?: User,
  refetchInvitations: ()=> void
  refetchUsers: ()=> void
}) {
  // hooks
    const {
      data: session,
      status
    } = useSession();

    const currUser = session?.user;

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
  });

  const form = useForm<z.infer<typeof userSchema>>({
    resolver: zodResolver(userSchema),
    defaultValues: {
      email: "",
      role: isSuperAdmin ? "org_admin" : "content_writer",
    },
  });

  // states
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  // functions
  const getButtonText = () => {
    if (isSubmitting) {
      if(user){
        return "Updating..."
      }
      return "Inviting...";
    }
    if(user){
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
        organizationName
      }

      const response = await createInvitation(payload, organizationId);

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

  // effects
  useEffect(() => {
    if (user) {
      form.setValue("email", user.email);
      form.setValue("role", user.role);
      form.setValue("status", user.status);
    }
  }, [user, form]);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="max-w-xl">
        <DialogHeader>
          <DialogTitle>{user ? 'Update User': 'Invite a User'}</DialogTitle>
          <DialogDescription>
            {user ? 'Update the user' : 'Invite a user to your organization by entering their email and selecting a role. The user will receive an email invitation to join your organization.'}
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(user ? handleUpdateUser : handleInviteUser)}>
            <Stack gap={2}>
              <div>
                {form.formState.errors.email && (
                  <p className="text-red-500 text-sm">
                    Email {form.formState.errors.email.message}
                  </p>
                )}
                {form.formState.errors.role && (
                  <p className="text-red-500 text-sm">
                    Role {form.formState.errors.role.message}
                  </p>
                )}
                <div>
                  {form.formState.errors.status && (
                    <p className="text-red-500 text-sm">
                      Status {form.formState.errors.status.message}
                    </p>
                  )}
                </div>
              </div>
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
                        disabled={user}
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
              {
                user &&
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
                        {Object.keys(STATUS_MAP).filter((item)=> item !== "invited").map((status) => (
                          <SelectItem key={status} value={status}>
                            {STATUS_MAP[status].label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
}
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
