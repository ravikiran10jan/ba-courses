"use client";

import { useEffect, useRef, useState } from "react";
import { getStats } from "@/lib/content";
import Card from "@/components/ui/Card";

const stats = getStats();

function AnimatedStat({
  value,
  label,
  inView,
}: {
  value: string;
  label: string;
  inView: boolean;
}) {
  return (
    <Card
      className={`text-center transition-all duration-700 ${
        inView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
      }`}
    >
      <p className="text-2xl sm:text-3xl lg:text-4xl font-black text-accent">{value}</p>
      <p className="mt-2 text-sm text-muted">{label}</p>
    </Card>
  );
}

export default function StatsSection() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const [inView, setInView] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setInView(true);
        }
      },
      { threshold: 0.2 }
    );

    const el = sectionRef.current;
    if (el) {
      observer.observe(el);
    }
    return () => {
      if (el) observer.unobserve(el);
    };
  }, []);

  return (
    <section ref={sectionRef} className="py-16 sm:py-20 bg-card">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold text-white text-center mb-12 max-w-3xl mx-auto">
          {stats.heading}
        </h2>

        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 sm:gap-6">
          {stats.items.map((stat, i) => (
            <AnimatedStat
              key={i}
              value={stat.value}
              label={stat.label}
              inView={inView}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
