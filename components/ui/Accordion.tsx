"use client";

import { useState, type ReactNode } from "react";
import { ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils/cn";

interface AccordionItemProps {
  title: string;
  children: ReactNode;
  defaultOpen?: boolean;
}

export function AccordionItem({
  title,
  children,
  defaultOpen = false,
}: AccordionItemProps) {
  const [isOpen, setIsOpen] = useState(defaultOpen);

  return (
    <div className="border border-card-border rounded-lg overflow-hidden">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between p-4 text-left hover:bg-white/5 transition-colors"
      >
        <span className="font-semibold pr-4">{title}</span>
        <ChevronDown
          size={20}
          className={cn(
            "shrink-0 text-muted transition-transform duration-200",
            isOpen && "rotate-180"
          )}
        />
      </button>
      <div
        className={cn(
          "grid transition-all duration-200",
          isOpen ? "grid-rows-[1fr]" : "grid-rows-[0fr]"
        )}
      >
        <div className="overflow-hidden">
          <div className="px-4 pb-4 text-muted">{children}</div>
        </div>
      </div>
    </div>
  );
}

interface AccordionProps {
  items: { title: string; content: string | ReactNode }[];
  className?: string;
}

export default function Accordion({ items, className }: AccordionProps) {
  return (
    <div className={cn("space-y-3", className)}>
      {items.map((item, i) => (
        <AccordionItem key={i} title={item.title}>
          {typeof item.content === "string" ? (
            <p>{item.content}</p>
          ) : (
            item.content
          )}
        </AccordionItem>
      ))}
    </div>
  );
}
