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
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { v4 as uuidv4 } from "uuid";

export const CreateTopicDialog = ({
  open,
  selectedTopic,
  setSelectedTopic,
  setOpen,
  setTopics,
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
}): JSX.Element => {
  // hooks
  const formSchema = z.object({
    title: z
      .string()
      .min(1, {
        message: "Title must not be blank",
      })
      .max(100, {
        message: "Title must not be longer than 100 characters",
      }),
    content: z.string().min(1, {
      message: "Content must not be blank",
    }),
  });

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: "",
      content: "",
    },
  });

  const watchContent = form.watch("content");

  // functions
  const onSubmit = (values: z.infer<typeof formSchema>) => {
    console.log(values);

    if (selectedTopic) {
      setTopics((prev) =>
        prev.map((topic) =>
          topic.id === selectedTopic.id ? { id: topic.id, ...values } : topic
        )
      );
    } else {
      setTopics((prev) => [...prev, { id: uuidv4(), ...values }]);
    }

    setOpen(false);
    form.reset();
    if (setSelectedTopic) {
      setSelectedTopic(null);
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
          <DialogTitle>Add a Topic</DialogTitle>
          <DialogDescription>
            This will add a new topic to the list of topics of the gist.
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
              {selectedTopic ? "Update" : "Add"}
            </Button>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};
