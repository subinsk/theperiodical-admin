"use client";

import {
  Button,
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  Editor,
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
  FormDescription,
} from "@/components";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import toast from "react-hot-toast";
import { Loader2 } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { adminAuthClient } from "@/lib/supabase/auth-admin-client";
import { updateUser } from "@/services/user.service";

const ROLES = [
  {
    label: "User",
    value: "user",
  },
  {
    label: "Member",
    value: "member",
  },
  {
    label: "Admin",
    value: "admin",
  },
];

const STATUSES = [
  {
    label: "Active",
    value: "active",
  },
  {
    label: "Inactive",
    value: "inactive",
  },
];

export default function EditUserDialog({
  open,
  setOpen,
  user,
}: {
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  user: any;
}) {
  const userSchema = z.object({
    email: z
      .string({
        required_error: "Email is required",
      })
      .email({
        message: "Email must be a valid email",
      }),
    role: z.enum(["admin", "member"]),
    status: z.enum(["active", "inactive"]),
  });

  const form = useForm<z.infer<typeof userSchema>>({
    resolver: zodResolver(userSchema),
    defaultValues: {
      email: user?.email || "",
      role: user?.role || "member",
      status: user?.status || "active",
    },
  });

  // states
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  // functions
  const getButtonText = () => {
    if (isSubmitting) {
      return "Changing...";
    }
    return "Change";
  };

  const onSubmit = async (values: z.infer<typeof userSchema>) => {
    try {
      setIsSubmitting(true);

      const payload = {
        email: values.email,
        role: values.role,
        status: values.status,
      };

      const response = await updateUser(user.id, payload);

      if (response.success) {
        toast.success("User updated successfully");
        setOpen(false);
        form.reset();
      }
    } catch (error) {
      console.error(error);
      toast.error("Failed to edit user");
    } finally {
      setIsSubmitting(false);
    }
  };

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
          <DialogTitle>Edit User</DialogTitle>
          <DialogDescription>Edit user status or role</DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <Stack gap={2}>
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
                        disabled
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
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select role" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {ROLES.map((role) => (
                          <SelectItem key={role.value} value={role.value}>
                            {role.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
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
                        {STATUSES.map((status) => (
                          <SelectItem key={status.value} value={status.value}>
                            {status.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
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
