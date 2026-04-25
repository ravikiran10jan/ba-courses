"use client";

import { useState, useEffect, useCallback, use } from "react";
import { useAuth } from "@/hooks/useAuth";
import { collection, query, where, getDocs } from "firebase/firestore";
import { db } from "@/lib/firebase/client";
import VideoPlayer from "@/components/player/VideoPlayer";
import LessonSidebar from "@/components/player/LessonSidebar";
import Button from "@/components/ui/Button";
import Spinner from "@/components/ui/Spinner";
import { CheckCircle, Trophy } from "lucide-react";
import Link from "next/link";
import type { Course, Lesson, Enrollment } from "@/types";
import { getCoursePlayer } from "@/lib/content";

const cp = getCoursePlayer();

export default function CoursePlayerPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = use(params);
  const { user, loading: authLoading } = useAuth();

  const [course, setCourse] = useState<Course | null>(null);
  const [lessons, setLessons] = useState<Lesson[]>([]);
  const [enrollment, setEnrollment] = useState<Enrollment | null>(null);
  const [currentLesson, setCurrentLesson] = useState<Lesson | null>(null);
  const [videoUrl, setVideoUrl] = useState<string | null>(null);
  const [videoLoading, setVideoLoading] = useState(false);
  const [completedLessons, setCompletedLessons] = useState<string[]>([]);
  const [progressPercent, setProgressPercent] = useState(0);
  const [markingComplete, setMarkingComplete] = useState(false);
  const [pageLoading, setPageLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [allCompleted, setAllCompleted] = useState(false);

  // Fetch course by slug
  const fetchCourse = useCallback(async (): Promise<Course | null> => {
    try {
      const res = await fetch("/api/courses");
      if (!res.ok) return null;
      const courses: Course[] = await res.json();
      return courses.find((c) => c.slug === slug) ?? null;
    } catch {
      return null;
    }
  }, [slug]);

  // Fetch lessons by courseId
  const fetchLessons = useCallback(
    async (courseId: string): Promise<Lesson[]> => {
      try {
        const res = await fetch(`/api/lessons?courseId=${courseId}`);
        if (!res.ok) return [];
        return await res.json();
      } catch {
        return [];
      }
    },
    []
  );

  // Fetch enrollment from Firestore client-side
  const fetchEnrollment = useCallback(
    async (
      userId: string,
      courseId: string
    ): Promise<Enrollment | null> => {
      try {
        const q = query(
          collection(db, "enrollments"),
          where("userId", "==", userId),
          where("courseId", "==", courseId)
        );
        const snap = await getDocs(q);
        if (snap.empty) return null;
        const doc = snap.docs[0];
        return { id: doc.id, ...doc.data() } as unknown as Enrollment;
      } catch {
        return null;
      }
    },
    []
  );

  // Fetch signed video URL for a lesson
  const fetchVideoUrl = useCallback(async (lessonId: string) => {
    setVideoLoading(true);
    setVideoUrl(null);
    try {
      const res = await fetch(
        `/api/lessons/video-url?lessonId=${lessonId}`
      );
      if (!res.ok) {
        setVideoLoading(false);
        return;
      }
      const data = await res.json();
      setVideoUrl(data.url);
    } catch {
      // Video URL fetch failed; player will show error state
    } finally {
      setVideoLoading(false);
    }
  }, []);

  // Initialize page data
  useEffect(() => {
    if (authLoading) return;

    async function init() {
      if (!user) {
        setPageLoading(false);
        setError(cp.signInMessage);
        return;
      }

      const courseData = await fetchCourse();
      if (!courseData) {
        setPageLoading(false);
        setError(cp.courseNotFound);
        return;
      }
      setCourse(courseData);

      const [lessonsData, enrollmentData] = await Promise.all([
        fetchLessons(courseData.id),
        fetchEnrollment(user.uid, courseData.id),
      ]);

      if (!enrollmentData) {
        setPageLoading(false);
        setError("not_enrolled");
        return;
      }

      setLessons(lessonsData);
      setEnrollment(enrollmentData);
      setCompletedLessons(enrollmentData.completedLessons || []);
      setProgressPercent(enrollmentData.progressPercent || 0);
      setAllCompleted(enrollmentData.isCompleted || false);

      // Auto-select first uncompleted lesson, or first lesson
      const completed = new Set(enrollmentData.completedLessons || []);
      const firstUncompleted = lessonsData.find(
        (l) => !completed.has(l.id)
      );
      const initialLesson = firstUncompleted || lessonsData[0] || null;

      if (initialLesson) {
        setCurrentLesson(initialLesson);
        fetchVideoUrl(initialLesson.id);
      }

      setPageLoading(false);
    }

    init();
  }, [
    user,
    authLoading,
    fetchCourse,
    fetchLessons,
    fetchEnrollment,
    fetchVideoUrl,
  ]);

  // Handle lesson selection
  const handleSelectLesson = useCallback(
    (lesson: Lesson) => {
      if (lesson.id === currentLesson?.id) return;
      setCurrentLesson(lesson);
      fetchVideoUrl(lesson.id);
    },
    [currentLesson, fetchVideoUrl]
  );

  // Handle mark as complete
  const handleMarkComplete = useCallback(async () => {
    if (!currentLesson || !course || !enrollment) return;
    if (completedLessons.includes(currentLesson.id)) return;

    setMarkingComplete(true);
    try {
      const res = await fetch("/api/progress", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          lessonId: currentLesson.id,
          courseId: course.id,
        }),
      });

      if (!res.ok) {
        setMarkingComplete(false);
        return;
      }

      const data = await res.json();

      // Update local state
      const updatedCompleted = data.completedLessons || [
        ...completedLessons,
        currentLesson.id,
      ];
      setCompletedLessons(updatedCompleted);
      setProgressPercent(data.progressPercent ?? progressPercent);

      if (data.isCompleted) {
        setAllCompleted(true);
      }
    } catch {
      // Silent fail; user can retry
    } finally {
      setMarkingComplete(false);
    }
  }, [currentLesson, course, enrollment, completedLessons, progressPercent]);

  // Handle video ended - auto-advance to next lesson
  const handleVideoEnded = useCallback(() => {
    if (!currentLesson || lessons.length === 0) return;

    const currentIndex = lessons.findIndex(
      (l) => l.id === currentLesson.id
    );
    if (currentIndex < lessons.length - 1) {
      const nextLesson = lessons[currentIndex + 1];
      handleSelectLesson(nextLesson);
    }
  }, [currentLesson, lessons, handleSelectLesson]);

  // Loading state
  if (authLoading || pageLoading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <Spinner size="lg" />
      </div>
    );
  }

  // Not signed in
  if (!user) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
        <p className="text-muted text-lg">
          {cp.signInMessage}
        </p>
        <Link href="/auth/login">
          <Button variant="primary">{cp.signInButton}</Button>
        </Link>
      </div>
    );
  }

  // Not enrolled
  if (error === "not_enrolled") {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
        <p className="text-muted text-lg">
          {cp.notEnrolledMessage}
        </p>
        <Link href={`/course/${slug}`}>
          <Button variant="primary">{cp.viewCourseDetails}</Button>
        </Link>
      </div>
    );
  }

  // Other error
  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
        <p className="text-muted text-lg">{error}</p>
        <Link href="/">
          <Button variant="primary">{cp.backToHome}</Button>
        </Link>
      </div>
    );
  }

  const isCurrentLessonCompleted = currentLesson
    ? completedLessons.includes(currentLesson.id)
    : false;

  return (
    <div className="flex flex-col lg:flex-row gap-6 -mx-4 sm:-mx-6 lg:-mx-8 px-4 sm:px-6 lg:px-8">
      {/* Left column: Video + controls */}
      <div className="flex-1 lg:w-[70%] min-w-0">
        {/* Video player */}
        <VideoPlayer
          videoUrl={videoUrl}
          onEnded={handleVideoEnded}
          loading={videoLoading}
        />

        {/* Lesson info + controls below video */}
        <div className="mt-4 space-y-4">
          {/* Current lesson title */}
          {currentLesson && (
            <h1 className="text-xl font-bold text-white">
              {currentLesson.title}
            </h1>
          )}

          {/* All completed celebration */}
          {allCompleted && (
            <div className="flex items-center gap-3 bg-green-500/10 border border-green-500/30 rounded-lg p-4">
              <Trophy className="w-6 h-6 text-green-500 flex-shrink-0" />
              <div>
                <p className="text-green-400 font-semibold">
                  {cp.congratsMessage}
                </p>
                <Link
                  href="/achievement"
                  className="text-green-500 text-sm underline hover:text-green-400 transition-colors"
                >
                  {cp.viewAchievements}
                </Link>
              </div>
            </div>
          )}

          {/* Mark as complete button */}
          {currentLesson && !isCurrentLessonCompleted && (
            <Button
              variant="primary"
              size="md"
              loading={markingComplete}
              onClick={handleMarkComplete}
              className="gap-2"
            >
              <CheckCircle className="w-4 h-4" />
              {cp.markAsComplete}
            </Button>
          )}

          {/* Already completed indicator */}
          {currentLesson && isCurrentLessonCompleted && (
            <div className="flex items-center gap-2 text-green-500 text-sm">
              <CheckCircle className="w-4 h-4" />
              <span>{cp.lessonCompleted}</span>
            </div>
          )}
        </div>
      </div>

      {/* Right column: Lesson sidebar */}
      <div className="lg:w-[30%] lg:min-w-[280px] lg:max-w-[380px]">
        <div className="lg:sticky lg:top-4 lg:max-h-[calc(100vh-6rem)] lg:flex lg:flex-col">
          <LessonSidebar
            lessons={lessons}
            completedLessons={completedLessons}
            currentLessonId={currentLesson?.id ?? ""}
            onSelectLesson={handleSelectLesson}
            courseTitle={course?.title ?? ""}
            progressPercent={progressPercent}
          />
        </div>
      </div>
    </div>
  );
}
