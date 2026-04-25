import Accordion from "@/components/ui/Accordion";
import { getCourseDetail } from "@/lib/content";
import type { FAQ } from "@/types";

const cd = getCourseDetail();

interface FAQSectionProps {
  faqs: FAQ[];
}

export default function FAQSection({ faqs }: FAQSectionProps) {
  const items = faqs.map((faq) => ({
    title: faq.question,
    content: faq.answer,
  }));

  return (
    <section className="py-16 sm:py-20 bg-background">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <h2 className="text-2xl sm:text-3xl font-bold text-white text-center mb-10">
          {cd.faqHeading}
        </h2>

        <div className="max-w-3xl mx-auto">
          <Accordion items={items} />
        </div>
      </div>
    </section>
  );
}
