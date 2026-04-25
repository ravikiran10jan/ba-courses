import Card from "@/components/ui/Card";
import { TrendingUp, ArrowUpRight, Zap, Brain } from "lucide-react";
import { getWhyThisOpportunity } from "@/lib/content";

const icons = [TrendingUp, ArrowUpRight, Zap, Brain];
const opp = getWhyThisOpportunity();

export default function PartnersSection() {
  return (
    <section className="py-16 sm:py-20 bg-background">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 text-center">
        <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold text-white mb-4">
          {opp.heading}
        </h2>
        <p className="text-muted mb-10 max-w-lg mx-auto">
          {opp.subheading}
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          {opp.cards.map((card, i) => {
            const Icon = icons[i] || TrendingUp;
            return (
              <Card key={card.title} hover className="text-center">
                <div className="flex items-center justify-center w-12 h-12 mx-auto rounded-lg bg-accent/10 mb-4">
                  <Icon size={24} className="text-accent" />
                </div>
                <h3 className="text-sm font-bold text-white mb-2">
                  {card.tag ? `${card.tag} ` : ""}{card.title}
                </h3>
                <p className="text-xs text-muted leading-relaxed">{card.description}</p>
              </Card>
            );
          })}
        </div>
      </div>
    </section>
  );
}
