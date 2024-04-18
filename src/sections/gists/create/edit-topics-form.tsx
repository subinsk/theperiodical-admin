"use client";

import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  Button,
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

export default function EditTopicsForm({
  gistDetails,
  topics,
  setTopics,
}: {
  gistDetails: {
    id: string;
    title: string;
    description: string;
    from: Date;
    to: Date;
  } | null;
  topics: {
    id: string;
    title: string;
    content: string;
  }[];
  setTopics: React.Dispatch<
    React.SetStateAction<{ id: string; title: string; content: string }[]>
  >;
}): JSX.Element {
  const [openCreateTopicDialog, setOpenCreateTopicDialog] =
    useState<boolean>(false);

  return (
    <Stack gap={3}>
      <Card>
        <CardHeader>
          <Stack direction="row" align="center" justify="between">
            <Stack>
              <CardTitle>{gistDetails?.title}</CardTitle>
              <CardDescription>{gistDetails?.description}</CardDescription>
            </Stack>
            <Stack direction="row" align="center" gap={4}>
              <Button variant="outline" size="icon">
                <Icon icon="tabler:pencil" width={16} height={16} />
              </Button>
            </Stack>
          </Stack>
        </CardHeader>
      </Card>
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
                {gistDetails && (
                  <Stack direction="row" align="center" gap={4}>
                    <Button onClick={() => setOpenCreateTopicDialog(true)}>
                      Add Topic
                    </Button>
                    <CreateTopicDialog
                      open={openCreateTopicDialog}
                      setOpen={setOpenCreateTopicDialog}
                      setTopics={setTopics}
                      gistId={gistDetails?.id}
                    />
                  </Stack>
                )}
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
                This is how your gist will look like to others.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-2">Preview</CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </Stack>
  );
}
