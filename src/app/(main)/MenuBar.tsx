import { Button } from "@/components/ui/button";
import Link from "next/link";

import { BookmarkIcon, HomeIcon } from "lucide-react";
import NotificationsButton from "./NotificationsButton";
import { validateRequest } from "@/auth";
import { prisma } from "@/lib/prisma";
import MessagesButton from "./MessagesButton";
import streamServerClient from "@/lib/stream";

interface MenuBarProps {
  className?: string;
}

const MenuBar = async ({ className }: MenuBarProps) => {
  const { user } = await validateRequest();

  if (!user) return null;

  const [unreadNotificationCount, { total_unread_count: unreadMessageCount }] =
    await Promise.all([
      prisma.notification.count({
        where: {
          recipientId: user.id,
          read: false,
        },
      }),
      streamServerClient.getUnreadCount(user.id).catch((error) => {
        console.error(error);
        return { total_unread_count: 0 };
      }),
    ]);

  return (
    <div className={className}>
      <Button
        variant="ghost"
        className="justify-start [&_svg]:size-6"
        title="Home"
        asChild
      >
        <Link href="/">
          <HomeIcon />
          <span className="hidden lg:inline">Home</span>
        </Link>
      </Button>
      <NotificationsButton
        initialState={{ unreadCount: unreadNotificationCount }}
      />
      <MessagesButton initialState={{ unreadCount: unreadMessageCount }} />
      <Button
        variant="ghost"
        className="justify-start [&_svg]:size-6"
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
