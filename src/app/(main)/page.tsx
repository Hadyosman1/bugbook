import PostEditor from "@/components/posts/editor/PostEditor";
import Post from "@/components/posts/Post";
import TrendsSideBar from "@/components/TrendsSideBar";
import { prisma } from "@/lib/prisma";
import { postDataInclude } from "@/lib/types";

export default async function Home() {
  const posts = await prisma.post.findMany({
    include: postDataInclude,
    orderBy: { createdAt: "desc" },
  });

  return (
    <>
      <main className="grow space-y-5">
        <PostEditor />
        <div className="flex flex-col gap-5">
          {posts.map((post) => (
            <Post key={post.id} post={post} />
          ))}
        </div>
      </main>
      <TrendsSideBar />
    </>
  );
}
