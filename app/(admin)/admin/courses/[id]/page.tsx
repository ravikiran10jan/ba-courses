"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState, use } from "react";
import CourseForm from "@/components/admin/CourseForm";
import Spinner from "@/components/ui/Spinner";
import type { CourseFormData } from "@/lib/utils/validators";
import type { Course } from "@/types";
import { getAdminPages } from "@/lib/content";

const ec = getAdminPages().editCourse;

export default function EditCoursePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const router = useRouter();
  const [course, setCourse] = useState<Course | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    async function fetchCourse() {
      try {
        const res = await fetch(`/api/courses/${id}`);
        if (res.ok) {
          setCourse(await res.json());
        } else {
          alert(ec.notFound);
          router.push("/admin/courses");
        }
      } catch (error) {
        console.error("Error fetching course:", error);
      } finally {
        setLoading(false);
      }
    }
    fetchCourse();
  }, [id, router]);

  async function handleSubmit(data: CourseFormData & { language?: string; tooling?: string }) {
    setSaving(true);
    try {
      const res = await fetch(`/api/courses/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...data,
          thumbnailUrl: course?.thumbnailUrl,
          previewVideoUrl: course?.previewVideoUrl,
        }),
      });

      if (res.ok) {
        router.push("/admin/courses");
      } else {
        const errorData = await res.json();
        alert(errorData.error || ec.updateFailed);
      }
    } catch (error) {
      console.error("Error updating course:", error);
      alert(ec.updateFailed);
    } finally {
      setSaving(false);
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Spinner size="lg" />
      </div>
    );
  }

  if (!course) {
    return (
      <div className="text-center py-12 text-[#999999]">{ec.notFound}</div>
    );
  }

  return (
    <div>
      <h1 className="text-2xl font-bold text-white mb-8">{ec.heading}</h1>
      <CourseForm
        initialData={{
          title: course.title,
          slug: course.slug,
          description: course.description,
          shortDescription: course.shortDescription,
          category: course.category,
          price: course.price,
          originalPrice: course.originalPrice,
          duration: course.duration,
          isPublished: course.isPublished,
          language: course.language,
          tooling: course.tooling,
          thumbnailUrl: course.thumbnailUrl,
        }}
        onSubmit={handleSubmit}
        loading={saving}
      />
    </div>
  );
}
