"use client";

import { useId, useState } from "react";
import { Input } from "@/components/ui/input";
import { SearchIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { useRouter } from "next/navigation";

interface SearchFieldProps extends React.InputHTMLAttributes<HTMLInputElement> {
  className?: string;
}

const SearchField = ({ className, ...props }: SearchFieldProps) => {
  const [search, setSearch] = useState("");

  const router = useRouter();

  const id = useId();

  const handleFormSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.target as HTMLFormElement);
    const search = formData.get("q")?.toString().trim();
    if (search) router.push(`/search?q=${encodeURIComponent(search)}`);
  };

  return (
    <form
      className={cn("relative", className)}
      onSubmit={handleFormSubmit}
      action="/search"
    >
      <Input
        {...props}
        id={id}
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="pe-8"
        name="q"
      />
      <label
        htmlFor={id}
        className="absolute right-0 top-0 flex h-full items-center rounded px-1.5 text-muted-foreground"
      >
        <span className="sr-only">Search</span>
        <SearchIcon className="size-5" />
      </label>
    </form>
  );
};

export default SearchField;
