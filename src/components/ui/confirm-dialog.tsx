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
import { Loader2 } from "lucide-react";

export const ConfirmDialog = ({
  open,
  title ,
  description,
  isLoading,
  onCancel,
  onDelete,
  setOpen,
}: {
  open: boolean;
  title: string;
  isLoading: boolean;
  description: string;
  onCancel: () => void;
  onDelete: () => void;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
}) => {
  return (
    <AlertDialog open={open} onOpenChange={setOpen}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>
            {title}
          </AlertDialogTitle>
          <AlertDialogDescription>
            {description}
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel onClick={()=>{
            setOpen(false);
            onCancel()}}>Cancel</AlertDialogCancel>
          <AlertDialogAction onClick={onDelete}>
            {isLoading ? (
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
