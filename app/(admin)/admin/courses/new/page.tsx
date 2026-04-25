"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import CourseForm from "@/components/admin/CourseForm";
import type { CourseFormData } from "@/lib/utils/validators";
import { getAdminPages } from "@/lib/content";

const ap = getAdminPages().newCourse;

export default function NewCoursePage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  async function handleSubmit(data: CourseFormData & { language?: string; tooling?: string }) {
    setLoading(true);
    try {
      const res = await fetch("/api/courses", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (res.ok) {
        router.push("/admin/courses");
      } else {
        const errorData = await res.json();
        alert(errorData.error || ap.createFailed);
      }
    } catch (error) {
      console.error("Error creating course:", error);
      alert(ap.createFailed);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div>
      <h1 className="text-2xl font-bold text-white mb-8">{ap.heading}</h1>
      <CourseForm onSubmit={handleSubmit} loading={loading} />
    </div>
  );
}
