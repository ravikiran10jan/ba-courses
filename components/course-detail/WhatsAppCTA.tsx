import { MessageCircle } from "lucide-react";
import Button from "@/components/ui/Button";
import { getCourseDetail } from "@/lib/content";

const cd = getCourseDetail();

interface WhatsAppCTAProps {
  whatsappLink: string;
}

export default function WhatsAppCTA({ whatsappLink }: WhatsAppCTAProps) {
  return (
    <section className="py-16 sm:py-20 bg-card">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 text-center">
        <h2 className="text-xl sm:text-2xl font-bold text-white">
          {cd.whatsappCta}
        </h2>

        <a
          href={whatsappLink}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-block mt-6"
        >
          <Button size="lg" className="gap-2">
            <MessageCircle size={20} />
            {cd.whatsappButton}
          </Button>
        </a>
      </div>
    </section>
  );
}
