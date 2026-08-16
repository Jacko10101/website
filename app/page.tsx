import { Hero } from "@/components/hero";
import { StatusTicker } from "@/components/status-ticker";
import { CareerQuerySection } from "@/components/career-query";
import { PipelineStory, PipelineStoryMobile } from "@/components/pipeline-story";
import { SystemMap } from "@/components/system-map";
import { FeaturedProjects } from "@/components/featured-projects";
import { ContactCTA } from "@/components/contact-cta";
import { TestimonialBlock } from "@/components/testimonial";

export default function Home() {
  return (
    <>
      {/* One focal point at the top: who Jack is and what he's looking for.
          The career query follows immediately behind its own invitation. */}
      <Hero />
      <StatusTicker />
      <CareerQuerySection />
      <FeaturedProjects />
      <PipelineStory />
      <PipelineStoryMobile />
      <SystemMap />
      <TestimonialBlock />
      <ContactCTA />
    </>
  );
}
