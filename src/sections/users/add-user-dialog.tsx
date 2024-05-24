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
import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import toast from "react-hot-toast";
import { Loader2 } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { adminAuthClient } from "@/lib/supabase/auth-admin-client";

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

export default function AddUserDialog({
  open,
  setOpen,
}: {
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
}) {
  const userSchema = z.object({
    email: z
      .string({
        required_error: "Email is required",
      })
      .email({
        message: "Email must be a valid email",
      }),
    role: z.enum(["admin", "user", "member"]),
  });

  const form = useForm<z.infer<typeof userSchema>>({
    resolver: zodResolver(userSchema),
    defaultValues: {
      email: "",
      role: "user",
    },
  });

  // states
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  // functions
  const getButtonText = () => {
    if (isSubmitting) {
      return "Adding...";
    }
    return "Add";
  };

  const onSubmit = async (values: z.infer<typeof userSchema>) => {
    try {
      setIsSubmitting(true);
      const data = adminAuthClient.generateLink({
        type: "invite",
        email: values.email,
      });

      console.log("data", data);
    } catch (error) {
      console.error(error);
      toast.error("Failed to add user");
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
          <DialogTitle>Add a User</DialogTitle>
          <DialogDescription>
            Add a new user to the admin panel
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
