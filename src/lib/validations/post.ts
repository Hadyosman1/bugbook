import { z } from "zod";

export const postSchema = z.object({
  content: z.string().trim().min(1),
});
