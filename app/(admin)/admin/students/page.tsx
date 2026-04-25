"use client";

import { useEffect, useState } from "react";
import DataTable from "@/components/admin/DataTable";
import Spinner from "@/components/ui/Spinner";
import { getAdmin } from "@/lib/content";

const stu = getAdmin().students;

interface StudentRow {
  id: string;
  name: string;
  email: string;
  enrolledCourses: number;
  joinDate: string;
  [key: string]: unknown;
}

export default function AdminStudentsPage() {
  const [students, setStudents] = useState<StudentRow[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStudents();
  }, []);

  async function fetchStudents() {
    try {
      // Fetch users and their enrollment counts
      const res = await fetch("/api/courses"); // We use courses endpoint as a proxy to verify API works
      // For a real implementation, we'd have a dedicated admin endpoint
      // For now, populate with data from Firestore via a dedicated fetch
      // This will be populated when the admin users endpoint is added

      if (res.ok) {
        // Placeholder: in production, fetch from /api/admin/students
        setStudents([]);
      }
    } catch (error) {
      console.error("Error fetching students:", error);
    } finally {
      setLoading(false);
    }
  }

  const columns = [
    { key: "name", label: stu.nameColumn },
    { key: "email", label: stu.emailColumn },
    {
      key: "enrolledCourses",
      label: stu.enrolledCoursesColumn,
      render: (item: StudentRow) => (
        <span className="text-[#FF1493] font-semibold">
          {item.enrolledCourses}
        </span>
      ),
    },
    {
      key: "joinDate",
      label: stu.joinedColumn,
      render: (item: StudentRow) => (
        <span className="text-[#999999] text-sm">{item.joinDate}</span>
      ),
    },
  ];

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Spinner size="lg" />
      </div>
    );
  }

  return (
    <div>
      <h1 className="text-2xl font-bold text-white mb-8">{stu.heading}</h1>
      <DataTable
        columns={columns}
        data={students}
        searchable
        searchPlaceholder={stu.searchPlaceholder}
      />
    </div>
  );
}
