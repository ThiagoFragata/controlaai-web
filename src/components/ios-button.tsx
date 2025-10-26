"use client";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { ButtonHTMLAttributes } from "react";

interface IOSButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "blue" | "gray" | "danger";
}

export function IOSButton({
  children,
  className,
  variant = "blue",
  ...props
}: IOSButtonProps) {
  const variantClasses = {
    blue: "bg-[#007AFF] hover:bg-[#0065d1] text-white",
    gray: "bg-gray-200 hover:bg-gray-300 text-gray-800",
    danger: "bg-red-500 hover:bg-red-600 text-white",
  };

  return (
    <Button
      {...props}
      className={cn(
        "button-ios button-ios-ripple w-full rounded-lg",
        variantClasses[variant],
        className
      )}
    >
      {children}
    </Button>
  );
}
