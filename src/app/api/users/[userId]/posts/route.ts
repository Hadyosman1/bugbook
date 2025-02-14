import { validateRequest } from "@/auth";
import { prisma } from "@/lib/prisma";
import { getPostDataInclude, PostsPage } from "@/lib/types";
import { NextRequest } from "next/server";

interface RequestParams {
  params: Promise<{
    userId: string;
  }>;
}

export async function GET(req: NextRequest, { params }: RequestParams) {
  try {
    const userId = (await params).userId;

    const cursor = req.nextUrl.searchParams.get("cursor") || undefined;

    const PAGE_SIZE = 10;

    const { user } = await validateRequest();

    if (!user) return Response.json({ error: "Unauthorized" }, { status: 401 });

    const posts = await prisma.post.findMany({
      where: { userId },
      include: getPostDataInclude(user.id),
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
