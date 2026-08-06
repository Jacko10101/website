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
      {/* The career query lives inside the hero now — the site's opening move
          is its most differentiated artefact, not a paragraph about it. */}
      <Hero />
      <StatusTicker />
      <FeaturedProjects />
      <PipelineStory />
      <PipelineStoryMobile />
      <SystemMap />
      <TestimonialBlock />
      <ContactCTA />
    </>
  );
}
