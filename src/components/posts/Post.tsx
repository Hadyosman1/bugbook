"use client";

import { PostData } from "@/lib/types";
import UserAvatar from "../UserAvatar";
import Link from "next/link";
import { cn, formatRelativeDate } from "@/lib/utils";
import PostMoreButton from "./PostMoreButton";
import { useSession } from "@/app/(main)/SessionProvider";
import Linkify from "../Linkify";
import UserTooltip from "../UserTooltip";
import { Media } from "@prisma/client";
import Image from "next/image";

interface PostProps {
  post: PostData;
}

const Post = ({ post }: PostProps) => {
  const { user: currentUser } = useSession();

  const { content, createdAt, id, user } = post;

  return (
    <article className="group space-y-3 rounded-2xl bg-card p-5 shadow-sm">
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
        attachments.length > 1 && "items-center sm:grid sm:grid-cols-2",
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
      <div className="grid place-items-center rounded-2xl bg-secondary/70 shadow">
        <video
          controls
          className="mx-auto aspect-video size-fit max-h-[30rem] rounded-xl"
        >
          <source src={media.url} />
        </video>
      </div>
    );
  }

  return <p className="text-destructive">Unsupported media type</p>;
};
