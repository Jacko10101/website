import { Hero } from "@/components/hero";
import { StatusTicker } from "@/components/status-ticker";
import { PipelineStory, PipelineStoryMobile } from "@/components/pipeline-story";
import { SystemMap } from "@/components/system-map";
import { FeaturedProjects } from "@/components/featured-projects";
import { ContactCTA } from "@/components/contact-cta";
import { TestimonialBlock } from "@/components/testimonial";

export default function Home() {
  return (
    <>
      <Hero />
      <StatusTicker />
      <PipelineStory />
      <PipelineStoryMobile />
      <SystemMap />
      <FeaturedProjects />
      <TestimonialBlock />
      <ContactCTA />
    </>
  );
}
