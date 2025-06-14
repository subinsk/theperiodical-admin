import { Button, Card, CardContent, CardHeader, CardTitle, Stack } from "@/components";
import { deleteTopic } from "@/services/topic.service";
import { Icon } from "@iconify/react/dist/iconify.js";
import { forwardRef, useState } from "react";
import { Draggable } from "react-beautiful-dnd";
import toast from "react-hot-toast";
import { CreateTopicDialog } from "../gists/create/create-topic-dialog";
import { ConfirmDialog } from "@/components/ui/confirm-dialog";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from '@dnd-kit/utilities';


type Topic = {
  id: string;
  index: number;
  title: string;
  content: string;
  setTopics: React.Dispatch<
    React.SetStateAction<{ id: string; title: string; content: string }[]>
  >;
  gistId: string;
};

export const TopicCard = forwardRef<HTMLDivElement, Topic>(
  ({ id, index, title, content, setTopics, gistId, ...props }, ref) => {

    // hooks
    const {
      attributes,
      listeners,
      setNodeRef,
      transform,
      transition,
    } = useSortable({ id });

    const style = {
      transform: CSS.Transform.toString(transform),
      transition,
    };
    const isCursorGrabbing = attributes['aria-pressed'];

    // states
    const [openDeleteConfirmDialog, setOpenDeleteConfirmDialog] =
      useState<boolean>(false);
    const [openEditTopicDialog, setOpenEditTopicDialog] =
      useState<boolean>(false);
    const [selectedTopic, setSelectedTopic] = useState<{
      id: string;
      title: string;
      content: string;
    } | null>(null);
    const [isDeleting, setIsDeleting] = useState<boolean>(false);


    // functions
    const handleCancel = () => {
      setSelectedTopic(null);
    };

    const handleDeleteTopic = async () => {
      try {
        setIsDeleting(true);
        const response = await deleteTopic(selectedTopic?.id as string);

        if (response.success) {
          toast.success("Topic deleted successfully!");

          setTopics((prev) =>
            prev.filter((topic) => topic.id !== selectedTopic?.id)
          );

        } else {
          throw new Error("Failed to delete topic!");
        }
      } catch (error) {
        console.log(error);
        toast.error("Failed to delete topic!");
      } finally {
        setOpenEditTopicDialog(false);
        setIsDeleting(false);
      }
    };

    return (
      <div ref={setNodeRef} style={style} key={id}>
        <Card {...props}>
          <CardHeader className="px-6 py-3">
            <Stack direction="row" align="center" justify="between">
              <Stack direction="row" align="center" gap={3}>
                <span {...attributes} {...listeners} className={` ${isCursorGrabbing ? 'cursor-grabbing' : 'cursor-grab'}`} aria-describedby={`DndContext-${id}`}>
                  <Icon
                    className="cursor-pointer"
                    icon="tabler:grip-vertical"
                    width={22}
                    height={22}
                  />
                </span>
                <CardTitle className="text-lg">{title}</CardTitle>
              </Stack>
              <Stack direction="row" gap={2}>
                <Button
                  variant="outline"
                  size="icon"
                  className="w-8 h-8"
                  onClick={() => {
                    setSelectedTopic({ id, title, content });
                    setOpenEditTopicDialog(true);
                  }}
                >
                  <Icon icon="tabler:pencil" width={14} height={14} />
                </Button>
                <Button
                  variant="outline"
                  size="icon"
                  className="w-8 h-8"
                  onClick={() => {
                    setSelectedTopic({ id, title, content });
                    setOpenDeleteConfirmDialog(true);
                  }}
                >
                  <Icon icon="tabler:trash" width={14} height={14} />
                </Button>
                <CreateTopicDialog
                  open={openEditTopicDialog}
                  setOpen={setOpenEditTopicDialog}
                  setTopics={setTopics}
                  gistId={gistId}
                  selectedTopic={selectedTopic}
                  setSelectedTopic={setSelectedTopic}
                />
                <ConfirmDialog
                  open={openDeleteConfirmDialog}
                  setOpen={setOpenDeleteConfirmDialog}
                  title="Are you sure you want to delete this topic?"
                  description="This action cannot be undone. This will permanently delete this topic."
                  isLoading={isDeleting}
                  onCancel={handleCancel}
                  onConfirm={handleDeleteTopic}
                />
              </Stack>
            </Stack>
          </CardHeader>
          <CardContent>
            <div
              style={{
                display: "-webkit-box",
                WebkitBoxOrient: "vertical",
                WebkitLineClamp: 2,
                overflow: "hidden",
                textOverflow: "ellipsis",
              }}
              className="text-sm pl-8"
              dangerouslySetInnerHTML={{ __html: content }}
            />
          </CardContent>
        </Card>
      </div>
    );
  }
);

TopicCard.displayName = "TopicCard";