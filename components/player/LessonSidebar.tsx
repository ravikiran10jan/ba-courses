"use client";

import { useMemo } from "react";
import ProgressBar from "@/components/ui/ProgressBar";
import LessonItem from "@/components/player/LessonItem";
import type { Lesson } from "@/types";
import { getPlayerComponents } from "@/lib/content";

const ls = getPlayerComponents().lessonSidebar;

interface LessonSidebarProps {
  lessons: Lesson[];
  completedLessons: string[];
  currentLessonId: string;
  onSelectLesson: (lesson: Lesson) => void;
  courseTitle: string;
  progressPercent: number;
}

export default function LessonSidebar({
  lessons,
  completedLessons,
  currentLessonId,
  onSelectLesson,
  courseTitle,
  progressPercent,
}: LessonSidebarProps) {
  // Group lessons by weekNumber
  const weekGroups = useMemo(() => {
    const groups: Record<number, Lesson[]> = {};
    for (const lesson of lessons) {
      const week = lesson.weekNumber;
      if (!groups[week]) {
        groups[week] = [];
      }
      groups[week].push(lesson);
    }
    // Sort by weekNumber and lessons by order within each week
    return Object.entries(groups)
      .sort(([a], [b]) => Number(a) - Number(b))
      .map(([weekNumber, weekLessons]) => ({
        weekNumber: Number(weekNumber),
        lessons: weekLessons.sort((a, b) => a.order - b.order),
      }));
  }, [lessons]);

  return (
    <div className="flex flex-col h-full bg-card border border-card-border rounded-lg overflow-hidden">
      {/* Header */}
      <div className="p-4 border-b border-card-border">
        <h2 className="text-sm font-bold text-white truncate mb-3">
          {courseTitle}
        </h2>
        <ProgressBar percent={progressPercent} />
        <p className="text-xs text-muted mt-2">
          {ls.lessonsCompleted.replace("{n}", String(completedLessons.length)).replace("{m}", String(lessons.length))}
        </p>
      </div>

      {/* Lesson list */}
      <div className="flex-1 overflow-y-auto">
        {weekGroups.map(({ weekNumber, lessons: weekLessons }) => (
          <div key={weekNumber}>
            {/* Week header */}
            <div className="px-4 py-2 bg-white/5 border-b border-card-border">
              <span className="text-xs font-semibold text-muted tracking-wider uppercase">
                {ls.weekPrefix} {weekNumber}
              </span>
            </div>

            {/* Lessons in this week */}
            {weekLessons.map((lesson) => (
              <LessonItem
                key={lesson.id}
                lesson={lesson}
                isCompleted={completedLessons.includes(lesson.id)}
                isActive={lesson.id === currentLessonId}
                onClick={() => onSelectLesson(lesson)}
              />
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}
