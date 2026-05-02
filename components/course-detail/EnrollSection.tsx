import Button from "@/components/ui/Button";
import { formatCurrency } from "@/lib/utils/format";
import { getCourseDetail } from "@/lib/content";

const cd = getCourseDetail();

const WHATSAPP_NUMBER = "919381379483";

interface EnrollSectionProps {
  courseId: string;
  courseTitle: string;
  price: number;
  originalPrice: number;
}

export default function EnrollSection({
  courseTitle,
  price,
  originalPrice,
}: EnrollSectionProps) {
  const message = encodeURIComponent(
    `Hi, I'm interested in enrolling for "${courseTitle}". Please share the details.`
  );
  const whatsappUrl = `https://wa.me/${WHATSAPP_NUMBER}?text=${message}`;

  return (
    <section id="enroll" className="py-16 sm:py-20 bg-card">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 text-center">
        <h2 className="text-2xl sm:text-3xl font-bold text-white mb-4">
          {cd.enrollHeading}
        </h2>
        <p className="text-muted mb-8 max-w-lg mx-auto">
          {cd.enrollSubheading}
        </p>

        <div className="flex flex-col items-center gap-4">
          <a href={whatsappUrl} target="_blank" rel="noopener noreferrer">
            <Button
              variant="cta"
              size="lg"
              className="max-w-md"
            >
              {cd.enrollCta}{" "}
              {originalPrice > price && (
                <span className="line-through opacity-60 mx-1">
                  {formatCurrency(originalPrice)}
                </span>
              )}
              {formatCurrency(price)}
            </Button>
          </a>
        </div>
      </div>
    </section>
  );
}
