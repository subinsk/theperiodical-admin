import {
  Button,
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components";
import CreateGistForm from "../create/create-gist-form";

export default function EditGistDialog({
  open,
  selectedGist,
  setSelectedGist,
  setOpen,
  setGistDetails,
}: {
  open: boolean;
  selectedGist: any;
  setOpen: any;
  setSelectedGist: any;
  setGistDetails: any;
}) {
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="max-w-4xl">
        <DialogHeader>
          <DialogTitle>Edit Gist</DialogTitle>
          <DialogDescription>
            Make changes to the gist here. Click save when you&apos;re done.
          </DialogDescription>
        </DialogHeader>
        <CreateGistForm
          selectedGist={selectedGist}
          setSelectedGist={setSelectedGist}
          setGistDetails={setGistDetails}
          setDialogOpen={setOpen}
        />
      </DialogContent>
    </Dialog>
  );
}
