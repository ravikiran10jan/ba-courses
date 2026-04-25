"use client";

import { useCountdown } from "@/hooks/useCountdown";
import { cn } from "@/lib/utils/cn";

interface CountdownTimerProps {
  minutes?: number;
  className?: string;
  label?: string;
}

export default function CountdownTimer({
  minutes = 10,
  className,
  label = "Offer Ending in",
}: CountdownTimerProps) {
  const { display } = useCountdown(minutes);

  return (
    <span className={cn("font-bold", className)}>
      {label} {display} Minutes
    </span>
  );
}
