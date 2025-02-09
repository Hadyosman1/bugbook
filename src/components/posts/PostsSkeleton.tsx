import { Skeleton } from "../ui/skeleton";

export const PostsSkeleton = ({ count = 3 }: { count?: number }) => {
  return (
    <div className="space-y-5">
      {Array.from({ length: count <= 0 ? 3 : count }, (_, i) => (
        <PostSkeleton key={i} />
      ))}
    </div>
  );
};
export const PostSkeleton = () => {
  return (
    <div className="animate-pulse space-y-3 rounded-2xl bg-card p-5 shadow-sm">
      <div className="flex flex-wrap items-center gap-3">
        <Skeleton className="size-12 rounded-full" />
        <div>
          <Skeleton className="h-4 w-20" />
          <Skeleton className="mt-1 h-2 w-10" />
        </div>
      </div>
      <Skeleton className="mt-3 h-5 w-20" />
      <Skeleton className="h-5 w-44" />
    </div>
  );
};
