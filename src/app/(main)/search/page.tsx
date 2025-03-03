import TrendsSideBar from "@/components/TrendsSideBar";
import { Metadata } from "next";
import SearchResults from "./SearchResults";

interface SearchPageProps {
  searchParams: Promise<{ q: string }>;
}

export async function generateMetadata({
  searchParams,
}: SearchPageProps): Promise<Metadata> {
  const { q } = await searchParams;

  return {
    title: `Search results for "${decodeURIComponent(q)}"`,
  };
}

const SearchPage = async ({ searchParams }: SearchPageProps) => {
  const { q } = await searchParams;

  return (
    <main className="flex w-full min-w-0 gap-5">
      <div className="w-full min-w-0 space-y-5">
        <div className="rounded-xl bg-card p-5 shadow-sm">
          <h1 className="line-clamp-2 break-all text-center text-2xl font-bold">
            Search results for {`"${decodeURIComponent(q)}"`}
          </h1>
        </div>
        <SearchResults query={q} />
      </div>
      <TrendsSideBar />
    </main>
  );
};

export default SearchPage;
