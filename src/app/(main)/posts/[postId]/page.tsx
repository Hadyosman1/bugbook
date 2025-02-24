import { validateRequest } from "@/auth";
import FollowButton from "@/components/FollowButton";
import Linkify from "@/components/Linkify";
import Post from "@/components/posts/Post";
import UserAvatar from "@/components/UserAvatar";
import UserTooltip from "@/components/UserTooltip";
import { prisma } from "@/lib/prisma";
import { getPostDataInclude, UserData } from "@/lib/types";
import { Loader2 } from "lucide-react";
import { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { cache, Suspense } from "react";

interface PostDetailsPageProps {
  params: Promise<{ postId: string }>;
}

const getPost = cache(async (postId: string, loggedInUserId: string) => {
  const post = await prisma.post.findUnique({
    where: { id: postId },
    include: getPostDataInclude(loggedInUserId),
  });

  if (!post) notFound();

  return post;
});

export async function generateMetadata({
  params,
}: PostDetailsPageProps): Promise<Metadata> {
  const postId = (await params).postId;

  const { user } = await validateRequest();

  if (!user) return {};

  const post = await getPost(postId, user.id);

  return {
    title: `${post.user.displayName}: ${post.content.slice(0, 50)}...`,
    description: post.content.slice(0, 155),
  };
}

const PostDetailsPage = async ({ params }: PostDetailsPageProps) => {
  const postId = (await params).postId;

  const { user } = await validateRequest();

  if (!user) {
    return (
      <p className="text-destructive">
        You are not authorized to view this page.
      </p>
    );
  }

  const post = await getPost(postId, user.id);

  return (
    <main className="flex w-full min-w-0 gap-5">
      <div className="w-full min-w-0 space-y-5">
        <Post post={post} />
      </div>
      <div className="sticky top-20 hidden h-fit w-72 min-w-60 max-w-xs flex-none space-y-4 lg:block lg:w-80">
        <Suspense fallback={<Loader2 className="mx-auto my-6 animate-spin" />}>
          <UserInfoSidebar user={post.user} />
        </Suspense>
      </div>
    </main>
  );
};

export default PostDetailsPage;

interface UserInfoSidebarProps {
  user: UserData;
}

const UserInfoSidebar = async ({ user }: UserInfoSidebarProps) => {
  const { user: loggedInUser } = await validateRequest();

  if (!loggedInUser) return null;

  return (
    <aside className="space-y-5 rounded-2xl bg-card p-5 shadow-sm">
      <div className="text-xl font-bold">About this user</div>
      <div className="flex items-center justify-between">
        <UserTooltip user={user}>
          <Link
            href={`/users/${user.username}`}
            className="flex items-center gap-3"
          >
            <UserAvatar avatarUrl={user.avatarUrl} className="flex-none" />
            <div>
              <p className="line-clamp-1 break-all font-semibold hover:underline">
                {user.displayName}
              </p>
              <p className="line-clamp-1 break-all text-muted-foreground">
                @{user.username}
              </p>
            </div>
          </Link>
        </UserTooltip>
        {user.id !== loggedInUser.id && (
          <FollowButton
            initialState={{
              followers: user._count.followers,
              isFollowedByUser: user.followers.some(
                ({ followerId }) => followerId === loggedInUser.id,
              ),
            }}
            userId={user.id}
          />
        )}
      </div>

      <Linkify>
        <div className="line-clamp-6 whitespace-pre-line break-words text-muted-foreground">
          {(user.bio ?? "").trim()}
        </div>
      </Linkify>
    </aside>
  );
};
