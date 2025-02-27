"use client";

import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { PostData } from "@/lib/types";
import { Loader2, SendHorizontalIcon } from "lucide-react";
import { FormEvent, useState } from "react";
import { useSubmitCommentMutation } from "./mutations";

interface CommentInputProps {
  post: PostData;
}

const CommentInput = ({ post }: CommentInputProps) => {
  const [input, setInput] = useState("");

  const mutation = useSubmitCommentMutation(post.id);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    if (!input) return;

    mutation.mutate(
      { content: input, post },
      { onSuccess: () => setInput("") },
    );
  };

  return (
    <form onSubmit={handleSubmit} className="flex items-start gap-2">
      <Textarea
        autoFocus
        value={input}
        onChange={(e) => setInput(e.target.value)}
        placeholder="Write a comment..."
        className="max-h-72 min-h-14 resize-none max-w-full break-all rounded-2xl bg-background [field-sizing:content]"
      />
      <Button
        title="Send"
        type="submit"
        variant={!input.trim() || mutation.isPending ? "ghost" : "default"}
        disabled={!input.trim() || mutation.isPending}
        className="rounded-2xl"
      >
        {mutation.isPending ? (
          <Loader2 className="animate-spin" />
        ) : (
          <SendHorizontalIcon />
        )}
      </Button>
    </form>
  );
};

export default CommentInput;
