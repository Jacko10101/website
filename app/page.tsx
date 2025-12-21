import { HeroJourney } from "@/components/hero-journey";
import { WhatIDo } from "@/components/what-i-do";
import { FeaturedProjects } from "@/components/featured-projects";
import { CTASection } from "@/components/cta-section";

export default function Home() {
  return (
    <>
      <HeroJourney />
      <WhatIDo />
      <FeaturedProjects />
      <CTASection />
    </>
  );
}
