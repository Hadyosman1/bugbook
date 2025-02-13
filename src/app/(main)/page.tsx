import PostEditor from "@/components/posts/editor/PostEditor";
import TrendsSideBar from "@/components/TrendsSideBar";
import ForYouFeed from "./ForYouFeed";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { TabsContent } from "@radix-ui/react-tabs";
import FollowingFeed from "./FollowingFeed";

export default function Home() {
  return (
    <>
      <main className="grow space-y-5">
        <PostEditor />
        <Tabs defaultValue="for-you">
          <TabsList className="mb-3 w-full bg-card">
            <TabsTrigger value="for-you" className="grow">
              For you
            </TabsTrigger>
            <TabsTrigger value="following" className="grow">
              Following
            </TabsTrigger>
          </TabsList>
          <TabsContent value="for-you">
            <ForYouFeed />
          </TabsContent>
          <TabsContent value="following">
            <FollowingFeed />
          </TabsContent>
        </Tabs>
      </main>
      <TrendsSideBar />
    </>
  );
}
