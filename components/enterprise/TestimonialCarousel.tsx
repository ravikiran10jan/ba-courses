import { Star } from "lucide-react";
import Card from "@/components/ui/Card";
import { getEnterprise } from "@/lib/content";

const ent = getEnterprise();

function StarRating({ rating }: { rating: number }) {
  return (
    <div className="flex items-center gap-0.5">
      {Array.from({ length: 5 }).map((_, i) => (
        <Star
          key={i}
          size={14}
          className={i < rating ? "text-warning fill-warning" : "text-muted-foreground"}
        />
      ))}
    </div>
  );
}

export default function TestimonialCarousel() {
  return (
    <section className="py-16 sm:py-20 bg-card">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold text-white text-center mb-12">
          {ent.testimonials.heading}
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {ent.testimonials.items.map((t) => (
            <Card key={t.name} hover>
              <StarRating rating={t.rating} />
              <p className="mt-4 text-sm text-muted leading-relaxed">
                &ldquo;{t.review}&rdquo;
              </p>
              <div className="mt-4 pt-4 border-t border-card-border">
                <p className="text-sm font-bold text-white">{t.name}</p>
                <p className="text-xs text-muted mt-0.5">{t.role}</p>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
