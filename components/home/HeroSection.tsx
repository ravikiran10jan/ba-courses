"use client";

import Link from "next/link";
import { useAuth } from "@/hooks/useAuth";
import { getHero } from "@/lib/content";
import Button from "@/components/ui/Button";

const hero = getHero();

export default function HeroSection() {
  const { user } = useAuth();

  function handleScrollToCourses() {
    const el = document.getElementById("live-courses");
    if (el) {
      el.scrollIntoView({ behavior: "smooth" });
    }
  }

  return (
    <section className="relative overflow-hidden py-20 sm:py-28 lg:py-36">
      {/* Gradient background */}
      <div className="absolute inset-0 bg-gradient-to-br from-background via-background to-card" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_rgba(255,20,147,0.08)_0%,_transparent_60%)]" />

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 text-center">
        <p className="text-accent font-semibold text-sm sm:text-base tracking-wider mb-4">
          {hero.tagline}
        </p>

        <h1 className="text-3xl sm:text-5xl lg:text-7xl font-black text-white leading-tight">
          {hero.headlineTop}
          <br />
          <span className="text-accent">{hero.headlineAccent}</span>
        </h1>

        <p className="mt-6 text-base sm:text-xl text-muted max-w-2xl mx-auto leading-relaxed">
          {hero.subheadline}
        </p>

        {/* Ops -> BA visual */}
        <div className="mt-8 flex items-center justify-center gap-3 text-sm sm:text-base">
          <span className="px-4 py-2 bg-card border border-card-border rounded-lg text-muted font-medium">
            {hero.badgeLeft}
          </span>
          <span className="text-accent font-bold text-lg">{hero.badgeArrow}</span>
          <span className="px-4 py-2 bg-accent/10 border border-accent/30 rounded-lg text-accent font-bold">
            {hero.badgeRight}
          </span>
        </div>

        <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
          <Button size="lg" onClick={handleScrollToCourses}>
            {hero.ctaPrimary}
          </Button>

          <Link href="/enterprise">
            <Button variant="secondary" size="lg">
              {hero.ctaSecondary}
            </Button>
          </Link>

          {user && (
            <Link href="/dashboard">
              <Button variant="ghost" size="lg">
                {hero.ctaDashboard}
              </Button>
            </Link>
          )}
        </div>
      </div>
    </section>
  );
}
