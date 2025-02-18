"use client";

import { PostData } from "@/lib/types";
import UserAvatar from "../UserAvatar";
import Link from "next/link";
import { formatRelativeDate } from "@/lib/utils";
import PostMoreButton from "./PostMoreButton";
import { useSession } from "@/app/(main)/SessionProvider";
import Linkify from "../Linkify";
import UserTooltip from "../UserTooltip";

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
        <div className="whitespace-pre-line break-words">{content}</div>
      </Linkify>
    </article>
  );
};

export default Post;
