import type { Metadata } from "next";
import EnterpriseHero from "@/components/enterprise/EnterpriseHero";
import TrustedPartners from "@/components/enterprise/TrustedPartners";
import DepartmentGrid from "@/components/enterprise/DepartmentGrid";
import TestimonialCarousel from "@/components/enterprise/TestimonialCarousel";
import EnterpriseFAQ from "@/components/enterprise/EnterpriseFAQ";
import { getEnterprise } from "@/lib/content";

const ent = getEnterprise();

export const metadata: Metadata = {
  title: "Enterprise",
  description: ent.pageDescription,
};

export default function EnterprisePage() {
  return (
    <>
      <EnterpriseHero />
      <TrustedPartners />
      <DepartmentGrid />
      <TestimonialCarousel />
      <EnterpriseFAQ />
    </>
  );
}
