import {
  Button,
  Calendar,
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
import { CalendarIcon, Loader2 } from "lucide-react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { format } from "date-fns";
import { cn } from "@/lib";
import { Icon } from "@iconify/react";
import { useEffect, useState } from "react";
import { createGist, updateGist } from "@/services/gist.service";

export default function CreateGistForm({
  setGistId,
  setGistDetails,
  selectedGist,
  setSelectedGist,
  setOpenEditGistDialog,
}: {
  setGistId?: (id: string) => void;
  setGistDetails: (details: any) => void;
  selectedGist?: any;
  setSelectedGist?: any;
  setOpenEditGistDialog?: any;
}) {
  // states
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  // hooks
  const form = useForm<z.infer<typeof gistSchema>>({
    resolver: zodResolver(gistSchema),
    defaultValues: {
      title: "",
      description: "",
      from: new Date(),
      to: new Date(),
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
      if (selectedGist) {
        const response = await updateGist(selectedGist.slug, values);

        if (response.success) {
          console.log(response.data);
          setGistDetails(response.data);
        } else {
          throw new Error("Failed to update the gist");
        }
      } else {
        const response = await createGist(values);

        if (response.success) {
          if (setGistId) {
            setGistId(response.data.id);
          }
          setGistDetails(response.data);
        } else throw new Error("Failed to create the gist");
      }
    } catch (e) {
      console.log(e);
    } finally {
      setIsSubmitting(false);
      form.reset();
      if (setSelectedGist) {
        setSelectedGist(null);
      }
      if (setOpenEditGistDialog) {
        setOpenEditGistDialog(false);
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
    }
  }, [form, selectedGist]);

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)}>
        <div className="grid grid-cols-12 gap-8">
          <div className="col-span-12">
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
