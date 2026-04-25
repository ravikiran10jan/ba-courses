"use client";

import { useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import { useRouter } from "next/navigation";
import Button from "@/components/ui/Button";
import PaymentModal from "@/components/course-detail/PaymentModal";
import { formatCurrency } from "@/lib/utils/format";
import { getCourseDetail } from "@/lib/content";

const cd = getCourseDetail();

interface EnrollSectionProps {
  courseId: string;
  courseTitle: string;
  price: number;
  originalPrice: number;
}

export default function EnrollSection({
  courseId,
  courseTitle,
  price,
  originalPrice,
}: EnrollSectionProps) {
  const { user, loading } = useAuth();
  const router = useRouter();
  const [showModal, setShowModal] = useState(false);
  const [processing, setProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleConfirm(finalAmount: number, couponCode?: string) {
    if (!user) {
      router.push("/login?redirect=" + encodeURIComponent(window.location.pathname));
      return;
    }

    setProcessing(true);
    setError(null);

    try {
      const res = await fetch("/api/payments/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ courseId, couponCode }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || cd.enrollCreateError);
        setProcessing(false);
        return;
      }

      // Redirect to Instamojo payment page
      if (data.paymentUrl) {
        window.location.href = data.paymentUrl;
      }
    } catch {
      setError(cd.enrollGenericError);
      setProcessing(false);
    }
  }

  function handleEnrollClick() {
    if (!user && !loading) {
      router.push("/login?redirect=" + encodeURIComponent(window.location.pathname));
      return;
    }
    setShowModal(true);
  }

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
          <Button
            variant="cta"
            size="lg"
            onClick={handleEnrollClick}
            loading={processing}
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

          {error && (
            <p className="text-red-500 text-sm">{error}</p>
          )}
        </div>

        <PaymentModal
          isOpen={showModal}
          onClose={() => setShowModal(false)}
          course={{
            id: courseId,
            title: courseTitle,
            price,
            originalPrice,
          }}
          onConfirm={handleConfirm}
        />
      </div>
    </section>
  );
}
