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
} from "@/components";

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
  // functions
  const handleCancel = () => {
    setSelectedTopic(null);
    setOpen(false);
  };
  const handleDeleteTopic = () => {
    setTopics((prev) => prev.filter((topic) => topic.id !== selectedTopicId));
    setOpen(false);
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
          <AlertDialogAction onClick={handleDeleteTopic}>Yes</AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};
