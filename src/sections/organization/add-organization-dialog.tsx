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
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  Stack,
} from "@/components";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import toast from "react-hot-toast";
import { Loader2 } from "lucide-react";
import { PLANS_MAP } from "@/constants/plans";
import { createOrganization } from "@/services/organization.service";


export default function AddOrganizationDialog({
  open,
  setOpen,
  refetchOrganizations
}: {
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
refetchOrganizations: () => void;
}) {
  const orgSchema = z.object({
    name: z
      .string({
        required_error: "Name is required",
      })
    ,
    plan_type: z.enum(Object.keys(PLANS_MAP) as [string, ...string[]], {
      required_error: "Plan is required",
      invalid_type_error: "Invalid plan selected",
    }),

  });

  const form = useForm<z.infer<typeof orgSchema>>({
    resolver: zodResolver(orgSchema),
    defaultValues: {
      name: "",
      plan_type: PLANS_MAP.free.value, // Default to the free plan
    },
  });

  // states
  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  // functions
  const getButtonText = () => {
    if (isSubmitting) {
      return "Creating...";
    }
    return "Create Organization";
  };

  const onSubmit = async (values: z.infer<typeof orgSchema>) => {
    try {
      setIsSubmitting(true);

      const payload = {
        name: values.name,
        plan_type: values.plan_type,
      }

      const response = await createOrganization(payload);
      toast.success("Organization created successfully");

    } catch (error) {
      console.error(error);
      toast.error(error instanceof Error ? error.message : "Failed to add organization");
    } finally {
    refetchOrganizations();
      setIsSubmitting(false);
      setOpen(false);
      form.reset();
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="max-w-xl">
        <DialogHeader>
          <DialogTitle>Create New Organization</DialogTitle>
          <DialogDescription>
            Create a new organization to the system. Please provide the necessary details below.
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <Stack gap={2}>
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Name</FormLabel>
                    <FormControl>
                      <InputField
                        id="name"
                        placeholder="e.g. The Periodical"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="plan_type"
                render={({ field }) => (
                <FormItem>
                    <FormLabel>Plan</FormLabel>
                    <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                    >
                    <FormControl>
                        <SelectTrigger>
                        <SelectValue placeholder="Select plan" />
                        </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                        {Object.values(PLANS_MAP).map((plan) => (
                        <SelectItem key={plan.value} value={plan.value}>
                            {plan.label}
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
