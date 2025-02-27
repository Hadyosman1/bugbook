import { Button } from "@/components/ui/button";
import Link from "next/link";

import { BookmarkIcon, HomeIcon, MessageSquare } from "lucide-react";
import NotificationsButton from "./NotificationsButton";
import { validateRequest } from "@/auth";
import { prisma } from "@/lib/prisma";

interface MenuBarProps {
  className?: string;
}

const MenuBar = async ({ className }: MenuBarProps) => {
  const { user } = await validateRequest();

  if (!user) return null;

  const unreadNotificationCount = await prisma.notification.count({
    where: {
      recipientId: user.id,
      read: false,
    },
  });

  return (
    <div className={className}>
      <Button variant="ghost" className="justify-start [&_svg]:size-6" title="Home" asChild>
        <Link href="/">
          <HomeIcon  />
          <span className="hidden lg:inline">Home</span>
        </Link>
      </Button>
      <NotificationsButton
        initialState={{ unreadCount: unreadNotificationCount }}
      />
      <Button
        variant="ghost"
        className="justify-start [&_svg]:size-6"
        title="Messages"
        asChild
      >
        <Link href="/messages">
          <MessageSquare  />
          <span className="hidden lg:inline">Messages</span>
        </Link>
      </Button>
      <Button
        variant="ghost"
        className="justify-start [&_svg]:size-6"
        title="Bookmarks"
        asChild
      >
        <Link href="/bookmarks">
          <BookmarkIcon  />
          <span className="hidden lg:inline">Bookmarks</span>
        </Link>
      </Button>
    </div>
  );
};

export default MenuBar;
