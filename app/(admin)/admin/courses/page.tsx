"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Plus, Pencil, Trash2 } from "lucide-react";
import Button from "@/components/ui/Button";
import Card from "@/components/ui/Card";
import type { Course } from "@/types";
import { getAdmin } from "@/lib/content";

const ac = getAdmin().courses;

export default function AdminCoursesPage() {
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchCourses();
  }, []);

  async function fetchCourses() {
    try {
      const res = await fetch("/api/courses");
      if (res.ok) {
        setCourses(await res.json());
      }
    } catch (error) {
      console.error("Error fetching courses:", error);
    } finally {
      setLoading(false);
    }
  }

  async function handleDelete(courseId: string, title: string) {
    if (!confirm(ac.deleteConfirm.replace("{title}", title))) {
      return;
    }

    try {
      const res = await fetch(`/api/courses/${courseId}`, {
        method: "DELETE",
      });
      if (res.ok) {
        setCourses((prev) => prev.filter((c) => c.id !== courseId));
      } else {
        const data = await res.json();
        alert(data.error || ac.deleteFailed);
      }
    } catch (error) {
      console.error("Error deleting course:", error);
      alert(ac.deleteFailed);
    }
  }

  async function handleTogglePublish(courseId: string, currentStatus: boolean) {
    try {
      const course = courses.find((c) => c.id === courseId);
      if (!course) return;

      const res = await fetch(`/api/courses/${courseId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: course.title,
          slug: course.slug,
          description: course.description,
          shortDescription: course.shortDescription,
          category: course.category,
          price: course.price,
          originalPrice: course.originalPrice,
          duration: course.duration,
          isPublished: !currentStatus,
        }),
      });

      if (res.ok) {
        setCourses((prev) =>
          prev.map((c) =>
            c.id === courseId ? { ...c, isPublished: !currentStatus } : c
          )
        );
      }
    } catch (error) {
      console.error("Error toggling publish:", error);
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-8 w-8 border-2 border-white/20 border-t-white" />
      </div>
    );
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-2xl font-bold text-white">{ac.heading}</h1>
        <Link href="/admin/courses/new">
          <Button size="sm">
            <Plus size={16} className="mr-2" />
            {ac.addNew}
          </Button>
        </Link>
      </div>

      {courses.length === 0 ? (
        <Card className="text-center py-12">
          <p className="text-[#999999] mb-4">{ac.empty}</p>
          <Link href="/admin/courses/new">
            <Button size="sm">{ac.createFirst}</Button>
          </Link>
        </Card>
      ) : (
        <div className="grid gap-4">
          {courses.map((course) => (
            <Card key={course.id} className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
              {/* Thumbnail */}
              <div className="relative w-full sm:w-24 h-32 sm:h-16 rounded-lg overflow-hidden bg-[#222222] flex-shrink-0">
                {course.thumbnailUrl ? (
                  <Image
                    src={course.thumbnailUrl}
                    alt={course.title}
                    fill
                    className="object-cover"
                  />
                ) : (
                  <div className="flex items-center justify-center h-full text-[#666666] text-xs">
                    {ac.noImage}
                  </div>
                )}
              </div>

              {/* Info */}
              <div className="flex-1 min-w-0">
                <h3 className="font-semibold text-white truncate">
                  {course.title}
                </h3>
                <div className="flex flex-wrap items-center gap-3 mt-1 text-xs text-[#999999]">
                  <span className="text-[#FF1493] font-semibold">
                    {"< "}
                    {course.category}
                    {" />"}
                  </span>
                  <span>₹{course.price.toLocaleString()}</span>
                  <span>{course.enrolledCount || 0} enrolled</span>
                </div>
              </div>

              {/* Actions */}
              <div className="flex items-center gap-2 flex-shrink-0">
                <button
                  onClick={() =>
                    handleTogglePublish(course.id, course.isPublished)
                  }
                  className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                    course.isPublished ? "bg-[#22c55e]" : "bg-[#444444]"
                  }`}
                  title={course.isPublished ? ac.published : ac.unpublished}
                >
                  <span
                    className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                      course.isPublished ? "translate-x-6" : "translate-x-1"
                    }`}
                  />
                </button>

                <Link href={`/admin/courses/${course.id}`}>
                  <button className="p-2 rounded-lg text-[#999999] hover:text-white hover:bg-white/5 transition-colors">
                    <Pencil size={16} />
                  </button>
                </Link>

                <Link href={`/admin/courses/${course.id}/lessons`}>
                  <button
                    className="px-3 py-1.5 rounded-lg text-xs font-medium border border-[#444444] text-[#999999] hover:text-white hover:border-[#666666] transition-colors"
                  >
                    {ac.lessonsButton}
                  </button>
                </Link>

                <button
                  onClick={() => handleDelete(course.id, course.title)}
                  className="p-2 rounded-lg text-[#999999] hover:text-red-500 hover:bg-red-500/5 transition-colors"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
