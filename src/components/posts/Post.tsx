import { PostData } from "@/lib/types";
import UserAvatar from "../UserAvatar";
import Link from "next/link";
import { formatRelativeDate } from "@/lib/utils";

interface PostProps {
  post: PostData;
}

const Post = ({ post: { content, createdAt, id, user } }: PostProps) => {
  
  return (
    <article className="flex flex-col gap-3 rounded-2xl bg-card p-5 shadow-sm">
      <div className="flex flex-wrap items-center gap-3">
        <Link href={`/users/${user.username}`}>
          <UserAvatar
            username={user.username}
            displayName={user.displayName}
            avatarUrl={user.avatarUrl}
          />
        </Link>
        <div>
          <Link
            className="block text-lg font-medium hover:underline"
            href={`/users/${user.username}`}
          >
            {user.displayName || user.username}
          </Link>

          <Link
            href={`/posts/${id}`}
            className="block text-sm text-muted-foreground hover:underline"
          >
            {formatRelativeDate(createdAt)}
          </Link>
        </div>

        {/* <Button variant="secondary">Follow</Button> */}
      </div>
      <div className="whitespace-pre-line break-words">{content}</div>
    </article>
  );
};

export default Post;
