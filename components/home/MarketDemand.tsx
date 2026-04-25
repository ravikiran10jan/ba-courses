import { Clock, UserCheck, Briefcase } from "lucide-react";
import { getMarketDemand } from "@/lib/content";

const icons = [Briefcase, Clock, UserCheck];
const md = getMarketDemand();

export default function MarketDemand() {
  return (
    <section className="py-16 sm:py-20 bg-background">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <p className="text-accent font-semibold text-sm tracking-wider mb-3">
            {md.tagline}
          </p>
          <div className="flex items-baseline justify-center gap-3">
            <span className="text-4xl sm:text-5xl lg:text-6xl font-black text-white">
              {md.bigNumber}
            </span>
          </div>
          <p className="text-lg sm:text-xl text-muted mt-2">
            {md.bigLabel}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
          {md.points.map((point, i) => {
            const Icon = icons[i] || Briefcase;
            return (
              <div key={point.title} className="text-center">
                <div className="flex items-center justify-center w-12 h-12 mx-auto rounded-lg bg-accent/10 mb-4">
                  <Icon size={24} className="text-accent" />
                </div>
                <h3 className="text-sm font-bold text-white mb-2">
                  {point.title}
                </h3>
                <p className="text-xs text-muted leading-relaxed">
                  {point.description}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
