import Link from "next/link";
import { getSite } from "@/lib/content";

const site = getSite();

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col">
      <header className="p-6">
        <Link href="/" className="text-xl font-black tracking-tight">
          {site.name}
        </Link>
      </header>
      <main className="flex-1 flex items-center justify-center px-4 pb-12">
        {children}
      </main>
    </div>
  );
}
