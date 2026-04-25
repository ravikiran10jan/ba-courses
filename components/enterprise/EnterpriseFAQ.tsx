import Accordion from "@/components/ui/Accordion";
import { getEnterprise } from "@/lib/content";

const ent = getEnterprise();

export default function EnterpriseFAQ() {
  return (
    <section className="py-16 sm:py-20 bg-background">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold text-white text-center mb-10">
          {ent.faq.heading}
        </h2>

        <div className="max-w-3xl mx-auto">
          <Accordion items={ent.faq.items} />
        </div>
      </div>
    </section>
  );
}
