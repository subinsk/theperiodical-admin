import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
  Button,
  Stack,
  Typography,
} from "@/components";
import { deleteTopic } from "@/services/topic.service";
import { Loader2 } from "lucide-react";
import { useState } from "react";
import toast from "react-hot-toast";

export const DeleteConfirmDialog = ({
  open,
  setOpen,
  selectedTopicId,
  setSelectedTopic,
  setTopics,
}: {
  open: boolean;
  selectedTopicId: string;
  setSelectedTopic: React.Dispatch<
    React.SetStateAction<{ id: string; title: string; content: string } | null>
  >;

  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  setTopics: React.Dispatch<
    React.SetStateAction<{ id: string; title: string; content: string }[]>
  >;
}) => {
  // states
  const [isDeleting, setIsDeleting] = useState<boolean>(false);

  // functions
  const handleCancel = () => {
    setSelectedTopic(null);
    setOpen(false);
  };

  const handleDeleteTopic = async () => {
    try {
      setIsDeleting(true);
      const response = await deleteTopic(selectedTopicId);

      if (response.success) {
        toast.success("Topic deleted successfully!");
        setTopics((prev) =>
          prev.filter((topic) => topic.id !== selectedTopicId)
        );
        setOpen(false);
      } else {
        throw new Error("Failed to delete topic!");
      }
    } catch (error) {
      console.log(error);
      toast.error("Failed to delete topic!");
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <AlertDialog open={open} onOpenChange={setOpen}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>
            Are you sure to delete this topic?
          </AlertDialogTitle>
          <AlertDialogDescription>
            This action cannot be undone. This will permanently delete this
            topic from the gist.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel onClick={handleCancel}>Cancel</AlertDialogCancel>
          <AlertDialogAction onClick={handleDeleteTopic}>
            {isDeleting ? (
              <Loader2 className="mr-2 h-10 w-10 animate-spin" />
            ) : (
              "Yes"
            )}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};
