"use client";

import Placeholder from "@tiptap/extension-placeholder";
import { EditorContent, useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";

import { useSession } from "@/app/(main)/SessionProvider";
import UserAvatar from "@/components/UserAvatar";
import { Button } from "@/components/ui/button";

import { SubmitPost } from "./actions";

import { SendIcon } from "lucide-react";
import "./styles.css";

const PostEditor = () => {
  const { user } = useSession();

  const editor = useEditor({
    extensions: [
      StarterKit.configure({ bold: false, italic: false }),
      Placeholder.configure({
        placeholder: "What's your thoughts?",
      }),
    ],
    immediatelyRender: false,
  });

  const input =
    editor?.getText({
      blockSeparator: "\n",
    }) || "";

  const handleSubmit = async () => {
    try {
      await SubmitPost(input);
    } catch (error) {
      console.error(error);
    }
    editor?.commands?.clearContent();
  };

  return (
    <div className="flex flex-col gap-5 rounded-2xl bg-card p-5 shadow-sm">
      <div className="flex gap-5">
        <UserAvatar
          username={user.username}
          displayName={user.displayName}
          avatarUrl={user.avatarUrl}
          className="hidden sm:inline"
        />
        <EditorContent
          editor={editor}
          className={
            "max-h-80 min-h-20 w-full overflow-y-auto rounded-2xl bg-background px-5 py-3"
          }
        />
      </div>
      <div className="flex justify-end">
        <Button
          onClick={() => {
            if (!input.trim()) return editor?.commands.focus();
            handleSubmit();
          }}
          className="min-w-24 gap-1.5"
        >
          Post <SendIcon />
        </Button>
      </div>
    </div>
  );
};

export default PostEditor;
