"use client";

import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
} from '@dnd-kit/core';

import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';

import {
  restrictToVerticalAxis,
  restrictToParentElement,
} from '@dnd-kit/modifiers';
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
import { forwardRef, useEffect, useState } from "react";
import { Icon } from "@iconify/react";
import EditGistDialog from "../../../sections/gists/edit/edit-gist-dialog";
import toast from "react-hot-toast";
import { deleteTopic, reorderTopics } from "@/services/topic.service";
import { ConfirmDialog } from "@/components/ui/confirm-dialog";
import { TopicCard } from "@/sections/topics/topic-card";
import { getGist, updateGist } from "@/services/gist.service";
import { Loader } from "@/components/ui/loader";

export default function EditGistView({
  slug
}: {
  slug: string
}): JSX.Element {
  // hooks
  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  // states
  const [openCreateTopicDialog, setOpenCreateTopicDialog] =
    useState<boolean>(false);
  const [openEditGistDialog, setOpenEditGistDialog] = useState<boolean>(false);
  const [isGistLoading, setIsGistLoading] = useState<boolean>(false);
  const [gistDetails, setGistDetails] = useState<any>(null);
  const [topics, setTopics] = useState<any[]>([]);
  const [previousTopics, setPreviousTopics] = useState<any[]>([]);
  const [isTopicEditing, setIsTopicEditing] = useState<boolean>(false);
  const [selectedGist, setSelectedGist] = useState<any>(null);

  // functions
  const sortByOrder = (topics: any[]) => {
    return [...topics].sort((a, b) => a.order - b.order);
  };

  const fetchGistDetails = async (slug: string) => {
    try {
      setIsGistLoading(true);

      const response = await getGist(slug);

      setGistDetails(response.gist);
      setTopics(sortByOrder(response.gist.topics || []));
    } catch (error) {
      console.error("Error fetching gist details:", error);
      toast.error("Failed to fetch gist details.");
    }
    finally {
      setIsGistLoading(false);
    }
  }

  async function handleUpdateGistTopics() {
    try {
      // Map topics to include their new order values
      const topicsWithOrder = topics.map((topic, index) => ({
        ...topic,
        order: index
      }));

      const payload = {
        topics: topicsWithOrder
      };

      await reorderTopics(payload);
      setTopics(topicsWithOrder);
    }
    catch (error) {
      console.error("Error updating gist topics:", error);
      toast.error("Failed to update gist topics.");
      setTopics(previousTopics);
    }
    finally {
      setIsTopicEditing(false);
      setPreviousTopics([]);
    }
  }

  function handleDragEnd(event: any) {
    const { active, over } = event;

    if (active.id !== over.id) {
      setIsTopicEditing(true);
      setPreviousTopics(topics);

      setTopics((prevItems) => {
        const oldIndex = prevItems.findIndex((item) => item.id === active.id);
        const newIndex = prevItems.findIndex((item) => item.id === over.id);

        return arrayMove(prevItems, oldIndex, newIndex);
      });
    }
  }

  // effects
  useEffect(() => {
    if (slug) {
      fetchGistDetails(slug);
    }
  }, [slug]);

  useEffect(() => {
    if(isTopicEditing) {handleUpdateGistTopics();}
  }, [isTopicEditing]);

  return (
    isGistLoading ?
      <Loader />
      :
      <Stack gap={3}>
        <Card>
          <CardHeader>
            <Stack direction="row" align="center" justify="between">
              <Stack>
                <CardTitle>{gistDetails?.title}</CardTitle>
                <CardDescription>{gistDetails?.description}</CardDescription>
              </Stack>
              <Stack direction="row" align="center" gap={4}>
                <Button
                  onClick={() => {
                    setSelectedGist(gistDetails);
                    setOpenEditGistDialog(true);
                  }}
                  variant="outline"
                  size="icon"
                >
                  <Icon icon="tabler:pencil" width={16} height={16} />
                </Button>
                <EditGistDialog
                  open={openEditGistDialog}
                  selectedGist={selectedGist}
                  setSelectedGist={setSelectedGist}
                  setOpen={setOpenEditGistDialog}
                  setGistDetails={setGistDetails}
                />
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
                  {gistDetails && (
                    <Stack gap={2}>
                      <DndContext
                        sensors={sensors}
                        collisionDetection={closestCenter}
                        onDragEnd={handleDragEnd}
                        modifiers={[restrictToVerticalAxis, restrictToParentElement]}
                      >
                        <SortableContext items={topics} strategy={verticalListSortingStrategy}>
                          {topics.map((topic, index) => (
                            <TopicCard
                              key={topic.id}
                              index={index}
                              setTopics={setTopics}
                              gistId={gistDetails?.id}
                              {...topic}
                            />
                          ))}
                        </SortableContext>
                      </DndContext>
                    </Stack>
                  )}
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
              <CardContent className="space-y-2">
                <Stack gap={2}>
                  {topics.map((topic, index) => (
                    <Stack key={index}>
                      <div className="font-bold text-xl">{topic.title}</div>
                      <div dangerouslySetInnerHTML={{ __html: topic.content }} />
                    </Stack>
                  ))}
                </Stack>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </Stack>
  );
}
