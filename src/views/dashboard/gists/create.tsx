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
import { CreateGistDialog } from "@/sections/gists/create/create-gist-dialog";
import { useState } from "react";

export default function CreateGistView(): JSX.Element {
  // states
  const [topics, setTopics] = useState<
    {
      title: string;
      content: string;
    }[]
  >([]);
  const [openCreateGistDialog, setOpenCreateGistDialog] =
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
                <Button onClick={() => setOpenCreateGistDialog(true)}>
                  Add Topic
                </Button>
                <CreateGistDialog
                  open={openCreateGistDialog}
                  setOpen={setOpenCreateGistDialog}
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
                    <Card key={index}>
                      <CardHeader>
                        <CardTitle>{topic.title}</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div
                          dangerouslySetInnerHTML={{
                            __html: topic.content,
                          }}
                        />
                      </CardContent>
                    </Card>
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
