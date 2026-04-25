import { getWhoIsThisFor } from "@/lib/content";

const who = getWhoIsThisFor();

export default function TrustBadges() {
  return (
    <section className="py-16 sm:py-20 bg-background">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 text-center">
        <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold text-white mb-4">
          {who.heading}
        </h2>
        <p className="text-muted mb-10 max-w-lg mx-auto">
          {who.subheading}
        </p>

        <div className="flex flex-wrap items-center justify-center gap-2 sm:gap-4">
          {who.badges.map((item) => (
            <div
              key={item}
              className="px-4 sm:px-6 py-2 sm:py-3 bg-card border border-card-border rounded-lg text-xs sm:text-sm font-semibold text-muted hover:text-white hover:border-accent transition-colors"
            >
              {item}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
