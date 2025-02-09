import { Loader2 } from "lucide-react";
import { Button, ButtonProps } from "./button";

interface LoadingButtonProps extends ButtonProps {
  isLoading: boolean;
}

const LoadingButton = ({
  isLoading,
  className,
  children,
  disabled,
  ...props
}: LoadingButtonProps) => {
  return (
    <Button className={className} disabled={isLoading || disabled} {...props}>
      {children} {isLoading && <Loader2 className="h-4 w-4 animate-spin" />}
    </Button>
  );
};

export default LoadingButton;
