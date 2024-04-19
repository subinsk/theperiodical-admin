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
import CreateGistForm from "../create/create-gist-form";

export default function EditGistDialog({
  open,
  selectedGist,
  setSelectedGist,
  setOpen,
  setGistDetails,
  setOpenEditGistDialog,
}: {
  open: boolean;
  selectedGist: any;
  setSelectedGist: any;
  setOpen: any;
  setGistDetails: any;
  setOpenEditGistDialog: any;
}) {
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="max-w-xl">
        <DialogHeader>
          <DialogTitle>Add a Topic</DialogTitle>
          <DialogDescription>
            This will add a new topic to the list of topics of the gist.
          </DialogDescription>
        </DialogHeader>
        <CreateGistForm
          selectedGist={selectedGist}
          setSelectedGist={setSelectedGist}
          setGistDetails={setGistDetails}
          setOpenEditGistDialog={setOpenEditGistDialog}
        />
      </DialogContent>
    </Dialog>
  );
}
