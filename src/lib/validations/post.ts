import { z } from "zod";

export const postSchema = z.object({
  content: z.string().trim().min(1),
  mediaIds: z
    .array(z.string())
    .max(5, "You can only upload 5 media files at a time."),
});
