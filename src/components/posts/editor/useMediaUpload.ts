import { useToast } from "@/hooks/use-toast";
import { useUploadThing } from "@/lib/uploadthing";
import { useCallback, useState } from "react";

export interface Attachment {
  file: File;
  mediaId?: string;
  isUploading: boolean;
}

const useMediaUpload = () => {
  const { toast } = useToast();

  const [attachments, setAttachments] = useState<Attachment[]>([]);

  const [uploadProgress, setUploadProgress] = useState<number>();

  const { startUpload, isUploading } = useUploadThing("attachment", {
    onBeforeUploadBegin: (files) => {
      const renamedFiles = files.map((f) => {
        const extension = f.name.slice(f.name.lastIndexOf(".") + 1);
        return new File([f], `attachment_${crypto.randomUUID()}.${extension}`, {
          type: f.type,
        });
      });

      setAttachments((prev) => [
        ...prev,
        ...renamedFiles.map((f) => ({ file: f, isUploading: true })),
      ]);

      return renamedFiles;
    },
    onUploadProgress: setUploadProgress,
    onClientUploadComplete: (res) => {
      setAttachments((prev) =>
        prev.map((a) => {
          const uploadResult = res.find((r) => r.name === a.file.name);

          console.log(uploadResult, "upload result");

          if (!uploadResult) return a;

          return {
            ...a,
            mediaId: uploadResult.serverData.mediaId,
            isUploading: false,
          };
        }),
      );
    },
    onUploadError: (e) => {
      console.error(e);
      setAttachments((prev) => prev.filter((a) => !a.isUploading));
      toast({
        variant: "destructive",
        description: e.message,
      });
    },
  });

  const handleStartUpload = useCallback((files: File[]) => {
    if (isUploading) {
      toast({
        variant: "destructive",
        description: "Please wait for the current upload to finish.",
      });
      return;
    }

    if (attachments.length + files.length > 5) {
      toast({
        variant: "destructive",
        description: "You can only upload 5 media files at a time.",
      });
      return;
    }

    startUpload(files);
  }, []);

  const removeAttachment = useCallback((fileName: string) => {
    setAttachments((prev) => prev.filter((a) => a.file.name !== fileName));
  }, []);

  const reset = useCallback(() => {
    setAttachments([]);
    setUploadProgress(undefined);
  }, []);

  return {
    startUpload: handleStartUpload,
    attachments,
    uploadProgress,
    isUploading,
    removeAttachment,
    reset,
  };
};

export default useMediaUpload;
