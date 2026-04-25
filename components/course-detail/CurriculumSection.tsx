import Accordion from "@/components/ui/Accordion";
import { getCourseDetail } from "@/lib/content";
import type { Week } from "@/types";

const cd = getCourseDetail();

interface CurriculumSectionProps {
  weeks: Week[];
}

export default function CurriculumSection({ weeks }: CurriculumSectionProps) {
  const items = weeks.map((week) => ({
    title: `${cd.weekPrefix} ${week.weekNumber}: ${week.title}`,
    content: (
      <ul className="space-y-2">
        {week.lessons.map((lesson, i) => (
          <li key={lesson.id || i} className="flex items-start gap-2 text-sm">
            <span className="text-accent font-semibold shrink-0">
              {String(i + 1).padStart(2, "0")}.
            </span>
            <span>{lesson.title}</span>
          </li>
        ))}
      </ul>
    ),
  }));

  return (
    <section className="py-16 sm:py-20 bg-card">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <h2 className="text-2xl sm:text-3xl font-bold text-white text-center mb-10">
          {cd.curriculumHeading}
        </h2>

        <div className="max-w-3xl mx-auto">
          <Accordion items={items} />
        </div>
      </div>
    </section>
  );
}
