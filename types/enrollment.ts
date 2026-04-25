export interface Enrollment {
  id: string;
  userId: string;
  courseId: string;
  courseTitle: string;
  courseThumbnail: string;
  courseSlug: string;
  completedLessons: string[];
  totalLessons: number;
  progressPercent: number;
  isCompleted: boolean;
  completedAt: Date | null;
  enrolledAt: Date;
}
