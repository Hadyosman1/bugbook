import { validateRequest } from "@/auth";
import { prisma } from "@/lib/prisma";
import { postDataInclude, PostsPage } from "@/lib/types";
import { type NextRequest } from "next/server";

// const MockPosts = Array.from({ length: 30 }).map((_, i) => ({
//   userId: "u2hisrzpo2p4b4jh",
//   content: `This is a post number ${i + 1}`,
// }));

export async function GET(req: NextRequest) {
  // Mock posts creation
  // await prisma.post.createMany({ data: MockPosts });
  // await new Promise((r) => setTimeout(r, 5000));

  try {
    const cursor = req.nextUrl.searchParams.get("cursor") || undefined;

    const PAGE_SIZE = 10;

    const { user } = await validateRequest();

    if (!user) return Response.json({ error: "Unauthorized" }, { status: 401 });

    const posts = await prisma.post.findMany({
      include: postDataInclude,
      orderBy: { createdAt: "desc" },
      take: PAGE_SIZE + 1,
      cursor: cursor ? { id: cursor } : undefined,
    });

    const nextCursor = posts.length > PAGE_SIZE ? posts[PAGE_SIZE].id : null;

    const data: PostsPage = {
      posts: posts.slice(0, PAGE_SIZE),
      nextCursor: nextCursor,
    };

    return Response.json(data, { status: 200 });
  } catch (error) {
    console.error(error);
    return Response.json({ error: "Internal server error" }, { status: 500 });
  }
}
