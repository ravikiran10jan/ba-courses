"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useAuth } from "@/hooks/useAuth";
import { collection, query, where, getDocs } from "firebase/firestore";
import { db } from "@/lib/firebase/client";
import type { Enrollment } from "@/types";
import Tabs from "@/components/ui/Tabs";
import Spinner from "@/components/ui/Spinner";
import DashboardCourseCard from "@/components/dashboard/DashboardCourseCard";
import { getDashboard } from "@/lib/content";

const d = getDashboard();

export default function DashboardPage() {
  const { user, loading: authLoading } = useAuth();
  const [enrollments, setEnrollments] = useState<Enrollment[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchEnrollments() {
      if (!user) {
        setLoading(false);
        return;
      }
      try {
        const q = query(
          collection(db, "enrollments"),
          where("userId", "==", user.uid)
        );
        const snap = await getDocs(q);
        const data = snap.docs.map(
          (doc) => ({ id: doc.id, ...doc.data() }) as unknown as Enrollment
        );
        setEnrollments(data);
      } catch (error) {
        console.error("Failed to fetch enrollments:", error);
      } finally {
        setLoading(false);
      }
    }

    if (!authLoading) {
      fetchEnrollments();
    }
  }, [user, authLoading]);

  if (authLoading || loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Spinner size="lg" />
      </div>
    );
  }

  const enrolled = enrollments.filter((e) => !e.isCompleted);
  const completed = enrollments.filter((e) => e.isCompleted);

  const EmptyState = ({ message }: { message: string }) => (
    <div className="text-center py-16">
      <p className="text-muted text-lg mb-6">{message}</p>
      <Link
        href="/"
        className="inline-flex items-center justify-center bg-white text-black font-bold px-6 py-3 rounded hover:bg-gray-200 transition-colors"
      >
        {d.backHome}
      </Link>
    </div>
  );

  const tabs = [
    {
      label: d.enrolledTab,
      content:
        enrolled.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {enrolled.map((enrollment) => (
              <DashboardCourseCard
                key={enrollment.id}
                enrollment={enrollment}
              />
            ))}
          </div>
        ) : (
          <EmptyState message={d.noEnrolled} />
        ),
    },
    {
      label: d.completedTab,
      content:
        completed.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {completed.map((enrollment) => (
              <DashboardCourseCard
                key={enrollment.id}
                enrollment={enrollment}
              />
            ))}
          </div>
        ) : (
          <EmptyState message={d.noCompleted} />
        ),
    },
  ];

  return (
    <div>
      <div className="mb-8">
        <span className="text-xs font-semibold text-accent tracking-wider">
          {d.tagline}
        </span>
        <h1 className="text-3xl font-black mt-2">{d.heading}</h1>
      </div>

      <Tabs tabs={tabs} />
    </div>
  );
}
