import { Metadata } from "next";
import Bookmarks from "./Bookmarks";
import TrendsSideBar from "@/components/TrendsSideBar";

export const metadata: Metadata = {
  title: "Bookmarks",
  description: "Bookmarks page",
};

const BookmarksPage = () => {
  return (
    <main className="flex w-full min-w-0 gap-5">
      <div className="w-full min-w-0 space-y-5">
        <div className="rounded-xl bg-card p-5 shadow-sm">
          <h1 className="text-center text-2xl font-bold">Bookmarks</h1>
        </div>
        <Bookmarks />
      </div>
      <TrendsSideBar />
    </main>
  );
};

export default BookmarksPage;
