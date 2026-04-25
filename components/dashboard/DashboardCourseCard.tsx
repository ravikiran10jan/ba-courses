import Link from "next/link";
import type { Enrollment } from "@/types";
import Card from "@/components/ui/Card";
import ProgressBar from "@/components/ui/ProgressBar";
import Button from "@/components/ui/Button";
import { getDashboardComponents } from "@/lib/content";

const dc = getDashboardComponents().courseCard;

interface DashboardCourseCardProps {
  enrollment: Enrollment;
}

export default function DashboardCourseCard({
  enrollment,
}: DashboardCourseCardProps) {
  return (
    <Card hover className="flex flex-col p-0 overflow-hidden">
      {/* Thumbnail */}
      {enrollment.courseThumbnail ? (
        <div className="w-full h-44 bg-card-border">
          <img
            src={enrollment.courseThumbnail}
            alt={enrollment.courseTitle}
            className="w-full h-full object-cover"
          />
        </div>
      ) : (
        <div className="w-full h-44 bg-card-border flex items-center justify-center">
          <span className="text-muted-foreground text-sm">{dc.noThumbnail}</span>
        </div>
      )}

      <div className="p-5 flex flex-col flex-1">
        <h3 className="text-base font-bold mb-3 line-clamp-2">
          {enrollment.courseTitle}
        </h3>

        <div className="mt-auto space-y-4">
          <ProgressBar percent={enrollment.progressPercent} />

          <Link href={`/course/${enrollment.courseSlug}/learn`}>
            <Button variant="primary" size="sm" className="w-full rounded-lg">
              {enrollment.isCompleted ? dc.reviewCourse : dc.continueLearning}
            </Button>
          </Link>
        </div>
      </div>
    </Card>
  );
}
