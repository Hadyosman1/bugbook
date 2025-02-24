"use client";

import Placeholder from "@tiptap/extension-placeholder";
import { EditorContent, useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";

import { useSession } from "@/app/(main)/SessionProvider";
import UserAvatar from "@/components/UserAvatar";

import { Button } from "@/components/ui/button";
import LoadingButton from "@/components/ui/loading-button";
import { ImageIcon, Loader2, SendIcon, XIcon } from "lucide-react";
import { ClipboardEvent, useRef } from "react";
import { useSubmitPostMutation } from "./mutations";
import "./styles.css";
import useMediaUpload, { Attachment } from "./useMediaUpload";
import { cn } from "@/lib/utils";
import Image from "next/image";
import { useDropzone } from "@uploadthing/react";

const PostEditor = () => {
  const { user } = useSession();

  const submitPostMutation = useSubmitPostMutation();

  const {
    reset: resetMediaUploads,
    attachments,
    startUpload,
    uploadProgress,
    isUploading,
    removeAttachment,
  } = useMediaUpload();

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop: startUpload,
  });

  const { onClick: _, ...rootProps } = getRootProps();

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

  const onPaste = (e: ClipboardEvent<HTMLInputElement>) => {
    const files = Array.from(e.clipboardData.items)
      .filter((item) => item.kind === "file")
      .map((item) => item.getAsFile()!);

    startUpload(files);
  };

  const handleSubmit = () => {
    submitPostMutation.mutate(
      {
        content: input,
        mediaIds: attachments.map((a) => a.mediaId).filter(Boolean) as string[],
      },
      {
        onSuccess: () => {
          editor?.commands.clearContent();
          resetMediaUploads();
        },
      },
    );
  };

  return (
    <div className="flex flex-col gap-5 rounded-2xl bg-card p-5 shadow-sm">
      <div className="flex gap-5">
        <UserAvatar
          avatarUrl={user.avatarUrl}
          className="hidden shrink-0 self-start sm:inline"
        />
        <div
          {...rootProps}
          className={cn(
            "w-full overflow-hidden rounded-2xl",
            isDragActive && "outline-dashed outline-2 outline-primary",
          )}
        >
          <EditorContent
            dir="auto"
            editor={editor}
            className="max-h-96 w-full overflow-y-auto bg-background px-5 py-3"
            onPaste={onPaste}
          />
          <input {...getInputProps()} onPaste={onPaste} />
        </div>
      </div>
      {!!attachments.length && (
        <AttachmentPreviews
          attachments={attachments}
          removeAttachment={removeAttachment}
        />
      )}
      <div className="flex items-center justify-end gap-3">
        {isUploading && (
          <>
            <span className="text-sm">{uploadProgress ?? 0}%</span>
            <Loader2 className="size-5 animate-spin text-primary" />
          </>
        )}
        <AddAttachmentsButton
          onFileSelected={startUpload}
          disabled={isUploading || attachments.length >= 5}
        />
        <LoadingButton
          onClick={() => {
            if (!input.trim() || isUploading) return editor?.commands.focus();
            handleSubmit();
          }}
          disabled={!input.trim() || isUploading}
          isLoading={submitPostMutation.isPending}
          className="min-w-20 gap-1.5"
        >
          Post <SendIcon />
        </LoadingButton>
      </div>
    </div>
  );
};

export default PostEditor;

interface AddAttachmentsButtonProps {
  onFileSelected: (files: File[]) => void;
  disabled: boolean;
}

const AddAttachmentsButton = ({
  onFileSelected,
  disabled,
}: AddAttachmentsButtonProps) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  return (
    <>
      <input
        multiple
        ref={fileInputRef}
        hidden
        type="file"
        accept="image/*, video/*"
        className="sr-only hidden"
        onChange={(e) => {
          const files = Array.from(e.target.files || []);

          if (files.length) {
            onFileSelected(files);
            e.target.value = "";
          }
        }}
      />
      <Button
        variant="secondary"
        size="icon"
        className="text-primary"
        disabled={disabled}
        onClick={() => fileInputRef.current?.click()}
      >
        <ImageIcon size={20} />
        <span className="sr-only">Add attachments</span>
      </Button>
    </>
  );
};

interface AttachmentPreviewsProps {
  attachments: Attachment[];
  removeAttachment: (fileName: string) => void;
}

const AttachmentPreviews = ({
  attachments,
  removeAttachment,
}: AttachmentPreviewsProps) => {
  return (
    <div
      className={cn(
        "flex flex-col gap-3",
        attachments.length > 1 && "sm:grid sm:grid-cols-2",
      )}
    >
      {attachments.map((att) => (
        <AttachmentPreview
          key={att.file.name}
          attachment={att}
          onRemoveClick={() => removeAttachment(att.file.name)}
        />
      ))}
    </div>
  );
};

interface AttachmentPreviewProps {
  attachment: Attachment;
  onRemoveClick: () => void;
}

const AttachmentPreview = ({
  attachment: { file, isUploading },
  onRemoveClick,
}: AttachmentPreviewProps) => {
  const src = URL.createObjectURL(file);

  return (
    <div
      className={cn("relative mx-auto size-fit", isUploading && "opacity-50")}
    >
      {file.type.startsWith("image") ? (
        <Image
          src={src}
          alt={`attachment ${file.name}`}
          width={500}
          height={500}
          className="size-fit max-h-[30rem] rounded-2xl shadow"
        />
      ) : (
        <video controls className="size-fit max-h-[30rem] rounded-2xl shadow">
          <source src={src} type={file.type} />
        </video>
      )}
      {!isUploading && (
        <button
          className="absolute right-3 top-3 rounded-full bg-foreground p-1.5 text-background transition-colors duration-200 hover:bg-foreground/60"
          title="remove attachment"
          onClick={onRemoveClick}
        >
          <XIcon size={20} />
        </button>
      )}
    </div>
  );
};
