"use client";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { CommentData } from "@/lib/types";
import { cn } from "@/lib/utils";
import { MoreHorizontalIcon, Trash2Icon } from "lucide-react";
import DeleteCommentDialog from "./DeleteCommentDialog";
import { useState } from "react";

interface CommentMoreButtonProps {
  comment: CommentData;
  className?: string;
}

const CommentMoreButton = ({ comment, className }: CommentMoreButtonProps) => {
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button className={cn(className)} variant="ghost" size="icon">
            <MoreHorizontalIcon className="size-5 text-muted-foreground" />
            <span className="sr-only">comment more options button</span>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent>
          <DropdownMenuItem
            onClick={() => setShowDeleteDialog(true)}
            className="cursor-pointer text-destructive"
          >
            <Trash2Icon /> Delete
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <DeleteCommentDialog
        comment={comment}
        open={showDeleteDialog}
        onClose={() => setShowDeleteDialog(false)}
      />
    </>
  );
};

export default CommentMoreButton;
