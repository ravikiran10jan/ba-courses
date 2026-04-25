import type { ReactNode } from "react";
import { cn } from "@/lib/utils/cn";

interface CardProps {
  children: ReactNode;
  className?: string;
  hover?: boolean;
}

export default function Card({ children, className, hover = false }: CardProps) {
  return (
    <div
      className={cn(
        "bg-card border border-card-border rounded-lg p-6",
        hover && "transition-all duration-200 hover:border-muted hover:shadow-lg hover:shadow-accent/5",
        className
      )}
    >
      {children}
    </div>
  );
}
