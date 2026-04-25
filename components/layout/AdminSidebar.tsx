"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  BookOpen,
  Users,
  CreditCard,
  Menu,
  X,
} from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/utils/cn";
import { adminNavItems } from "@/lib/constants/navigation";
import { getAdminSidebar } from "@/lib/content";

const sb = getAdminSidebar();

const iconMap: Record<string, React.ComponentType<{ size?: number }>> = {
  LayoutDashboard,
  BookOpen,
  Users,
  CreditCard,
};

export default function AdminSidebar() {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <>
      {/* Mobile menu button */}
      <button
        onClick={() => setMobileOpen(!mobileOpen)}
        className="fixed top-4 left-4 z-50 lg:hidden bg-[#111111] border border-[#444444] rounded-lg p-2 text-white hover:bg-[#222222] transition-colors"
        aria-label="Toggle menu"
      >
        {mobileOpen ? <X size={20} /> : <Menu size={20} />}
      </button>

      {/* Mobile overlay */}
      {mobileOpen && (
        <div
          className="fixed inset-0 bg-black/60 z-30 lg:hidden"
          onClick={() => setMobileOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={cn(
          "fixed top-0 left-0 z-40 h-screen w-[250px] bg-[#111111] border-r border-[#444444] flex flex-col transition-transform duration-300",
          "lg:translate-x-0",
          mobileOpen ? "translate-x-0" : "-translate-x-full"
        )}
      >
        {/* Logo area */}
        <div className="p-6 border-b border-[#444444]">
          <Link
            href="/admin"
            className="block"
            onClick={() => setMobileOpen(false)}
          >
            <h1 className="text-xl font-bold text-white">{sb.brandName}</h1>
            <span className="text-xs font-semibold text-[#FF1493] tracking-wider mt-1 block">
              {sb.adminPanel}
            </span>
          </Link>
        </div>

        {/* Navigation */}
        <nav className="flex-1 py-6 px-3 space-y-1 overflow-y-auto">
          {adminNavItems.map((item) => {
            const Icon = iconMap[item.icon] || LayoutDashboard;
            const isActive =
              item.href === "/admin"
                ? pathname === "/admin"
                : pathname.startsWith(item.href);

            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setMobileOpen(false)}
                className={cn(
                  "flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-all duration-200",
                  isActive
                    ? "bg-[#FF1493]/10 text-[#FF1493] border border-[#FF1493]/20"
                    : "text-[#999999] hover:text-white hover:bg-white/5"
                )}
              >
                <Icon size={18} />
                {item.label}
              </Link>
            );
          })}
        </nav>

        {/* Footer */}
        <div className="p-4 border-t border-[#444444]">
          <Link
            href="/"
            className="flex items-center gap-2 text-sm text-[#999999] hover:text-white transition-colors"
            onClick={() => setMobileOpen(false)}
          >
            <span>&larr;</span>
            {sb.backToSite}
          </Link>
        </div>
      </aside>
    </>
  );
}
