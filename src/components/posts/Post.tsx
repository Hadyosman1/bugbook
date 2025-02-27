"use client";

import { useSession } from "@/app/(main)/SessionProvider";
import { PostData } from "@/lib/types";
import { cn, formatRelativeDate } from "@/lib/utils";
import { Media } from "@prisma/client";
import { MessageSquareIcon } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import Linkify from "../Linkify";
import UserAvatar from "../UserAvatar";
import UserTooltip from "../UserTooltip";
import BookmarkButton from "./BookmarkButton";
import LikeButton from "./LikeButton";
import PostMoreButton from "./PostMoreButton";
import Comments from "./comments/Comments";
import { Button } from "../ui/button";

interface PostProps {
  post: PostData;
}

const Post = ({ post }: PostProps) => {
  const { user: currentUser } = useSession();

  const { content, createdAt, id, user } = post;

  const [showComments, setShowComment] = useState(false);

  return (
    <article className="group space-y-3 rounded-2xl bg-card p-5 shadow-sm dark:border">
      <div className="flex flex-wrap items-center gap-3">
        <UserTooltip user={user}>
          <Link href={`/users/${user.username}`} className="rounded-full">
            <UserAvatar avatarUrl={user.avatarUrl} />
          </Link>
        </UserTooltip>
        <div>
          <UserTooltip user={user}>
            <Link
              className="block text-lg font-medium hover:underline"
              href={`/users/${user.username}`}
            >
              {user.displayName || user.username}
            </Link>
          </UserTooltip>

          <Link
            suppressHydrationWarning
            href={`/posts/${id}`}
            className="block text-sm text-muted-foreground hover:underline"
          >
            {formatRelativeDate(createdAt)}
          </Link>
        </div>

        {currentUser.id === user.id && (
          <PostMoreButton
            post={post}
            className="ms-auto self-start transition-opacity duration-300 focus:opacity-100 active:opacity-100 group-hover:opacity-100 md:opacity-0"
          />
        )}
      </div>
      <Linkify>
        <div className="whitespace-pre-line break-words" dir="auto">
          {content}
        </div>
      </Linkify>
      {!!post.attachments.length && (
        <MediaPreviews attachments={post.attachments} />
      )}

      <hr className="text-muted-foreground" />

      <div className="flex items-center justify-between gap-5 pt-1">
        <div className="flex items-center gap-5">
          <LikeButton
            postId={post.id}
            initialState={{
              likes: post._count.likes,
              isLikedByUser: post.likes.some(
                (l) => l.userId === currentUser.id,
              ),
            }}
          />
          <CommentButton
            post={post}
            onClick={() => setShowComment((prev) => !prev)}
          />
        </div>
        <BookmarkButton
          postId={post.id}
          initialState={{
            isBookmarkedByUser: post.bookmarks.some(
              (b) => b.userId === currentUser.id,
            ),
          }}
        />
      </div>
      {showComments && <Comments post={post} />}
    </article>
  );
};

export default Post;

interface MediaPreviewsProps {
  attachments: Media[];
}

const MediaPreviews = ({ attachments }: MediaPreviewsProps) => {
  return (
    <div
      className={cn(
        "flex flex-col gap-3",
        attachments.length > 1 &&
          "*:mb-3 sm:block sm:columns-2 sm:*:h-full sm:*:w-full",
      )}
    >
      {attachments.map((a) => (
        <MediaPreview key={a.id} media={a} />
      ))}
    </div>
  );
};

interface MediaPreviewProps {
  media: Media;
}

const MediaPreview = ({ media }: MediaPreviewProps) => {
  if (media.type === "IMAGE") {
    return (
      <Image
        src={media.url}
        alt="media"
        width={500}
        height={500}
        className="mx-auto size-fit max-h-[30rem] rounded-2xl shadow"
      />
    );
  }

  if (media.type === "VIDEO") {
    return (
      <div className="rounded-2xl bg-secondary/70 shadow">
        <video
          controls
          className="aspect-video size-fit max-h-[30rem] w-full rounded-xl"
        >
          <source src={media.url} />
        </video>
      </div>
    );
  }

  return <p className="text-destructive">Unsupported media type</p>;
};

interface CommentButtonProps {
  post: PostData;
  onClick: () => void;
}

const CommentButton = ({ post, onClick }: CommentButtonProps) => {
  return (
    <Button variant="ghost" size="sm" onClick={onClick}>
      <MessageSquareIcon className="size-5" />
      <span className="text-sm font-medium tabular-nums">
        {post._count.comments}{" "}
        <span className="hidden sm:inline">Comments</span>
      </span>
    </Button>
  );
};
