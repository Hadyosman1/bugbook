import { Button } from "@/components/ui/button";
import Link from "next/link";

import { BellIcon, BookmarkIcon, HomeIcon, MessageSquare } from "lucide-react";

interface MenuBarProps {
  className?: string;
}

const MenuBar = ({ className }: MenuBarProps) => {
  return (
    <div className={className}>
      <Button variant="ghost" className="justify-start" title="Home" asChild>
        <Link href="/">
          <HomeIcon />
          <span className="hidden lg:inline">Home</span>
        </Link>
      </Button>
      <Button
        variant="ghost"
        className="justify-start"
        title="Notifications"
        asChild
      >
        <Link href="/notifications">
          <BellIcon />
          <span className="hidden lg:inline">Notifications</span>
        </Link>
      </Button>
      <Button
        variant="ghost"
        className="justify-start"
        title="Messages"
        asChild
      >
        <Link href="/messages">
          <MessageSquare />
          <span className="hidden lg:inline">Messages</span>
        </Link>
      </Button>
      <Button
        variant="ghost"
        className="justify-start"
        title="Bookmarks"
        asChild
      >
        <Link href="/bookmarks">
          <BookmarkIcon />
          <span className="hidden lg:inline">Bookmarks</span>
        </Link>
      </Button>
    </div>
  );
};

export default MenuBar;
