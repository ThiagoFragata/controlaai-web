"use client";

import { useState } from "react";
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
} from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { CalendarIcon } from "lucide-react";
import { cn } from "@/lib/utils";

interface FloatingDateDayPickerProps {
  name: string;
  label: string;
  defaultDay?: number | null;
}

export function FloatingDateDayPicker({
  name,
  label,
  defaultDay,
}: FloatingDateDayPickerProps) {
  const [date, setDate] = useState<Date | undefined>(
    defaultDay
      ? new Date(new Date().getFullYear(), new Date().getMonth(), defaultDay)
      : undefined
  );

  const hasValue = Boolean(date);

  return (
    <div className="relative w-full">
      <Popover>
        <PopoverTrigger asChild>
          <button
            type="button"
            className={cn(
              "w-full text-left border border-[#D1D5DB] rounded-lg bg-white text-sm min-h-12 px-3 flex items-center gap-2",
              "focus:border-[#007AFF] focus:ring-0 transition-all duration-200 ease-[cubic-bezier(.32,.72,0,1)]",
              !hasValue && "text-gray-500"
            )}
          >
            <CalendarIcon className="h-4 w-4 text-gray-400" />
            {hasValue ? `Dia ${date?.getDate()}` : ""}
          </button>
        </PopoverTrigger>

        <PopoverContent className="p-0" align="start">
          <Calendar mode="single" selected={date} onSelect={setDate} />
        </PopoverContent>
      </Popover>

      {/* LABEL FLUTUANTE */}
      <label
        className={cn(
          "absolute left-3 bg-white px-1 text-gray-500 pointer-events-none transition-all duration-200",
          hasValue ? "-top-2 text-xs text-[#007AFF]" : "top-3.5 text-sm"
        )}
      >
        {label}
      </label>

      {/* ENVIA APENAS O DIA DO MÊS */}
      <input type="hidden" name={name} value={date ? date.getDate() : ""} />
    </div>
  );
}
