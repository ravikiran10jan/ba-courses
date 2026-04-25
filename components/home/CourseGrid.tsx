"use client";

import { useEffect, useState } from "react";
import CourseCard from "@/components/home/CourseCard";
import Spinner from "@/components/ui/Spinner";
import { getCourseGrid, getFeaturedCourse } from "@/lib/content";
import type { Course } from "@/types";

const gridContent = getCourseGrid();
const featuredCourse = getFeaturedCourse();

export default function CourseGrid() {
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchCourses() {
      try {
        const res = await fetch("/api/courses");
        if (res.ok) {
          const data = await res.json();
          if (Array.isArray(data) && data.length > 0) {
            setCourses(data);
            return;
          }
        }
      } catch {
        // API not available, use featured course
      } finally {
        setLoading(false);
      }
    }
    fetchCourses();
  }, []);

  const displayCourses = courses.length > 0 ? courses : [];

  return (
    <section id="live-courses" className="py-16 sm:py-20 bg-background">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-white text-center mb-4">
          {gridContent.heading}
        </h2>
        <p className="text-muted text-center mb-12 max-w-2xl mx-auto">
          {gridContent.subheading}
        </p>

        {loading ? (
          <div className="flex justify-center py-12">
            <Spinner size="lg" />
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 justify-items-center">
            {displayCourses.length > 0 ? (
              displayCourses.map((course) => (
                <CourseCard
                  key={course.id}
                  title={course.title}
                  slug={course.slug}
                  category={course.category}
                  price={course.price}
                  originalPrice={course.originalPrice}
                  enrolledCount={course.enrolledCount}
                  duration={course.duration}
                  thumbnailUrl={course.thumbnailUrl}
                />
              ))
            ) : (
              <div className="sm:col-span-2 lg:col-span-3 flex justify-center">
                <div className="w-full max-w-md">
                  <CourseCard
                    title={featuredCourse.title}
                    slug={featuredCourse.slug}
                    category={featuredCourse.category}
                    price={featuredCourse.price}
                    originalPrice={featuredCourse.originalPrice}
                    enrolledCount={featuredCourse.enrolledCount}
                    duration={featuredCourse.duration}
                    thumbnailUrl={featuredCourse.thumbnailUrl}
                  />
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </section>
  );
}
