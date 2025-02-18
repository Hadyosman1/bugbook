import { cn } from "@/lib/utils";
import { User } from "lucia";
import Image from "next/image";

interface UserAvatarProps extends Pick<User, "avatarUrl"> {
  className?: string;
  size?: number;
}

const UserAvatar = ({ avatarUrl, className, size }: UserAvatarProps) => {
  return (
    <Image
      src={avatarUrl || "/avatar-placeholder.png"}
      alt={`user avatar`}
      width={size ?? 48}
      height={size ?? 48}
      className={cn(
        "aspect-square rounded-full border border-border/50 object-cover shadow",
        className,
      )}
    />
  );
};

export default UserAvatar;
