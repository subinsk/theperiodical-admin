"use client";

import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
  Button,
  Label,
  InputField,
  Stack,
  Typography,
} from "@/components";
import { CreateTopicDialog } from "@/sections/gists/create/create-topic-dialog";
import { useState } from "react";
import { Icon } from "@iconify/react";
import { DeleteConfirmDialog } from "@/sections/gists/create/delete-confirm-dialog";

const TopicCard = ({
  id,
  title,
  content,
  setTopics,
}: {
  id: string;
  title: string;
  content: string;
  setTopics: React.Dispatch<
    React.SetStateAction<{ id: string; title: string; content: string }[]>
  >;
}) => {
  const [openDeleteConfirmDialog, setOpenDeleteConfirmDialog] =
    useState<boolean>(false);
  const [openEditTopicDialog, setOpenEditTopicDialog] =
    useState<boolean>(false);
  const [selectedTopic, setSelectedTopic] = useState<{
    id: string;
    title: string;
    content: string;
  } | null>(null);

  return (
    <Card>
      <CardHeader>
        <Stack direction="row" align="center" justify="between">
          <CardTitle>{title}</CardTitle>
          <Stack direction="row" gap={2}>
            <Button
              variant="outline"
              size="icon"
              onClick={() => {
                setSelectedTopic({ id, title, content });
                setOpenEditTopicDialog(true);
              }}
            >
              <Icon icon="tabler:pencil" width={16} height={16} />
            </Button>
            <Button
              variant="outline"
              size="icon"
              onClick={() => {
                setSelectedTopic({ id, title, content });
                setOpenDeleteConfirmDialog(true);
              }}
            >
              <Icon icon="tabler:trash" width={16} height={16} />
            </Button>
            <CreateTopicDialog
              open={openEditTopicDialog}
              selectedTopic={selectedTopic || undefined}
              setSelectedTopic={setSelectedTopic}
              setOpen={setOpenEditTopicDialog}
              setTopics={setTopics}
            />
            <DeleteConfirmDialog
              open={openDeleteConfirmDialog}
              selectedTopicId={selectedTopic?.id || ""}
              setOpen={setOpenDeleteConfirmDialog}
              setSelectedTopic={setSelectedTopic}
              setTopics={setTopics}
            />
          </Stack>
        </Stack>
      </CardHeader>
      <CardContent>
        <div dangerouslySetInnerHTML={{ __html: content }} />
      </CardContent>
    </Card>
  );
};

export default function CreateGistView(): JSX.Element {
  // states
  const [topics, setTopics] = useState<
    {
      id: string;
      title: string;
      content: string;
    }[]
  >([]);
  const [openCreateTopicDialog, setOpenCreateTopicDialog] =
    useState<boolean>(false);

  return (
    <div>
      <Tabs defaultValue="edit">
        <TabsList className="grid w-[400px] mx-auto grid-cols-2">
          <TabsTrigger value="edit">Edit</TabsTrigger>
          <TabsTrigger value="preview">Preview</TabsTrigger>
        </TabsList>
        <TabsContent value="edit">
          <Card>
            <CardHeader>
              <Stack direction="row" align="center" justify="between">
                <Stack>
                  <CardTitle>Edit</CardTitle>
                  <CardDescription>
                    Make changes to the gist here. Click save when you&apos;re
                    done.
                  </CardDescription>
                </Stack>
                <Button onClick={() => setOpenCreateTopicDialog(true)}>
                  Add Topic
                </Button>
                <CreateTopicDialog
                  open={openCreateTopicDialog}
                  setOpen={setOpenCreateTopicDialog}
                  setTopics={setTopics}
                />
              </Stack>
            </CardHeader>
            <CardContent>
              <Stack gap={2}>
                <Typography variant="h3">Topics</Typography>
                {topics.length === 0 ? (
                  <Typography variant="p" color="info">
                    No topics added yet
                  </Typography>
                ) : null}
                <Stack gap={2}>
                  {topics.map((topic, index) => (
                    <TopicCard key={index} setTopics={setTopics} {...topic} />
                  ))}
                </Stack>
              </Stack>
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="preview">
          <Card>
            <CardHeader>
              <CardTitle>Preview</CardTitle>
              <CardDescription>
                Change your password here. After saving, you&apos;ll be logged
                out.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-2">
              <div className="space-y-1">
                <Label htmlFor="current">Current password</Label>
                <InputField id="current" type="password" />
              </div>
              <div className="space-y-1">
                <Label htmlFor="new">New password</Label>
                <InputField id="new" type="password" />
              </div>
            </CardContent>
            <CardFooter>
              <Button>Save password</Button>
            </CardFooter>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
