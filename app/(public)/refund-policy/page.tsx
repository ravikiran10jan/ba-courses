import type { Metadata } from "next";
import LegalPageLayout from "@/components/layout/LegalPageLayout";
import { getLegal } from "@/lib/content";

const legal = getLegal();

export const metadata: Metadata = {
  title: legal.refund.title,
  description: `${legal.refund.title} for BA Courses platform.`,
};

export default function RefundPolicyPage() {
  return <LegalPageLayout policyKey="refund" />;
}
