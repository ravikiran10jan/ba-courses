import { Check } from "lucide-react";
import Button from "@/components/ui/Button";
import Link from "next/link";
import { getEnterprise } from "@/lib/content";

const ent = getEnterprise();

export default function EnterpriseHero() {
  return (
    <section className="py-20 sm:py-28 bg-background">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl">
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-white leading-tight">
            {ent.hero.heading}
          </h1>

          <ul className="mt-8 space-y-4">
            {ent.hero.benefits.map((benefit) => (
              <li key={benefit} className="flex items-start gap-3">
                <span className="mt-0.5 flex items-center justify-center w-6 h-6 rounded-full bg-accent/20 shrink-0">
                  <Check size={14} className="text-accent" />
                </span>
                <span className="text-muted text-lg">{benefit}</span>
              </li>
            ))}
          </ul>

          <Link href="/contact-us" className="inline-block mt-10">
            <Button size="lg">{ent.hero.cta}</Button>
          </Link>
        </div>
      </div>
    </section>
  );
}
