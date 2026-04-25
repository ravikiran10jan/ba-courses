import Link from "next/link";
import UserDropdown from "@/components/layout/UserDropdown";
import { getSite, getFooter } from "@/lib/content";

const site = getSite();
const footer = getFooter();

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col">
      <header className="border-b border-card-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <Link href="/" className="text-xl font-black tracking-tight">
            BA Courses
          </Link>
          <UserDropdown />
        </div>
      </header>

      <main className="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-8">
        {children}
      </main>

      <footer className="border-t border-card-border py-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center text-sm text-muted">
          &copy; {new Date().getFullYear()} {footer.copyright}
        </div>
      </footer>
    </div>
  );
}
