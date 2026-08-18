import { Hero } from "@/components/hero";
import { PipelineStory, PipelineStoryMobile } from "@/components/pipeline-story";
import { SystemMap } from "@/components/system-map";
import { FeaturedProjects } from "@/components/featured-projects";
import { ContactCTA } from "@/components/contact-cta";
import { TestimonialBlock } from "@/components/testimonial";

/**
 * A reader gives this page about forty seconds. It gets one claim, the work,
 * how the work ships, and what I can do — in that order, with nothing
 * competing for the first screen.
 *
 * The status ticker and the career query used to sit between the hero and the
 * case studies. The ticker was a marquee of claims substantiated elsewhere,
 * and the query — the best artefact on the site — was asking for a commitment
 * two hundred pixels below the name. It now lives on /playground, which is where
 * someone who wants to poke at the thing has already decided to go.
 */
export default function Home() {
  return (
    <>
      <Hero />
      <FeaturedProjects />
      <PipelineStory />
      <PipelineStoryMobile />
      <SystemMap />
      <TestimonialBlock />
      <ContactCTA />
    </>
  );
}
