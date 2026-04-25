import Link from "next/link";
import Badge from "@/components/ui/Badge";
import Card from "@/components/ui/Card";
import Button from "@/components/ui/Button";
import { formatCurrency } from "@/lib/utils/format";
import { getCourseCard } from "@/lib/content";
import { Users, Clock } from "lucide-react";

const cc = getCourseCard();

interface CourseCardProps {
  title: string;
  slug: string;
  category: string;
  price: number;
  originalPrice: number;
  enrolledCount: number;
  duration: string;
  thumbnailUrl: string;
}

export default function CourseCard({
  title,
  slug,
  category,
  price,
  originalPrice,
  enrolledCount,
  duration,
  thumbnailUrl,
}: CourseCardProps) {
  return (
    <Card hover className="flex flex-col h-full p-0 overflow-hidden">
      {/* Top stats row */}
      <div className="flex items-center justify-between px-4 pt-4 text-xs text-muted">
        <span className="flex items-center gap-1">
          <Users size={14} />
          {enrolledCount} {cc.aspirantsSuffix}
        </span>
        <span className="flex items-center gap-1">
          <Clock size={14} />
          {duration}
        </span>
      </div>

      {/* Thumbnail */}
      <div className="mx-4 mt-3 rounded-lg overflow-hidden">
        {thumbnailUrl ? (
          <img
            src={thumbnailUrl}
            alt={title}
            className="w-full h-44 object-cover"
          />
        ) : (
          <div className="w-full h-44 bg-gradient-to-br from-card to-card-border flex items-center justify-center">
            <span className="text-muted-foreground text-sm">{cc.thumbnailAlt}</span>
          </div>
        )}
      </div>

      {/* Content */}
      <div className="flex flex-col flex-1 px-4 py-4">
        <h3 className="text-base font-bold text-white leading-snug line-clamp-2">
          {title}
        </h3>

        <div className="mt-2">
          <Badge>{category}</Badge>
        </div>

        {/* Price row */}
        <div className="mt-auto pt-4 flex items-center gap-3">
          <span className="text-lg font-bold text-white">
            {formatCurrency(price)}
          </span>
          <span className="text-sm text-muted line-through">
            {formatCurrency(originalPrice)}
          </span>
        </div>

        {/* CTA */}
        <Link href={`/course/${slug}`} className="mt-4 block">
          <Button variant="cta" size="sm">
            {cc.cta}
          </Button>
        </Link>
      </div>
    </Card>
  );
}
