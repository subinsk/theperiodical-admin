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
  Separator
} from "@/components";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import toast from "react-hot-toast";
import { Loader2 } from "lucide-react";
import { Role, Organization } from '@prisma/client';
import { createInvitation, fetchInvitations, useGetInvitations } from "@/services/invitations.service";

interface Invitation {
  id: string;
  email: string;
  role: Role;
  expires_at: string;
}

interface InviteManagementProps {
  userRole: Role;
}

const ROLES = [
  {
    label: "Content Writer",
    value: "content_writer",
  },
  {
    label: "Manager",
    value: "manager",
  },
  {
    label: "Admin",
    value: "org_admin",
  },
];

export default function EditOrganizationDialog({
  open,
  setOpen,
  organization
}: {
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  organization: Organization;
}) {
  const userSchema = z.object({
    email: z
      .string({
        required_error: "Email is required",
      })
      .email({
        message: "Email must be a valid email",
      }),
    role: z.enum(["org_admin", "content_writer", "manager"]),
  });

  const form = useForm<z.infer<typeof userSchema>>({
    resolver: zodResolver(userSchema),
    defaultValues: {
      email: "",
      role: "org_admin",
    },
  });

  // states
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  // functions
  const getButtonText = () => {
    if (isSubmitting) {
      return "Inviting...";
    }
    return "Send Invitation";
  };

  

  const onSubmit = async (values: z.infer<typeof userSchema>) => {
    try {
      setIsSubmitting(true);

      const payload = {
        email: values.email,
        role: values.role,
      }

      const response = await createInvitation(payload);
      const {invitation}= response

      if(invitation){
        setInvitations((prev) => [
          {
            id: invitation.id,
            email: invitation.email,
            role: invitation.role,
            expires_at: invitation.expires_at,
          },
          ...prev,
        ]);
    }

    } catch (error) {
      console.error(error);
      toast.error(error instanceof Error ? error.message : "Failed to add user");
    } finally {
      setIsSubmitting(false);
      setOpen(false);
      form.reset();
    }
  };

  

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="max-w-xl">
        <DialogHeader>
          <DialogTitle>Edit Organization</DialogTitle>
          <DialogDescription>
            Edit the details of the organization or invite new users to join.
          </DialogDescription>
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
