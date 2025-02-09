"use client";

import { PostData } from "@/lib/types";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "../ui/dialog";
import { useDeletePostMutation } from "./mutations";
import LoadingButton from "../ui/loading-button";
import { Trash2Icon } from "lucide-react";
import { Button } from "../ui/button";

interface DeletePostDialogProps {
  post: PostData;
  open: boolean;
  onClose: () => void;
}

const DeletePostDialog = ({ post, open, onClose }: DeletePostDialogProps) => {
  const deletePostMutation = useDeletePostMutation();

  function handleOpenChange(open: boolean) {
    if (!open || !deletePostMutation.isPending) {
      onClose();
    }
  }

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Delete post?</DialogTitle>
          <DialogDescription>
            Are you sure you want to delete this post? this action cannot be
            undone.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button
            disabled={deletePostMutation.isPending}
            variant="outline"
            onClick={onClose}
          >
            Cancel
          </Button>
          <LoadingButton
            variant="destructive"
            onClick={() => {
              deletePostMutation.mutate(post.id, { onSuccess: onClose });
            }}
            isLoading={deletePostMutation.isPending}
          >
            Delete <Trash2Icon />
          </LoadingButton>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default DeletePostDialog;
