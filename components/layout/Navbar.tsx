"use client";

import { useState } from "react";
import Link from "next/link";
import { Menu, X } from "lucide-react";
import { cn } from "@/lib/utils/cn";
import { publicNavLinks } from "@/lib/constants/navigation";
import { getNavbar } from "@/lib/content";

const nav = getNavbar();

const WHATSAPP_URL = "https://wa.me/919381379483?text=" + encodeURIComponent("Hi, I'm interested in your BA courses. Please share the details.");

export default function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

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

        {/* Desktop CTA */}
        <div className="hidden md:flex items-center gap-3">
          <a
            href={WHATSAPP_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center text-sm font-bold px-5 py-2 rounded bg-accent text-white hover:bg-accent/90 transition-colors"
          >
            Enroll Now
          </a>
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
          <div className="pt-2 border-t border-card-border">
            <a
              href={WHATSAPP_URL}
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => setMobileMenuOpen(false)}
              className="inline-flex items-center justify-center text-sm font-bold px-6 py-2.5 rounded bg-accent text-white hover:bg-accent/90 transition-colors w-full"
            >
              Enroll Now
            </a>
          </div>
        </div>
      </div>
    </header>
  );
}
