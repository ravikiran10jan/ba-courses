import type { Metadata } from "next";
import LegalPageLayout from "@/components/layout/LegalPageLayout";
import { getLegal } from "@/lib/content";

const legal = getLegal();

export const metadata: Metadata = {
  title: legal.shipping.title,
  description: `${legal.shipping.title} for BA Courses platform.`,
};

export default function ShippingPolicyPage() {
  return <LegalPageLayout policyKey="shipping" />;
}
