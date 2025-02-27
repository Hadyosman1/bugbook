import UserAvatar from "@/components/UserAvatar";
import UserTooltip from "@/components/UserTooltip";
import { CommentData } from "@/lib/types";
import { formatRelativeDate } from "@/lib/utils";
import Link from "next/link";
import CommentMoreButton from "./CommentMoreButton";
import { useSession } from "@/app/(main)/SessionProvider";

interface CommentProps {
  comment: CommentData;
}

const Comment = ({ comment }: CommentProps) => {
  const { user } = useSession();

  return (
    <div className="flex gap-3 py-3">
      <span className="shrink-0">
        <UserTooltip user={comment.user}>
          <Link href={`/users/${comment.user.username}`}>
            <UserAvatar
              className="size-8 sm:size-10"
              avatarUrl={comment.user.avatarUrl}
              size={40}
            />
          </Link>
        </UserTooltip>
      </span>
      <div className="w-full">
        <div className="flex items-start gap-1 text-sm ">
          <UserTooltip user={comment.user}>
            <Link
              href={`/users/${comment.user.username}`}
              className="font-medium hover:underline"
            >
              {comment.user.displayName}
            </Link>
          </UserTooltip>
          <span className="text-muted-foreground">
            {formatRelativeDate(comment.createdAt)}
          </span>
          {user.id === comment.userId && (
            <CommentMoreButton comment={comment} className="ms-auto flex" />
          )}
        </div>
        <div
          dir="auto"
          className="overflow-hidden whitespace-pre-line break-all pt-2"
        >
          {comment.content}
        </div>
      </div>
    </div>
  );
};

export default Comment;
