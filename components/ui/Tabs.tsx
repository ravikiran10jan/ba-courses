"use client";

import { useState, type ReactNode } from "react";
import { cn } from "@/lib/utils/cn";

interface Tab {
  label: string;
  content: ReactNode;
}

interface TabsProps {
  tabs: Tab[];
  className?: string;
}

export default function Tabs({ tabs, className }: TabsProps) {
  const [active, setActive] = useState(0);

  return (
    <div className={className}>
      <div className="flex gap-1 border-b border-card-border mb-6">
        {tabs.map((tab, i) => (
          <button
            key={i}
            onClick={() => setActive(i)}
            className={cn(
              "px-6 py-3 font-semibold transition-colors relative",
              active === i
                ? "text-white"
                : "text-muted-foreground hover:text-white"
            )}
          >
            {tab.label}
            {active === i && (
              <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-white" />
            )}
          </button>
        ))}
      </div>
      <div>{tabs[active]?.content}</div>
    </div>
  );
}
