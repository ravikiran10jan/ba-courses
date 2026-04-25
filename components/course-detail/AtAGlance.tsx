import Card from "@/components/ui/Card";
import { getCourseDetail } from "@/lib/content";

const cd = getCourseDetail();

interface GlanceItem {
  label: string;
  value: string;
}

interface AtAGlanceProps {
  items: GlanceItem[];
}

export default function AtAGlance({ items }: AtAGlanceProps) {
  return (
    <section className="py-16 sm:py-20 bg-card">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <h2 className="text-2xl sm:text-3xl font-bold text-white text-center mb-10">
          {cd.atAGlanceHeading}
        </h2>

        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 sm:gap-6 max-w-4xl mx-auto">
          {items.map((item) => (
            <Card key={item.label} className="text-center">
              <p className="text-xs text-muted uppercase tracking-wider mb-1">
                {item.label}
              </p>
              <p className="text-base sm:text-lg font-bold text-white">
                {item.value}
              </p>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
