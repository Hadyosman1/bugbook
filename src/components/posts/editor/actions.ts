"use server";

import { validateRequest } from "@/auth";
import { prisma } from "@/lib/prisma";
import { postSchema } from "@/lib/validations/post";

export async function SubmitPost(input: string) {
  const { user } = await validateRequest();

  if (!user) throw new Error("Unauthorized");

  const { content } = postSchema.parse({ content: input });

  await prisma.post.create({
    data: { content, userId: user.id },
  });
}
