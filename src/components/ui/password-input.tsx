"use client";

import { forwardRef, useState } from "react";
import { Input } from "./input";
import { Button } from "./button";
import { EyeIcon, EyeOffIcon } from "lucide-react";
import { cn } from "@/lib/utils";

const PasswordInput = forwardRef<
  HTMLInputElement,
  React.ComponentProps<"input">
>(({ className, ...props }, ref) => {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <div className="relative">
      <Input
        {...props}
        type={showPassword ? "text" : "password"}
        className={cn("pe-10", className)}
        ref={ref}
      />
      <Button
        type="button"
        variant="ghost"
        size="icon"
        className="absolute right-0 top-1/2 h-full -translate-y-1/2 rounded-s-none border shadow-none"
        onClick={() => setShowPassword((prev) => !prev)}
      >
        {showPassword ? <EyeOffIcon /> : <EyeIcon />}
        <span className="sr-only">Toggle password visibility</span>
      </Button>
    </div>
  );
});

PasswordInput.displayName = "PasswordInput";

export default PasswordInput;
