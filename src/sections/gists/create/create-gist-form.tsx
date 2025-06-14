import {
  Button,
  Calendar,
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  Grid,
  InputField,
  Popover,
  PopoverContent,
  PopoverTrigger,
  Stack,
  Textarea,
} from "@/components";
import { gistSchema } from "@/schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { CalendarIcon, Loader2, Check, ChevronsUpDown } from "lucide-react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { format } from "date-fns";
import { cn } from "@/lib";
import { Icon } from "@iconify/react";
import { useEffect, useState } from "react";
import { createGist, updateGist } from "@/services/gist.service";
import { useGetUsers } from "@/services/user.service";
import { useSession } from "next-auth/react";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";
import { Loader } from "@/components/ui/loader";

export default function CreateGistForm({
  selectedGist,
  setSelectedGist,
  setGistDetails,
  setDialogOpen,
}: {
  selectedGist?: any;
  setSelectedGist?: any;
  setGistDetails?: (details: any) => void;
  setDialogOpen?: (open: boolean) => void;
}) {
  // states
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [loadNextRoute, setLoadNextRoute] = useState<boolean>(false);

  // hooks
  const {
    users,
    usersLoading,
  } = useGetUsers({
    role: "content_writer",
    shouldFetch: true,
  })
  const router = useRouter()

  const { data: session, status } = useSession()

  const form = useForm<z.infer<typeof gistSchema>>({
    resolver: zodResolver(gistSchema),
    defaultValues: {
      title: "",
      description: "",
      from: new Date(),
      to: new Date(),
      author: "",
    },
  });

  // functions
  const getButtonText = () => {
    if (selectedGist) {
      if (isSubmitting) {
        return "Updating...";
      }
      return "Update";
    }
    if (isSubmitting) {
      return "Creating...";
    }
    return "Create";
  };

  const onSubmit = async (values: z.infer<typeof gistSchema>) => {
    setIsSubmitting(true);

    try {
      if (!!selectedGist) {
        const response = await updateGist(selectedGist.slug, values);

        toast.success("Gist updated successfully");
        if (setGistDetails) setGistDetails(response.gist);
        if (setDialogOpen) setDialogOpen(false);
      } else {
        const payload = {
          title: values.title,
          description: values.description,
          from: values.from,
          to: values.to,
          organizationId: session?.user.organization.id,
          authorId: values.author,
          assignedBy: session?.user.id,
        }

        const response = await createGist(payload);
        setLoadNextRoute(true)
        router.push(`/dashboard/gists/${response.data.slug}`);
      }
    } catch (e: any) {
      console.log(e);
      if (typeof e.error === "string") {
        toast.error(e.error);
      } else if (e.message) {
        toast.error(e.message);
      } else {
        toast.error("Error occured");
      }
    } finally {
      setIsSubmitting(false);
      form.reset();
      if (setSelectedGist) {
        setSelectedGist(null);
      }
    }
  };

  // effects
  useEffect(() => {
    if (selectedGist) {
      form.setValue("title", selectedGist.title);
      form.setValue("description", selectedGist.description);
      form.setValue("from", new Date(selectedGist.from));
      form.setValue("to", new Date(selectedGist.to));
      form.setValue("author", selectedGist.author_id);
    }
  }, [form, selectedGist]);

  return (
    loadNextRoute ?
      <div className="h-screen w-full flex justify-center items-center">
        <Loader />
      </div>
      :
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <div className="grid grid-cols-12 gap-8">
            <div className="col-span-9">
              <FormField
                control={form.control}
                name="title"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Title</FormLabel>
                    <FormControl>
                      <InputField id="title" placeholder="Title" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <div className="col-span-3">
              <FormField
                control={form.control}
                name="author"
                render={({ field }) => (
                  <FormItem className="flex flex-col gap-3">
                    <FormLabel>Assigned To</FormLabel>
                    <Popover>
                      <PopoverTrigger asChild>
                        <FormControl>
                          <Button
                            variant="outline"
                            role="combobox"
                            className={cn(
                              "w-[200px] justify-between",
                              !field.value && "text-muted-foreground"
                            )}
                          >
                            {field.value
                              ? users.map((user: any) => {
                                if (user.id === field.value) {
                                  return user.name;
                                }
                              })
                              : "Select author"}
                            <ChevronsUpDown className="opacity-50" />
                          </Button>
                        </FormControl>
                      </PopoverTrigger>
                      <PopoverContent className="w-[200px] p-0">
                        <Command>
                          <CommandInput
                            placeholder="Search author..."
                            className="h-9"
                          />
                          <CommandList>
                            <CommandEmpty>No author found.</CommandEmpty>
                            <CommandGroup>
                              {users
                                .map((user: any) => (
                                  <CommandItem
                                    value={user.name}
                                    key={user.id}
                                    onSelect={() => {
                                      if (user.id === field.value) {
                                        form.setValue("author", "");
                                      }
                                      else {
                                        form.setValue("author", user.id)
                                      }
                                    }}
                                  >
                                    {user.name}
                                    <Check
                                      className={cn(
                                        "ml-auto",
                                        user.id === field.value
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
            </div>
            <div className="col-span-12">
              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Description</FormLabel>
                    <FormControl>
                      <Textarea
                        id="description"
                        placeholder="Description"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <div className="col-span-6">
              <FormField
                control={form.control}
                name="from"
                render={({ field }) => (
                  <FormItem className="flex flex-col">
                    <FormLabel>From</FormLabel>
                    <Popover>
                      <PopoverTrigger asChild>
                        <FormControl>
                          <Button
                            variant={"outline"}
                            className={cn(
                              "w-[240px] pl-3 text-left font-normal",
                              !field.value && "text-muted-foreground"
                            )}
                          >
                            {field.value ? (
                              format(field.value, "PPP")
                            ) : (
                              <span>Pick a date</span>
                            )}
                            <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                          </Button>
                        </FormControl>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <Calendar
                          mode="single"
                          selected={field.value}
                          onSelect={field.onChange}
                          disabled={(date: Date) => date < new Date("1900-01-01")}
                          initialFocus
                        />
                      </PopoverContent>
                    </Popover>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <div className="col-span-6">
              <FormField
                control={form.control}
                name="to"
                render={({ field }) => (
                  <FormItem className="flex flex-col">
                    <FormLabel>To</FormLabel>
                    <Popover>
                      <PopoverTrigger asChild>
                        <FormControl>
                          <Button
                            variant={"outline"}
                            className={cn(
                              "w-[240px] pl-3 text-left font-normal",
                              !field.value && "text-muted-foreground"
                            )}
                          >
                            {field.value ? (
                              format(field.value, "PPP")
                            ) : (
                              <span>Pick a date</span>
                            )}
                            <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                          </Button>
                        </FormControl>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <Calendar
                          mode="single"
                          selected={field.value}
                          onSelect={field.onChange}
                          disabled={(date: Date) => date < new Date("1900-01-01")}
                          initialFocus
                        />
                      </PopoverContent>
                    </Popover>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <div className="col-span-12">
              <Button className="w-full">
                {isSubmitting && (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                )}
                {getButtonText()}
              </Button>
            </div>
          </div>
        </form>
      </Form>
  );
}
