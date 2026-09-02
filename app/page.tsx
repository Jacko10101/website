import { Hero } from "@/components/hero";
import { StatusTicker } from "@/components/status-ticker";
import { PipelineStory, PipelineStoryMobile } from "@/components/pipeline-story";
import { FeaturedProjects } from "@/components/featured-projects";
import { ContactCTA } from "@/components/contact-cta";
import { TestimonialBlock } from "@/components/testimonial";

/**
 * A reader gives this page about forty seconds. It gets one claim, the work,
 * and how the work ships, in that order, with nothing competing for the first
 * screen.
 *
 * The career query used to sit between the hero and the case studies: the
 * best artefact on the site, asking for a commitment two hundred pixels below
 * the name. It now lives on /playground, which is where someone who wants to
 * poke at the thing has already decided to go.
 *
 * There was a capability manifest after the pipeline scene. It restated the
 * six tiles above it, and /about's tech stack already splits the same ground
 * into run-in-production, homelab and working-knowledge, so it went.
 */
export default function Home() {
  return (
    <>
      <Hero />
      <StatusTicker />
      <FeaturedProjects />
      <PipelineStory />
      <PipelineStoryMobile />
      <TestimonialBlock />
      <ContactCTA />
    </>
  );
}
