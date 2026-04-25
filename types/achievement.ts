export type AchievementType = "course_completion" | "certificate";

export interface Achievement {
  id: string;
  userId: string;
  courseId: string;
  courseTitle: string;
  type: AchievementType;
  certificateUrl: string;
  earnedAt: Date;
}
