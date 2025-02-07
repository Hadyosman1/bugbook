import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";
import { User } from "lucia";

interface UserAvatarProps
  extends Pick<User, "avatarUrl" | "username" | "displayName"> {
  className?: string;
}

const UserAvatar = ({
  avatarUrl,
  displayName,
  username,
  className,
}: UserAvatarProps) => {
  return (
    <Avatar className={cn(className)}>
      <AvatarImage src={avatarUrl ?? ""} />
      <AvatarFallback>
        {(displayName?.[0] || username?.[0])?.toUpperCase()}
      </AvatarFallback>
    </Avatar>
  );
};

export default UserAvatar;
