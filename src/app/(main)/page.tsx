import PostEditor from "@/components/posts/editor/PostEditor";
import TrendsSideBar from "@/components/TrendsSideBar";
import ForYouFeed from "./ForYouFeed";

export default function Home() {
  return (
    <>
      <main className="grow space-y-5">
        <PostEditor />
        <ForYouFeed />
      </main>
      <TrendsSideBar />
    </>
  );
}
