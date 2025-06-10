import {
  Button,
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  Editor,
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  InputField,
  Stack,
} from "@/components";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { v4 as uuidv4 } from "uuid";
import { topicSchema } from "@/schema";
import { addTopic, updateTopic } from "@/services/topic.service";
import toast from "react-hot-toast";
import { Loader2 } from "lucide-react";

export const CreateTopicDialog = ({
  open,
  selectedTopic,
  setSelectedTopic,
  setOpen,
  setTopics,
  gistId,
}: {
  open: boolean;
  selectedTopic?: { id: string; title: string; content: string };
  setSelectedTopic?: React.Dispatch<
    React.SetStateAction<{ id: string; title: string; content: string } | null>
  >;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  setTopics: React.Dispatch<
    React.SetStateAction<{ id: string; title: string; content: string }[]>
  >;
  gistId: string;
}): JSX.Element => {
  // hooks
  const form = useForm<z.infer<typeof topicSchema>>({
    resolver: zodResolver(topicSchema),
    defaultValues: {
      title: "",
      content: "",
    },
  });

  const watchContent = form.watch("content");

  // states
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  // functions
  const getButtonText = () => {
    if (selectedTopic) {
      if (isSubmitting) {
        return "Updating...";
      }
      return "Update";
    }
    if (isSubmitting) {
      return "Adding...";
    }
    return "Add";
  };

  const onSubmit = async (values: z.infer<typeof topicSchema>) => {
    try {
      setIsSubmitting(true);
      console.log(values);

      if (selectedTopic) {
        const response = await updateTopic(selectedTopic.id, {
          title: values.title,
          content: values.content,
        });

        if (response.success) {
          toast.success("Topic updated successfully!");
          setTopics((prev) =>
            prev.map((topic) =>
              topic.id === selectedTopic.id
                ? { id: topic.id, ...values }
                : topic
            )
          );
        } else throw new Error("Failed to update topic");
      } else {
        const response = await addTopic({
          title: values.title,
          content: values.content,
          gistId,
        });

        if (response.success) {
          toast.success("Topic added successfully!");
          setTopics((prev) => [...prev, { id: uuidv4(), ...values }]);
        } else throw new Error("Failed to add topic");
      }
    } catch (error) {
      console.error(error);
      toast.error("Failed to add topic");
    } finally {
      setIsSubmitting(false);
      setOpen(false);
      form.reset();
      if (setSelectedTopic) {
        setSelectedTopic(null);
      }
    }
  };

  // effects
  useEffect(() => {
    if (watchContent === "<p><br></p>") {
      form.setValue("content", "");
    }
  }, [form, watchContent]);

  useEffect(() => {
    if (selectedTopic) {
      form.setValue("title", selectedTopic.title);
      form.setValue("content", selectedTopic.content);
    }
  }, [form, selectedTopic]);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="max-w-xl">
        <DialogHeader>
          <DialogTitle>{selectedTopic ? "Edit Topic" : "Add a Topic"}</DialogTitle>
          <DialogDescription>
            {selectedTopic ? "This will edit this topic" : "This will add a new topic to the list of topics of the gist."}
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <Stack gap={2}>
              <FormField
                control={form.control}
                name="title"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Title</FormLabel>
                    <FormControl>
                      <InputField
                        id="title"
                        placeholder="Enter a title for the topic"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="content"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Content</FormLabel>
                    <FormControl>
                      <Editor
                        id="content"
                        placeholder="Write your content here"
                        {...field}
                      />
                    </FormControl>
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
};
