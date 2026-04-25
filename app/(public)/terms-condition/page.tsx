import type { Metadata } from "next";
import LegalPageLayout from "@/components/layout/LegalPageLayout";
import { getLegal } from "@/lib/content";

const legal = getLegal();

export const metadata: Metadata = {
  title: legal.terms.title,
  description: `${legal.terms.title} for BA Courses platform.`,
};

export default function TermsConditionPage() {
  return <LegalPageLayout policyKey="terms" />;
}
