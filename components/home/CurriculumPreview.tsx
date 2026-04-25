import Card from "@/components/ui/Card";
import { BookOpen, TrendingUp, Brain } from "lucide-react";
import { getCurriculum } from "@/lib/content";

const icons = [BookOpen, TrendingUp, Brain];
const curr = getCurriculum();

export default function CurriculumPreview() {
  return (
    <section className="py-16 sm:py-20 bg-card">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold text-white text-center mb-4">
          {curr.tagline}
        </h2>
        <p className="text-muted text-center mb-12 max-w-lg mx-auto">
          {curr.heading}
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {curr.pillars.map((pillar, i) => {
            const Icon = icons[i] || BookOpen;
            return (
              <Card key={pillar.tag} hover className="h-full">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 rounded-lg bg-accent/10 flex items-center justify-center shrink-0">
                    <Icon size={20} className="text-accent" />
                  </div>
                  <div>
                    <p className="text-xs font-semibold text-accent tracking-wider">
                      {pillar.tag}
                    </p>
                    <h3 className="text-sm font-bold text-white">
                      {pillar.title}
                    </h3>
                  </div>
                </div>

                <ul className="space-y-2">
                  {pillar.items.map((item) => (
                    <li
                      key={item}
                      className="flex items-start gap-2 text-sm text-muted"
                    >
                      <span className="text-accent mt-1 shrink-0">&rsaquo;</span>
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </Card>
            );
          })}
        </div>
      </div>
    </section>
  );
}
