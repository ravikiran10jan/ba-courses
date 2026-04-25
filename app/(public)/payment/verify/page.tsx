"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { Suspense } from "react";
import Link from "next/link";
import Button from "@/components/ui/Button";
import Spinner from "@/components/ui/Spinner";
import { CheckCircle, XCircle } from "lucide-react";
import { getPaymentVerify } from "@/lib/content";

const pv = getPaymentVerify();

function PaymentVerifyContent() {
  const searchParams = useSearchParams();
  const paymentId = searchParams.get("payment_id");
  const paymentRequestId = searchParams.get("payment_request_id");

  const [status, setStatus] = useState<"loading" | "success" | "failed">("loading");
  const [message, setMessage] = useState("");

  useEffect(() => {
    async function verifyPayment() {
      if (!paymentRequestId && !paymentId) {
        setStatus("failed");
        setMessage(pv.invalidPaymentRef);
        return;
      }

      try {
        const queryParam = paymentRequestId
          ? `payment_request_id=${paymentRequestId}`
          : `payment_id=${paymentId}`;

        const res = await fetch(`/api/payments/verify?${queryParam}`);
        const data = await res.json();

        if (res.ok && (data.internalStatus === "COMPLETED" || data.instamojoStatus === "Completed")) {
          setStatus("success");
          setMessage(pv.successMessage);
        } else if (data.internalStatus === "PENDING") {
          setStatus("success");
          setMessage(pv.processingMessage);
        } else {
          setStatus("failed");
          setMessage(data.error || pv.failedMessage);
        }
      } catch {
        setStatus("failed");
        setMessage(pv.errorMessage);
      }
    }

    verifyPayment();
  }, [paymentId, paymentRequestId]);

  if (status === "loading") {
    return (
      <div className="flex flex-col items-center justify-center py-32 gap-4">
        <Spinner size="lg" />
        <p className="text-muted text-lg">{pv.verifyingMessage}</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center py-32 text-center px-4">
      {status === "success" ? (
        <>
          <CheckCircle className="w-16 h-16 text-green-500 mb-6" />
          <h1 className="text-3xl font-black mb-4 text-white">{pv.successTitle}</h1>
          <p className="text-muted mb-8 max-w-md">{message}</p>
          <div className="flex flex-col sm:flex-row gap-4">
            <Link href="/dashboard">
              <Button variant="primary" size="lg">{pv.dashboardCta}</Button>
            </Link>
            <Link href="/">
              <Button variant="secondary" size="lg">{pv.homeCta}</Button>
            </Link>
          </div>
        </>
      ) : (
        <>
          <XCircle className="w-16 h-16 text-red-500 mb-6" />
          <h1 className="text-3xl font-black mb-4 text-white">{pv.issueTitle}</h1>
          <p className="text-muted mb-8 max-w-md">{message}</p>
          <div className="flex flex-col sm:flex-row gap-4">
            <Link href="/contact-us">
              <Button variant="primary" size="lg">{pv.supportCta}</Button>
            </Link>
            <Link href="/">
              <Button variant="secondary" size="lg">{pv.homeCta}</Button>
            </Link>
          </div>
        </>
      )}
    </div>
  );
}

export default function PaymentVerifyPage() {
  return (
    <Suspense
      fallback={
        <div className="flex items-center justify-center py-32">
          <Spinner size="lg" />
        </div>
      }
    >
      <PaymentVerifyContent />
    </Suspense>
  );
}
