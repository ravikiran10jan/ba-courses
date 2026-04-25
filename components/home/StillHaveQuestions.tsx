"use client";

import Button from "@/components/ui/Button";
import { getStillHaveQuestions, getSite } from "@/lib/content";

const shq = getStillHaveQuestions();
const site = getSite();

export default function StillHaveQuestions() {
  return (
    <section className="py-16 sm:py-20 bg-background">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 text-center">
        <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-white">
          {shq.heading}
        </h2>
        <p className="mt-4 text-muted max-w-2xl mx-auto">
          {shq.description}
        </p>
        <a
          href={site.contact.whatsapp}
          target="_blank"
          rel="noopener noreferrer"
        >
          <Button className="mt-8" size="lg">
            {shq.cta}
          </Button>
        </a>
      </div>
    </section>
  );
}
