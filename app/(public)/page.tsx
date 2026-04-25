import HeroSection from "@/components/home/HeroSection";
import MarketDemand from "@/components/home/MarketDemand";
import CourseGrid from "@/components/home/CourseGrid";
import CurriculumPreview from "@/components/home/CurriculumPreview";
import WhatYouGetSection from "@/components/home/WhatYouGetSection";
import TrustBadges from "@/components/home/TrustBadges";
import StatsSection from "@/components/home/StatsSection";
import PartnersSection from "@/components/home/PartnersSection";
import TestimonialsSection from "@/components/home/TestimonialsSection";
import MentorsSection from "@/components/home/MentorsSection";

export default function HomePage() {
  return (
    <>
      <HeroSection />
      <MarketDemand />
      <CourseGrid />
      <CurriculumPreview />
      <PartnersSection />
      <WhatYouGetSection />
      <TrustBadges />
      <TestimonialsSection />
      <MentorsSection />
      <StatsSection />
    </>
  );
}
