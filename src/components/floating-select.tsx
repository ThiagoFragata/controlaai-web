"use client";

import { useState } from "react";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";

interface Option {
  label: string;
  icon?: React.ComponentType<{ className?: string }>;
}

interface FloatingSelectProps {
  label: string;
  name: string;
  options: Option[];
  defaultValue?: string | null;
  className?: string;
}

export function FloatingSelect({
  label,
  name,
  options,
  defaultValue,
  className,
}: FloatingSelectProps) {
  const [hasValue, setHasValue] = useState(Boolean(defaultValue));

  return (
    <div className={cn("relative w-full", className)}>
      <Select
        name={name}
        defaultValue={defaultValue || ""}
        onValueChange={() => setHasValue(true)}
      >
        <SelectTrigger
          className={cn(
            "peer w-full border border-[#D1D5DB] rounded-lg bg-white text-sm",
            "min-h-12 px-3",
            "focus:border-[#007AFF] transition-all duration-200 ease-[cubic-bezier(.32,.72,0,1)]"
          )}
        >
          <SelectValue placeholder=" " />
        </SelectTrigger>

        <SelectContent>
          {options.map(({ label, icon: Icon }) => (
            <SelectItem key={label} value={label}>
              <div className="flex items-center gap-2">
                {Icon && <Icon className="h-4 w-4 text-gray-600" />}
                {label}
              </div>
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      <label
        className={cn(
          "absolute left-3 bg-white px-1 text-gray-500 pointer-events-none transition-all duration-200",
          hasValue ? "-top-2 text-xs text-[#007AFF]" : "top-3.5 text-sm"
        )}
      >
        {label}
      </label>
    </div>
  );
}
