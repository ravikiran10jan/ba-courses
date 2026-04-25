"use client";

import { useEffect, useState } from "react";
import DataTable from "@/components/admin/DataTable";
import StatusBadge from "@/components/admin/StatusBadge";
import Spinner from "@/components/ui/Spinner";
import { getAdmin } from "@/lib/content";

const ap = getAdmin().payments;

interface PaymentRow {
  id: string;
  userId: string;
  courseTitle: string;
  amount: number;
  status: string;
  createdAt: string;
  [key: string]: unknown;
}

const STATUS_OPTIONS = ["ALL", "COMPLETED", "PENDING", "FAILED", "REFUNDED"];

export default function AdminPaymentsPage() {
  const [payments, setPayments] = useState<PaymentRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState("ALL");

  useEffect(() => {
    fetchPayments();
  }, []);

  async function fetchPayments() {
    try {
      // In production, this would fetch from a dedicated admin payments endpoint
      // For now, we initialize with an empty array - the admin can see payments as they come in
      setPayments([]);
    } catch (error) {
      console.error("Error fetching payments:", error);
    } finally {
      setLoading(false);
    }
  }

  const filteredPayments =
    statusFilter === "ALL"
      ? payments
      : payments.filter((p) => p.status === statusFilter);

  const columns = [
    {
      key: "userId",
      label: ap.studentColumn,
      render: (item: PaymentRow) => (
        <span className="text-white text-sm">{item.userId}</span>
      ),
    },
    {
      key: "courseTitle",
      label: ap.courseColumn,
      render: (item: PaymentRow) => (
        <span className="text-white font-medium text-sm">
          {item.courseTitle}
        </span>
      ),
    },
    {
      key: "amount",
      label: ap.amountColumn,
      render: (item: PaymentRow) => (
        <span className="text-white font-semibold">
          ₹{item.amount?.toLocaleString() ?? "0"}
        </span>
      ),
    },
    {
      key: "createdAt",
      label: ap.dateColumn,
      render: (item: PaymentRow) => (
        <span className="text-[#999999] text-sm">
          {item.createdAt
            ? new Date(item.createdAt).toLocaleDateString()
            : "-"}
        </span>
      ),
    },
    {
      key: "status",
      label: ap.statusColumn,
      render: (item: PaymentRow) => <StatusBadge status={item.status} />,
    },
  ];

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Spinner size="lg" />
      </div>
    );
  }

  return (
    <div>
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8">
        <h1 className="text-2xl font-bold text-white">Payments</h1>
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="bg-[#0f172a] border border-[#334155] rounded-lg px-4 py-2 text-white text-sm focus:outline-none focus:ring-2 focus:ring-[#FF1493]/50 focus:border-[#FF1493] transition-colors"
        >
          {STATUS_OPTIONS.map((status) => (
            <option key={status} value={status}>
              {status === "ALL" ? ap.allStatuses : status}
            </option>
          ))}
        </select>
      </div>

      <DataTable
        columns={columns}
        data={filteredPayments}
        searchable
        searchPlaceholder={ap.searchPlaceholder}
      />
    </div>
  );
}
