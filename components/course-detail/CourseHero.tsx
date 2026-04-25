import Link from "next/link";
import { formatCurrency } from "@/lib/utils/format";
import { getCourseDetail } from "@/lib/content";
import CountdownTimer from "@/components/ui/CountdownTimer";
import Button from "@/components/ui/Button";

const cd = getCourseDetail();

interface CourseHeroProps {
  title: string;
  enrolledCount: number;
  price: number;
  originalPrice: number;
  couponCode: string;
  slug: string;
}

export default function CourseHero({
  title,
  enrolledCount,
  price,
  originalPrice,
  couponCode,
  slug,
}: CourseHeroProps) {
  return (
    <section className="py-16 sm:py-20 bg-background">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 text-center">
        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-white leading-tight max-w-4xl mx-auto">
          {title}
        </h1>

        <p className="mt-4 text-lg text-muted">
          {cd.heroStudentsLabel.replace("{count}", String(enrolledCount))}
        </p>

        <div className="mt-8">
          <Link href={`/course/${slug}#enroll`}>
            <Button variant="cta" size="lg" className="max-w-md mx-auto">
              {cd.heroEnrollLabel}{" "}
              <span className="line-through opacity-60 mx-1">
                {formatCurrency(originalPrice)}
              </span>{" "}
              {formatCurrency(price)}
            </Button>
          </Link>
        </div>

        {couponCode && (
          <p className="mt-4 text-sm text-muted">
            {cd.heroCouponLabel.replace("{code}", couponCode)}
          </p>
        )}

        <div className="mt-6">
          <CountdownTimer
            minutes={10}
            label={cd.heroCountdownLabel}
            className="text-accent text-lg"
          />
        </div>
      </div>
    </section>
  );
}
