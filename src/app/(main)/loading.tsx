import { Loader } from "lucide-react";

const Loading = () => {
  return (
    <div className="flex min-h-[80svh] grow items-center justify-center">
      <Loader className="my-6 size-12 animate-spin" />
    </div>
  );
};

export default Loading;
