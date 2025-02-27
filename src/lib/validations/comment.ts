import { z } from "zod";
import { requiredString } from ".";

export const createCommentSchema = z.object({
  content: requiredString,
});
