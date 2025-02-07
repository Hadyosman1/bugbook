import Link from "next/link";
import UserButton from "./UserButton";
import SearchField from "@/components/SearchField";

const Header = () => {
  return (
    <header className="sticky top-0 z-10 bg-card shadow-sm">
      <div className="container flex flex-wrap items-center justify-center gap-x-5 gap-y-3 py-3 md:justify-between">
        <Link
          href="/"
          className="shrink-0 text-center text-2xl font-bold text-primary max-sm:w-full"
        >
          Bugbook
        </Link>

        <SearchField
          placeholder="search..."
          className="max-w-xs transition-[flex] max-sm:w-52 duration-500 has-[input:focus]:grow"
        />

        <UserButton className="shrink-0 sm:ms-auto" />
      </div>
    </header>
  );
};

export default Header;
