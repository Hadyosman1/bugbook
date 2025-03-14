"use server";

import { validateRequest } from "@/auth";
import { prisma } from "@/lib/prisma";
import { getCommentDataInclude, PostData } from "@/lib/types";
import { createCommentSchema } from "@/lib/validations/comment";

export async function submitComment({
  post,
  content,
}: {
  post: PostData;
  content: string;
}) {
  const { user } = await validateRequest();

  if (!user) throw Error("Unauthorized");

  const { content: parsedContent } = createCommentSchema.parse({ content });

  const [newComment] = await prisma.$transaction([
    prisma.comment.create({
      data: {
        content: parsedContent,
        postId: post.id,
        userId: user.id,
      },
      include: getCommentDataInclude(user.id),
    }),
    ...(post.userId !== user.id
      ? [
          prisma.notification.create({
            data: {
              issuerId: user.id,
              recipientId: post.userId,
              postId: post.id,
              type: "COMMENT",
            },
          }),
        ]
      : []),
  ]);

  return newComment;
}

export async function deleteComment(id: string) {
  const { user } = await validateRequest();

  if (!user) throw Error("Unauthorized");

  const comment = await prisma.comment.findUnique({
    where: { id },
  });

  if (!comment) throw Error("Comment not found");

  if (comment.userId !== user.id) throw Error("Unauthorized");

  const deletedComment = await prisma.comment.delete({
    where: { id },
    include: getCommentDataInclude(user.id),
  });

  return deletedComment;
}
