"use client";

import { useState } from "react";
import Link from "next/link";
import { Menu, X } from "lucide-react";
import { cn } from "@/lib/utils/cn";
import { useAuth } from "@/hooks/useAuth";
import { publicNavLinks } from "@/lib/constants/navigation";
import { getNavbar } from "@/lib/content";

const nav = getNavbar();

export default function Navbar() {
  const { user, profile, loading } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const firstLetter = profile?.name
    ? profile.name.charAt(0).toUpperCase()
    : user?.email
      ? user.email.charAt(0).toUpperCase()
      : "U";

  return (
    <header className="sticky top-0 z-40 w-full bg-background/80 backdrop-blur-md border-b border-card-border">
      <nav className="mx-auto max-w-7xl flex items-center justify-between px-4 sm:px-6 lg:px-8 h-16">
        {/* Logo */}
        <Link href="/" className="text-xl font-bold text-white shrink-0">
          {nav.logo}
        </Link>

        {/* Desktop nav */}
        <div className="hidden md:flex items-center gap-8">
          {publicNavLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="text-sm font-medium text-muted hover:text-white transition-colors"
            >
              {link.label}
            </Link>
          ))}
        </div>

        {/* Desktop auth */}
        <div className="hidden md:flex items-center gap-3">
          {loading ? (
            <div className="h-9 w-20 bg-card rounded animate-pulse" />
          ) : user ? (
            <Link
              href="/dashboard"
              className="flex items-center justify-center w-9 h-9 rounded-full bg-accent text-white text-sm font-bold hover:bg-accent-hover transition-colors"
            >
              {firstLetter}
            </Link>
          ) : (
            <>
              <Link
                href="/login"
                className="inline-flex items-center justify-center text-sm font-medium px-5 py-2 rounded border border-card-border text-white hover:bg-card transition-colors"
              >
                {nav.login}
              </Link>
              <Link
                href="/signup"
                className="inline-flex items-center justify-center text-sm font-bold px-5 py-2 rounded bg-accent text-white hover:bg-accent/90 transition-colors"
              >
                {nav.signup}
              </Link>
            </>
          )}
        </div>

        {/* Mobile hamburger */}
        <button
          className="md:hidden text-white p-2"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          aria-label={mobileMenuOpen ? "Close menu" : "Open menu"}
        >
          {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </nav>

      {/* Mobile menu */}
      <div
        className={cn(
          "md:hidden overflow-y-auto transition-all duration-300 bg-background border-b border-card-border",
          mobileMenuOpen ? "max-h-[70vh]" : "max-h-0 border-b-0"
        )}
      >
        <div className="px-4 py-4 space-y-4">
          {publicNavLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              onClick={() => setMobileMenuOpen(false)}
              className="block text-sm font-medium text-muted hover:text-white transition-colors"
            >
              {link.label}
            </Link>
          ))}
          {!loading && (
            <>
              {user ? (
                <Link
                  href="/dashboard"
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center gap-3 text-sm font-medium text-white"
                >
                  <span className="flex items-center justify-center w-8 h-8 rounded-full bg-accent text-white text-xs font-bold">
                    {firstLetter}
                  </span>
                  {nav.dashboard}
                </Link>
              ) : (
                <div className="flex flex-col gap-3 pt-2 border-t border-card-border">
                  <Link
                    href="/login"
                    onClick={() => setMobileMenuOpen(false)}
                    className="inline-flex items-center justify-center text-sm font-medium px-6 py-2.5 rounded border border-card-border text-white hover:bg-card transition-colors w-full"
                  >
                    {nav.login}
                  </Link>
                  <Link
                    href="/signup"
                    onClick={() => setMobileMenuOpen(false)}
                    className="inline-flex items-center justify-center text-sm font-bold px-6 py-2.5 rounded bg-accent text-white hover:bg-accent/90 transition-colors w-full"
                  >
                    {nav.signupMobile}
                  </Link>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </header>
  );
}
