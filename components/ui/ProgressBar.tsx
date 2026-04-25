import { cn } from "@/lib/utils/cn";

interface ProgressBarProps {
  percent: number;
  className?: string;
  showLabel?: boolean;
}

export default function ProgressBar({
  percent,
  className,
  showLabel = true,
}: ProgressBarProps) {
  const clamped = Math.max(0, Math.min(100, percent));
  return (
    <div className={cn("w-full", className)}>
      {showLabel && (
        <div className="flex justify-between text-sm text-muted mb-1">
          <span>Progress</span>
          <span>{Math.round(clamped)}%</span>
        </div>
      )}
      <div className="h-2 bg-card-border rounded-full overflow-hidden">
        <div
          className="h-full bg-success rounded-full transition-all duration-500"
          style={{ width: `${clamped}%` }}
        />
      </div>
    </div>
  );
}
