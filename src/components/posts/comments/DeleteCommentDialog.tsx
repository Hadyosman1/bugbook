import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import LoadingButton from "@/components/ui/loading-button";
import { useDeleteCommentMutation } from "./mutations";
import { CommentData } from "@/lib/types";
import { Trash2Icon } from "lucide-react";

interface DeleteCommentDialogProps {
  comment: CommentData;
  open: boolean;
  onClose: () => void;
}

const DeleteCommentDialog = ({
  comment,
  onClose,
  open,
}: DeleteCommentDialogProps) => {
  const mutation = useDeleteCommentMutation();

  const handleOpenChange = (open: boolean) => {
    if (!open || !mutation.isPending) onClose();
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Delete comment?</DialogTitle>
          <DialogDescription>
            Are you sure you want to delete this comment? this action cannot be
            undone.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button
            disabled={mutation.isPending}
            variant="outline"
            onClick={onClose}
          >
            Cancel
          </Button>
          <LoadingButton
            variant="destructive"
            onClick={() => {
              mutation.mutate(comment.id, { onSuccess: onClose });
            }}
            isLoading={mutation.isPending}
          >
            Delete <Trash2Icon />
          </LoadingButton>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default DeleteCommentDialog;
