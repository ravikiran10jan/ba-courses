"use client";

import { CheckCircle2, Circle, Play } from "lucide-react";
import { formatDuration } from "@/lib/utils/format";
import { cn } from "@/lib/utils/cn";
import type { Lesson } from "@/types";

interface LessonItemProps {
  lesson: Lesson;
  isCompleted: boolean;
  isActive: boolean;
  onClick: () => void;
}

export default function LessonItem({
  lesson,
  isCompleted,
  isActive,
  onClick,
}: LessonItemProps) {
  return (
    <button
      onClick={onClick}
      className={cn(
        "w-full flex items-center gap-3 px-4 py-3 text-left transition-all duration-150 border-l-2 group",
        isActive
          ? "bg-white/10 border-l-accent"
          : "border-l-transparent hover:bg-white/5 hover:border-l-white/30"
      )}
    >
      {/* Completion / Play icon */}
      <div className="flex-shrink-0">
        {isCompleted ? (
          <CheckCircle2 className="w-5 h-5 text-green-500" />
        ) : isActive ? (
          <Play className="w-5 h-5 text-accent fill-accent" />
        ) : (
          <Circle className="w-5 h-5 text-muted" />
        )}
      </div>

      {/* Title */}
      <span
        className={cn(
          "flex-1 text-sm truncate",
          isActive ? "text-white font-medium" : "text-gray-300 group-hover:text-white"
        )}
      >
        {lesson.title}
      </span>

      {/* Duration */}
      <span className="flex-shrink-0 text-xs text-muted tabular-nums">
        {formatDuration(lesson.duration)}
      </span>
    </button>
  );
}
