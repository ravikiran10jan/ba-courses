"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/hooks/useAuth";
import { collection, query, where, getDocs, orderBy } from "firebase/firestore";
import { db } from "@/lib/firebase/client";
import type { Payment } from "@/types";
import { formatCurrency, formatDate } from "@/lib/utils/format";
import Card from "@/components/ui/Card";
import Badge from "@/components/ui/Badge";
import Spinner from "@/components/ui/Spinner";
import { getPaymentHistory } from "@/lib/content";

const ph = getPaymentHistory();

function getStatusColor(status: string): "success" | "warning" | "error" | "default" {
  switch (status) {
    case "COMPLETED":
      return "success";
    case "PENDING":
      return "warning";
    case "FAILED":
      return "error";
    case "REFUNDED":
      return "default";
    default:
      return "default";
  }
}

export default function PaymentHistoryPage() {
  const { user, loading: authLoading } = useAuth();
  const [payments, setPayments] = useState<Payment[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchPayments() {
      if (!user) {
        setLoading(false);
        return;
      }
      try {
        const q = query(
          collection(db, "payments"),
          where("userId", "==", user.uid),
          orderBy("createdAt", "desc")
        );
        const snap = await getDocs(q);
        const data = snap.docs.map(
          (doc) => ({ id: doc.id, ...doc.data() }) as unknown as Payment
        );
        setPayments(data);
      } catch (error) {
        console.error("Failed to fetch payments:", error);
      } finally {
        setLoading(false);
      }
    }

    if (!authLoading) {
      fetchPayments();
    }
  }, [user, authLoading]);

  if (authLoading || loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Spinner size="lg" />
      </div>
    );
  }

  return (
    <div>
      <h1 className="text-3xl font-black mb-8">{ph.heading}</h1>

      {payments.length === 0 ? (
        <div className="text-center py-20">
          <p className="text-muted text-lg">{ph.empty}</p>
        </div>
      ) : (
        <div className="space-y-4">
          {payments.map((payment) => (
            <Card key={payment.id} className="flex flex-col sm:flex-row sm:items-center gap-4">
              <div className="flex-1 min-w-0">
                <h3 className="font-bold text-base truncate">
                  {payment.courseTitle}
                </h3>
                <div className="mt-1">
                  <Badge variant="category">{payment.courseCategory}</Badge>
                </div>
              </div>

              <div className="flex flex-wrap items-center gap-4 sm:gap-6 text-sm">
                <div>
                  <p className="text-muted text-xs">{ph.priceLabel}</p>
                  <p className="font-bold">{formatCurrency(payment.amount)}</p>
                </div>

                <div>
                  <p className="text-muted text-xs">{ph.dateLabel}</p>
                  <p className="font-medium">
                    {formatDate(payment.createdAt)}
                  </p>
                </div>

                <div>
                  <p className="text-muted text-xs">{ph.statusLabel}</p>
                  <Badge variant="status" color={getStatusColor(payment.status)}>
                    {payment.status}
                  </Badge>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
