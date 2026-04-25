import { redirect } from "next/navigation";
import { requireAdmin } from "@/lib/firebase/session";
import AdminSidebar from "@/components/layout/AdminSidebar";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Admin Panel",
};

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  try {
    await requireAdmin();
  } catch {
    redirect("/");
  }

  return (
    <div className="min-h-screen bg-black text-white">
      <AdminSidebar />
      <main className="lg:ml-[250px] min-h-screen">
        <div className="p-6 pt-16 lg:pt-6">{children}</div>
      </main>
    </div>
  );
}
