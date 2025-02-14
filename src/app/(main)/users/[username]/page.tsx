import { validateRequest } from "@/auth";
import TrendsSideBar from "@/components/TrendsSideBar";
import { prisma } from "@/lib/prisma";
import { FollowerInfo, getUserDataSelect, UserData } from "@/lib/types";
import { Metadata } from "next";
import Image from "next/image";
import { notFound } from "next/navigation";
import { cache } from "react";

import avatarPlaceholder from "@/../public/avatar-placeholder.png";
import { formatDate } from "date-fns";
import { formatNumber } from "@/lib/utils";
import FollowerCount from "@/components/FollowerCount";
import { Button } from "@/components/ui/button";
import FollowButton from "@/components/FollowButton";
import UserPosts from "./UserPosts";

interface UserProfilePageProps {
  params: Promise<{ username: string }>;
}

const getUser = cache(async (username: string, loggedInUserId: string) => {
  const user = await prisma.user.findFirst({
    where: { username: { equals: username, mode: "insensitive" } },
    select: getUserDataSelect(loggedInUserId),
  });

  if (!user) notFound();

  return user;
});

export async function generateMetadata({
  params,
}: UserProfilePageProps): Promise<Metadata> {
  const username = (await params).username;

  const { user: loggedInUser } = await validateRequest();

  if (!loggedInUser) return {};

  const user = await getUser(username, loggedInUser.id);

  return {
    title: `${user.displayName} (@${user.username})`,
  };
}

const UserProfilePage = async ({ params }: UserProfilePageProps) => {
  const username = (await params).username;

  const { user: loggedInUser } = await validateRequest();

  if (!loggedInUser) {
    return (
      <p className="text-destructive">
        You are not authorized to view this page.
      </p>
    );
  }

  const user = await getUser(username, loggedInUser.id);

  return (
    <main className="grow">
      <div className="flex w-full min-w-0 gap-5">
        <div className="w-full min-w-0 space-y-5">
          <UserProfile user={user} loggedInUserId={loggedInUser.id} />
          <div className="rounded-2xl bg-card p-3 shadow-sm">
            <h2 className="text-center text-2xl font-bold">
              {user.displayName}
              {"'s posts"}
            </h2>
          </div>
          <UserPosts userId={user.id} />
        </div>
        <TrendsSideBar />
      </div>
    </main>
  );
};

export default UserProfilePage;

interface UserProfileProps {
  user: UserData;
  loggedInUserId: string;
}

async function UserProfile({ user, loggedInUserId }: UserProfileProps) {
  const followerInfo: FollowerInfo = {
    followers: user._count.followers,
    isFollowedByUser: user.followers.some(
      ({ followerId }) => followerId === loggedInUserId,
    ),
  };

  return (
    <section className="rounded-2xl bg-card p-5 shadow-sm md:p-7">
      <div className="space-y-3">
        <Image
          src={user.avatarUrl ?? avatarPlaceholder}
          alt={`${user.displayName} avatar`}
          width={256}
          height={256}
          className="mx-auto max-h-64 max-w-64 rounded-full shadow-sm"
        />

        <div className="flex flex-wrap gap-3">
          <div className="me-auto space-y-2">
            <div>
              <h1 className="text-3xl font-bold">{user.displayName}</h1>
              <p className="text-muted-foreground">@{user.username}</p>
            </div>
            <div>Member since {formatDate(user.createdAt, "MMM d, yyyy")}</div>
            <div className="flex items-center gap-3">
              <p>
                Posts:{" "}
                <span className="font-semibold">
                  {formatNumber(user._count.posts)}
                </span>
              </p>
              <FollowerCount userId={user.id} initialState={followerInfo} />
            </div>
          </div>
          {user.id === loggedInUserId ? (
            <Button>Edit profile</Button>
          ) : (
            <FollowButton userId={user.id} initialState={followerInfo} />
          )}
        </div>
        {user.bio && (
          <>
            <hr />
            <p className="overflow-hidden whitespace-pre-line break-words">
              {user.bio}
            </p>
          </>
        )}
      </div>
    </section>
  );
}
