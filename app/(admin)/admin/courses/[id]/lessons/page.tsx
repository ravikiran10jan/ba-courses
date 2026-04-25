"use client";

import { useEffect, useState, use } from "react";
import { useRouter } from "next/navigation";
import { Plus, Pencil, Trash2, GripVertical, Eye } from "lucide-react";
import Button from "@/components/ui/Button";
import Card from "@/components/ui/Card";
import Spinner from "@/components/ui/Spinner";
import LessonForm from "@/components/admin/LessonForm";
import type { Lesson, Course } from "@/types";
import type { LessonFormData } from "@/lib/utils/validators";
import { getAdmin } from "@/lib/content";

const al = getAdmin().lessons;

export default function ManageLessonsPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id: courseId } = use(params);
  const router = useRouter();
  const [course, setCourse] = useState<Course | null>(null);
  const [lessons, setLessons] = useState<Lesson[]>([]);
  const [loading, setLoading] = useState(true);
  const [formOpen, setFormOpen] = useState(false);
  const [editingLesson, setEditingLesson] = useState<Lesson | null>(null);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetchData();
  }, [courseId]);

  async function fetchData() {
    try {
      const [courseRes, lessonsRes] = await Promise.all([
        fetch(`/api/courses/${courseId}`),
        fetch(`/api/lessons?courseId=${courseId}`),
      ]);

      if (courseRes.ok) {
        setCourse(await courseRes.json());
      } else {
        router.push("/admin/courses");
        return;
      }

      if (lessonsRes.ok) {
        setLessons(await lessonsRes.json());
      }
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setLoading(false);
    }
  }

  async function handleAddLesson(data: LessonFormData) {
    setSaving(true);
    try {
      const res = await fetch("/api/lessons", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...data, courseId }),
      });

      if (res.ok) {
        await fetchData();
      } else {
        const errorData = await res.json();
        alert(errorData.error || al.createFailed);
      }
    } catch (error) {
      console.error("Error creating lesson:", error);
    } finally {
      setSaving(false);
    }
  }

  async function handleUpdateLesson(data: LessonFormData) {
    if (!editingLesson) return;
    setSaving(true);
    try {
      const res = await fetch(`/api/lessons/${editingLesson.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (res.ok) {
        await fetchData();
        setEditingLesson(null);
      } else {
        const errorData = await res.json();
        alert(errorData.error || al.updateFailed);
      }
    } catch (error) {
      console.error("Error updating lesson:", error);
    } finally {
      setSaving(false);
    }
  }

  async function handleDeleteLesson(lessonId: string, title: string) {
    if (!confirm(al.deleteConfirm.replace("{title}", title))) return;

    try {
      const res = await fetch(`/api/lessons/${lessonId}`, {
        method: "DELETE",
      });

      if (res.ok) {
        setLessons((prev) => prev.filter((l) => l.id !== lessonId));
      } else {
        const errorData = await res.json();
        alert(errorData.error || al.deleteFailed);
      }
    } catch (error) {
      console.error("Error deleting lesson:", error);
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Spinner size="lg" />
      </div>
    );
  }

  // Group lessons by week
  const groupedByWeek: Record<number, Lesson[]> = {};
  lessons.forEach((lesson) => {
    const week = lesson.weekNumber || 1;
    if (!groupedByWeek[week]) groupedByWeek[week] = [];
    groupedByWeek[week].push(lesson);
  });

  const sortedWeeks = Object.keys(groupedByWeek)
    .map(Number)
    .sort((a, b) => a - b);

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-white">{al.heading}</h1>
          {course && (
            <p className="text-[#999999] text-sm mt-1">{course.title}</p>
          )}
        </div>
        <Button size="sm" onClick={() => setFormOpen(true)}>
          <Plus size={16} className="mr-2" />
          {al.addLesson}
        </Button>
      </div>

      {sortedWeeks.length === 0 ? (
        <Card className="text-center py-12">
          <p className="text-[#999999] mb-4">{al.empty}</p>
          <Button size="sm" onClick={() => setFormOpen(true)}>
            {al.addFirst}
          </Button>
        </Card>
      ) : (
        <div className="space-y-6">
          {sortedWeeks.map((weekNum) => (
            <div key={weekNum}>
              <h2 className="text-lg font-semibold text-white mb-3">
                Week {weekNum}
              </h2>
              <div className="space-y-2">
                {groupedByWeek[weekNum]
                  .sort((a, b) => a.order - b.order)
                  .map((lesson) => (
                    <Card
                      key={lesson.id}
                      className="flex items-center gap-3 py-3 px-4"
                    >
                      <GripVertical
                        size={16}
                        className="text-[#444444] flex-shrink-0"
                      />

                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <span className="font-medium text-white text-sm truncate">
                            {lesson.title}
                          </span>
                          {lesson.isPreview && (
                            <span className="flex items-center gap-1 text-xs text-[#22c55e] bg-[#22c55e]/10 px-2 py-0.5 rounded-full">
                              <Eye size={10} />
                              Preview
                            </span>
                          )}
                        </div>
                        <div className="flex items-center gap-3 text-xs text-[#666666] mt-0.5">
                          <span>{al.orderPrefix} {lesson.order}</span>
                          {lesson.duration > 0 && (
                            <span>{lesson.duration} {al.minSuffix}</span>
                          )}
                        </div>
                      </div>

                      <div className="flex items-center gap-1 flex-shrink-0">
                        <button
                          onClick={() => {
                            setEditingLesson(lesson);
                            setFormOpen(true);
                          }}
                          className="p-2 rounded-lg text-[#999999] hover:text-white hover:bg-white/5 transition-colors"
                        >
                          <Pencil size={14} />
                        </button>
                        <button
                          onClick={() =>
                            handleDeleteLesson(lesson.id, lesson.title)
                          }
                          className="p-2 rounded-lg text-[#999999] hover:text-red-500 hover:bg-red-500/5 transition-colors"
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </Card>
                  ))}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Add/Edit Lesson Modal */}
      <LessonForm
        isOpen={formOpen}
        onClose={() => {
          setFormOpen(false);
          setEditingLesson(null);
        }}
        onSubmit={editingLesson ? handleUpdateLesson : handleAddLesson}
        initialData={
          editingLesson
            ? {
                title: editingLesson.title,
                weekNumber: editingLesson.weekNumber,
                order: editingLesson.order,
                isPreview: editingLesson.isPreview,
              }
            : undefined
        }
        loading={saving}
      />
    </div>
  );
}
