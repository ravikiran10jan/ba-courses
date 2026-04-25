"use client";

import { useState, type FormEvent } from "react";
import { Check } from "lucide-react";
import { getWhatYouGet, getPricing } from "@/lib/content";
import { formatCurrency } from "@/lib/utils/format";
import Input from "@/components/ui/Input";
import Button from "@/components/ui/Button";

const wyg = getWhatYouGet();
const pricing = getPricing();

export default function WhatYouGetSection() {
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (!email || submitting) return;
    setSubmitting(true);
    try {
      const res = await fetch("/api/newsletter", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      if (res.ok) {
        setSubmitted(true);
        setEmail("");
        setTimeout(() => setSubmitted(false), 3000);
      }
    } catch {
      // Silent fail
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <section className="py-16 sm:py-20 bg-card">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-accent font-semibold text-sm sm:text-base tracking-wider mb-2">
            {wyg.tagline}
          </h2>

          <p className="text-xl sm:text-2xl font-bold text-white mt-4">
            {wyg.priceLabel}{" "}
            <span className="line-through text-muted">
              {formatCurrency(pricing.original)}
            </span>{" "}
            <span className="text-accent">
              {formatCurrency(pricing.discounted)}
            </span>
          </p>

          <ul className="mt-8 space-y-4 text-left max-w-md mx-auto">
            {wyg.items.map((item, i) => (
              <li key={i} className="flex items-start gap-3">
                <span className="mt-0.5 flex items-center justify-center w-5 h-5 rounded-full bg-accent/20 shrink-0">
                  <Check size={12} className="text-accent" />
                </span>
                <span className="text-muted">{item}</span>
              </li>
            ))}
          </ul>

          {/* Newsletter form */}
          <form
            onSubmit={handleSubmit}
            className="mt-10 flex flex-col sm:flex-row gap-3 max-w-md mx-auto"
          >
            <Input
              type="email"
              placeholder={wyg.newsletterPlaceholder}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="flex-1"
            />
            <Button type="submit" size="md" className="shrink-0" loading={submitting}>
              {submitted ? wyg.newsletterSuccess : wyg.newsletterButton}
            </Button>
          </form>
        </div>
      </div>
    </section>
  );
}
