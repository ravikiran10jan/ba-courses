import { adminDb } from "@/lib/firebase/admin";
import { Users, BookOpen, CreditCard, GraduationCap } from "lucide-react";
import StatCard from "@/components/admin/StatCard";
import { getAdmin } from "@/lib/content";

const adm = getAdmin().dashboard;

export const dynamic = "force-dynamic";

async function getStats() {
  try {
    const [usersSnap, coursesSnap, paymentsSnap, enrollmentsSnap] =
      await Promise.all([
        adminDb.collection("users").count().get(),
        adminDb.collection("courses").count().get(),
        adminDb
          .collection("payments")
          .where("status", "==", "COMPLETED")
          .get(),
        adminDb.collection("enrollments").count().get(),
      ]);

    const totalRevenue = paymentsSnap.docs.reduce(
      (sum, doc) => sum + (doc.data().amount || 0),
      0
    );

    return {
      totalUsers: usersSnap.data().count,
      totalCourses: coursesSnap.data().count,
      totalRevenue,
      activeEnrollments: enrollmentsSnap.data().count,
    };
  } catch (error) {
    console.error("Error fetching admin stats:", error);
    return {
      totalUsers: 0,
      totalCourses: 0,
      totalRevenue: 0,
      activeEnrollments: 0,
    };
  }
}

export default async function AdminDashboardPage() {
  const stats = await getStats();

  return (
    <div>
      <h1 className="text-2xl font-bold text-white mb-8">{adm.heading}</h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          icon={Users}
          label={adm.totalUsers}
          value={stats.totalUsers.toLocaleString()}
        />
        <StatCard
          icon={BookOpen}
          label={adm.totalCourses}
          value={stats.totalCourses.toLocaleString()}
        />
        <StatCard
          icon={CreditCard}
          label={adm.totalRevenue}
          value={`₹${stats.totalRevenue.toLocaleString()}`}
        />
        <StatCard
          icon={GraduationCap}
          label={adm.activeEnrollments}
          value={stats.activeEnrollments.toLocaleString()}
        />
      </div>
    </div>
  );
}
