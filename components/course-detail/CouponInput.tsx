"use client";

import { useState } from "react";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import { getCoupon } from "@/lib/content";

const cp = getCoupon();

interface CouponInputProps {
  courseId: string;
  onCouponApplied: (discount: number) => void;
}

export default function CouponInput({
  courseId,
  onCouponApplied,
}: CouponInputProps) {
  const [code, setCode] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  async function handleApply() {
    if (!code.trim()) return;

    setLoading(true);
    setSuccess(null);
    setError(null);

    try {
      const res = await fetch("/api/coupons/verify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ code: code.trim(), courseId }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || cp.errorMessage);
        return;
      }

      const discount = data.discount as number;
      setSuccess(cp.successMessage.replace("{discount}", String(discount)));
      onCouponApplied(discount);
    } catch {
      setError(cp.failMessage);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="space-y-3">
      <div className="flex gap-3">
        <Input
          placeholder={cp.placeholder}
          value={code}
          onChange={(e) => {
            setCode(e.target.value);
            if (error) setError(null);
            if (success) setSuccess(null);
          }}
          disabled={loading || !!success}
          className="flex-1"
        />
        <Button
          variant="secondary"
          size="md"
          onClick={handleApply}
          loading={loading}
          disabled={!code.trim() || !!success}
          className="shrink-0"
        >
          {cp.applyButton}
        </Button>
      </div>

      {success && (
        <p className="text-sm text-success font-medium">{success}</p>
      )}

      {error && (
        <p className="text-sm text-error font-medium">{error}</p>
      )}
    </div>
  );
}
