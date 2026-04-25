import type { Metadata } from "next";
import LegalPageLayout from "@/components/layout/LegalPageLayout";
import { getLegal } from "@/lib/content";

const legal = getLegal();

export const metadata: Metadata = {
  title: legal.privacy.title,
  description: `${legal.privacy.title} for BA Courses platform.`,
};

export default function PrivacyPolicyPage() {
  return <LegalPageLayout policyKey="privacy" />;
}
