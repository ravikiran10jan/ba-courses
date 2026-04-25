"use client";

import { useState } from "react";
import Card from "@/components/ui/Card";
import { ChevronLeft, ChevronRight, Star } from "lucide-react";
import { getTestimonials } from "@/lib/content";

const t = getTestimonials();

export default function TestimonialsSection() {
  const [current, setCurrent] = useState(0);

  function next() {
    setCurrent((prev) => (prev + 1) % t.items.length);
  }

  function prev() {
    setCurrent((prev) => (prev - 1 + t.items.length) % t.items.length);
  }

  const testimonial = t.items[current];

  return (
    <section className="py-16 sm:py-20 bg-card">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold text-white text-center mb-4">
          {t.heading}
        </h2>
        <p className="text-muted text-center mb-12 max-w-lg mx-auto">
          {t.subheading}
        </p>

        <div className="max-w-2xl mx-auto">
          <Card className="relative">
            {/* Stars */}
            <div className="flex items-center gap-1 mb-4">
              {Array.from({ length: 5 }).map((_, i) => (
                <Star key={i} size={16} className="text-accent fill-accent" />
              ))}
            </div>

            {/* Quote */}
            <blockquote className="text-muted leading-relaxed text-sm sm:text-base">
              &ldquo;{testimonial.quote}&rdquo;
            </blockquote>

            {/* Author */}
            <div className="mt-6 pt-4 border-t border-card-border">
              <p className="font-bold text-white">{testimonial.name}</p>
              <p className="text-xs text-accent mt-1">{testimonial.role}</p>
            </div>
          </Card>

          {/* Navigation */}
          <div className="flex items-center justify-center gap-4 mt-6">
            <button
              onClick={prev}
              className="w-10 h-10 rounded-full border border-card-border flex items-center justify-center text-muted hover:text-white hover:border-white transition-colors"
              aria-label="Previous testimonial"
            >
              <ChevronLeft size={18} />
            </button>

            <span className="text-sm text-muted">
              {current + 1} / {t.items.length}
            </span>

            <button
              onClick={next}
              className="w-10 h-10 rounded-full border border-card-border flex items-center justify-center text-muted hover:text-white hover:border-white transition-colors"
              aria-label="Next testimonial"
            >
              <ChevronRight size={18} />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
