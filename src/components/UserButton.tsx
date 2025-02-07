"use client";

import { logout } from "@/app/(auth)/actions";
import { useSession } from "@/app/(main)/SessionProvider";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";
import {
  CheckIcon,
  LogOutIcon,
  MonitorIcon,
  MoonIcon,
  SunIcon,
  UserIcon,
} from "lucide-react";
import { useTheme } from "next-themes";
import Link from "next/link";
import UserAvatar from "./UserAvatar";

interface UserButtonProps {
  className?: string;
}

const UserButton = ({ className }: UserButtonProps) => {
  const { user } = useSession();

  const { setTheme, resolvedTheme, theme: currentTheme } = useTheme();

  const themesMap = {
    light: { Icon: SunIcon, label: "light" },
    dark: { Icon: MoonIcon, label: "dark" },
    system: { Icon: MonitorIcon, label: "system" },
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button className={cn("rounded-full", className)}>
          <UserAvatar
            username={user.username}
            displayName={user.displayName}
            avatarUrl={user.avatarUrl}
          />
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        <DropdownMenuLabel>Logged in as @{user.username}</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <Link href={`users/${user.username}`}>
          <DropdownMenuItem className="cursor-pointer">
            <UserIcon /> Profile
          </DropdownMenuItem>
        </Link>
        <DropdownMenuSeparator />
        <DropdownMenuSub>
          <DropdownMenuSubTrigger>
            <MonitorIcon />
            Theme
          </DropdownMenuSubTrigger>
          <DropdownMenuSubContent>
            {Object.entries(themesMap).map(([theme, { Icon, label }]) => (
              <DropdownMenuItem
                key={theme}
                className="cursor-pointer"
                onClick={() => setTheme(theme)}
              >
                <Icon />
                {label}
                {(currentTheme || resolvedTheme) === theme && (
                  <CheckIcon className="ms-auto size-4" />
                )}
              </DropdownMenuItem>
            ))}
          </DropdownMenuSubContent>
        </DropdownMenuSub>

        <DropdownMenuItem
          onClick={() => {
            logout();
          }}
          className="cursor-pointer"
        >
          <LogOutIcon />
          Logout
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default UserButton;
