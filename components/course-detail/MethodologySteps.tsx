import { BookOpen, MessageCircle, ClipboardCheck, Briefcase } from "lucide-react";
import { getMethodology } from "@/lib/content";

const icons = [BookOpen, MessageCircle, ClipboardCheck, Briefcase];
const methodology = getMethodology();

export default function MethodologySteps() {
  return (
    <section className="py-16 sm:py-20 bg-background">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <h2 className="text-2xl sm:text-3xl font-bold text-white text-center mb-12">
          {methodology.heading}
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {methodology.steps.map((step, i) => {
            const Icon = icons[i] || BookOpen;
            return (
              <div key={i} className="flex gap-4">
                <div className="shrink-0 flex items-center justify-center w-12 h-12 rounded-lg bg-accent/10">
                  <Icon size={24} className="text-accent" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-white">{step.title}</h3>
                  <p className="mt-2 text-sm text-muted leading-relaxed">
                    {step.description}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
