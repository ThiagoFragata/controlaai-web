"use client";

import { useState } from "react";
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
} from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { cn } from "@/lib/utils";
import { CalendarIcon } from "lucide-react";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";

interface FloatingDatePickerProps {
  label: string;
  name: string;
  defaultValue?: string | null; // ISO date (yyyy-mm-dd)
}

export function FloatingDatePicker({
  label,
  name,
  defaultValue,
}: FloatingDatePickerProps) {
  const [date, setDate] = useState<Date | undefined>(
    defaultValue ? new Date(defaultValue) : undefined
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
            {hasValue ? format(date!, "dd/MM/yyyy", { locale: ptBR }) : ""}
          </button>
        </PopoverTrigger>

        <PopoverContent className="p-0" align="start">
          <Calendar
            mode="single"
            selected={date}
            onSelect={setDate}
            locale={ptBR}
          />
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

      {/* O valor enviado para o form deve ser ISO (yyyy-mm-dd) */}
      <input
        type="hidden"
        name={name}
        value={date ? format(date, "yyyy-MM-dd") : ""}
      />
    </div>
  );
}
