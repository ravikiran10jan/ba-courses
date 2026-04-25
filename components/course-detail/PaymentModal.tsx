"use client";

import { useState } from "react";
import Modal from "@/components/ui/Modal";
import Button from "@/components/ui/Button";
import CouponInput from "@/components/course-detail/CouponInput";
import { formatCurrency } from "@/lib/utils/format";
import { getPayment } from "@/lib/content";

const pm = getPayment();

interface PaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
  course: {
    id: string;
    title: string;
    price: number;
    originalPrice: number;
  };
  onConfirm: (finalAmount: number, couponCode?: string) => void;
}

export default function PaymentModal({
  isOpen,
  onClose,
  course,
  onConfirm,
}: PaymentModalProps) {
  const [couponDiscount, setCouponDiscount] = useState(0);
  const [processing, setProcessing] = useState(false);

  const baseDiscount = course.originalPrice - course.price;
  const finalAmount = Math.max(0, course.price - couponDiscount);

  function handleCouponApplied(discount: number) {
    setCouponDiscount(discount);
  }

  async function handleConfirm() {
    setProcessing(true);
    try {
      onConfirm(finalAmount);
    } finally {
      setProcessing(false);
    }
  }

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={pm.confirmTitle}>
      <div className="space-y-6">
        {/* Course info */}
        <div>
          <h3 className="font-bold text-lg">{course.title}</h3>
        </div>

        {/* Coupon input */}
        <div>
          <label className="block text-sm font-medium text-muted mb-2">
            {pm.couponLabel}
          </label>
          <CouponInput
            courseId={course.id}
            onCouponApplied={handleCouponApplied}
          />
        </div>

        {/* Price breakdown */}
        <div className="border-t border-card-border pt-4 space-y-3">
          <div className="flex justify-between text-sm">
            <span className="text-muted">{pm.originalPriceLabel}</span>
            <span className="line-through text-muted">
              {formatCurrency(course.originalPrice)}
            </span>
          </div>

          {baseDiscount > 0 && (
            <div className="flex justify-between text-sm">
              <span className="text-muted">{pm.discountLabel}</span>
              <span className="text-success">
                -{formatCurrency(baseDiscount)}
              </span>
            </div>
          )}

          {couponDiscount > 0 && (
            <div className="flex justify-between text-sm">
              <span className="text-muted">{pm.couponDiscountLabel}</span>
              <span className="text-success">
                -{formatCurrency(couponDiscount)}
              </span>
            </div>
          )}

          <div className="flex justify-between font-bold text-lg border-t border-card-border pt-3">
            <span>{pm.totalLabel}</span>
            <span className="text-accent">{formatCurrency(finalAmount)}</span>
          </div>
        </div>

        {/* Actions */}
        <div className="flex flex-col sm:flex-row gap-3 pt-2">
          <Button
            variant="primary"
            size="md"
            onClick={handleConfirm}
            loading={processing}
            className="flex-1"
          >
            {pm.proceedButton}
          </Button>
          <Button
            variant="ghost"
            size="md"
            onClick={onClose}
            disabled={processing}
            className="flex-1"
          >
            {pm.cancelButton}
          </Button>
        </div>
      </div>
    </Modal>
  );
}
