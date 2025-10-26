"use client";

import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { motion } from "framer-motion";
import { useState } from "react";
import { cn } from "@/lib/utils";

export function SegmentedTabs({
  tabs,
  defaultValue,
  onChange,
}: {
  tabs: { label: string; value: string }[];
  defaultValue: string;
  onChange?: (value: string) => void;
}) {
  const [active, setActive] = useState(defaultValue);

  return (
    <Tabs
      value={active}
      onValueChange={(v) => {
        setActive(v);
        onChange?.(v);
      }}
    >
      <TabsList className="relative flex w-max mx-auto p-1 bg-[#E5E7EB] rounded-full">
        {tabs.map((tab) => {
          const isActive = active === tab.value;

          return (
            <TabsTrigger
              key={tab.value}
              value={tab.value}
              className={cn(
                "relative z-10 px-4 py-1.5 text-sm font-medium rounded-full transition-colors",
                !isActive && "text-gray-600"
              )}
            >
              {isActive && (
                <motion.div
                  layoutId="ios-pill"
                  className="absolute inset-0 bg-white shadow-sm rounded-full"
                  transition={{ duration: 0.32, ease: [0.32, 0.72, 0, 1] }}
                />
              )}
              <span className="relative z-20">{tab.label}</span>
            </TabsTrigger>
          );
        })}
      </TabsList>
    </Tabs>
  );
}
