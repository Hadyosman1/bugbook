import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { MenuIcon } from "lucide-react";
import {
  Channel,
  ChannelHeader,
  ChannelHeaderProps,
  MessageInput,
  MessageList,
  Window,
} from "stream-chat-react";

interface ChatChannelProps {
  open: boolean;
  openSidebar: () => void;
}

const ChatChannel = ({ open, openSidebar }: ChatChannelProps) => {
  return (
    <div
      className={cn(
        "w-full animate-in slide-in-from-left-5 md:block",
        !open && "hidden",
      )}
    >
      <Channel>
        <Window>
          <CustomChannelHeader openSidebar={openSidebar} />
          <MessageList />
          <MessageInput />
        </Window>
      </Channel>
    </div>
  );
};

export default ChatChannel;

interface CustomChannelHeaderProps extends ChannelHeaderProps {
  openSidebar: () => void;
}

const CustomChannelHeader = ({
  openSidebar,
  ...props
}: CustomChannelHeaderProps) => {
  return (
    <div className="flex items-center gap-3">
      <div className="h-full p-2 md:hidden">
        <Button
          size="icon"
          variant="ghost"
          onClick={openSidebar}
          title="Open sidebar"
        >
          <MenuIcon className="size-5" />
        </Button>
      </div>
      <ChannelHeader {...props} />
    </div>
  );
};
