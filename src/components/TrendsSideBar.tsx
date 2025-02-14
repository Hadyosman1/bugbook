import Link from "next/link";
import { Suspense } from "react";
import UserAvatar from "./UserAvatar";
import { prisma } from "@/lib/prisma";
import { Loader2 } from "lucide-react";
import { validateRequest } from "@/auth";
import { cn, formatNumber } from "@/lib/utils";
import { unstable_cache } from "next/cache";
import FollowButton from "./FollowButton";
import { getUserDataSelect } from "@/lib/types";

interface TrendsSideBarProps {
  className?: string;
}

const TrendsSideBar = ({ className }: TrendsSideBarProps) => {
  return (
    <aside
      className={cn(
        "sticky top-20 hidden h-fit w-72 min-w-60 max-w-xs flex-none space-y-4 md:block lg:w-80",
        className,
      )}
    >
      <Suspense fallback={<Loader2 className="mx-auto animate-spin" />}>
        <WhoToFollow />
        <TrendingTopics />
      </Suspense>
    </aside>
  );
};

export default TrendsSideBar;

const WhoToFollow = async () => {
  const { user } = await validateRequest();

  if (!user) return null;

  const usersToFollow = await prisma.user.findMany({
    where: {
      NOT: {
        id: user.id,
      },
      followers: {
        none: {
          followerId: user.id,
        },
      },
    },
    select: getUserDataSelect(user.id),
    take: 5,
  });

  return (
    <div className="space-y-5 rounded-2xl bg-card p-5 shadow-sm">
      <h2 className="text-lg font-medium">Who to follow</h2>
      <ul className="space-y-3">
        {usersToFollow.map((user) => (
          <li key={user.id} className="flex items-center justify-between gap-2">
            <Link
              href={`/users/${user.username}`}
              className="flex items-center gap-3"
            >
              <UserAvatar
                className="flex-none"
                avatarUrl={user.avatarUrl}
                username={user.username}
                displayName={user.displayName}
              />
              <div className="flex flex-col">
                <div className="text-sm font-medium text-foreground">
                  <p className="line-clamp-1 break-all font-semibold hover:underline">
                    {user.displayName}
                  </p>
                  <p className="line-clamp-1 break-all text-muted-foreground">
                    @{user.username}
                  </p>
                </div>
              </div>
            </Link>
            <FollowButton
              userId={user.id}
              initialState={{
                followers: user._count.followers,
                isFollowedByUser: user.followers.some(
                  ({ followerId }) => followerId === user.id,
                ),
              }}
            />
          </li>
        ))}
      </ul>
    </div>
  );
};

const getTrendingTopics = unstable_cache(
  async () => {
    const trends = await prisma.$queryRaw<{ hashtag: string; count: bigint }[]>`
    SELECT LOWER(unnest(regexp_matches(content,'#[[:alnum:]_]+','g'))) AS hashtag, COUNT(*) AS count
    FROM posts
    GROUP BY (hashtag)
    ORDER BY count DESC, hashtag ASC
    LIMIT 5
  `;

    return trends.map((row) => ({
      hashtag: row.hashtag,
      count: Number(row.count),
    }));
  },
  ["trends-topics"],
  {
    revalidate: 60 * 60 * 3, // 3 hours
  },
);

const TrendingTopics = async () => {
  const trendingTopics = await getTrendingTopics();

  return (
    <div className="space-y-5 rounded-2xl bg-card p-5 shadow-sm">
      <h2 className="text-lg font-medium">Trending topics</h2>

      <ul className="space-y-1.5">
        {trendingTopics.map(({ hashtag, count }) => {
          const title = hashtag.split("#")?.[1];

          return (
            <li key={`${title}`}>
              <Link
                title={title}
                href={`/hashtag/${title}`}
                className="flex items-center justify-between gap-1 text-sm text-primary hover:underline"
              >
                <p className="line-clamp-1 break-all">{hashtag}</p>
                <p className="text-xs text-muted-foreground">
                  {formatNumber(count)} {count === 1 ? "post" : "posts"}
                </p>
              </Link>
            </li>
          );
        })}
      </ul>
    </div>
  );
};
