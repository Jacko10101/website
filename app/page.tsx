import { Hero } from "@/components/hero";
import { StatusTicker } from "@/components/status-ticker";
import { CareerQuery } from "@/components/career-query";
import { SectionHeading } from "@/components/section-heading";
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

      {/* The site answering questions about itself the way Clarity answers
          questions about a database: never a number without the query. */}
      <section className="container px-4 py-20 md:py-24">
        <div className="max-w-3xl">
          <SectionHeading
            command="psql devlinops -c 'ask me anything'"
            title="Don't take my word for any of it"
            lede="My day job is an AI that answers questions about a database and shows you the SQL, so you can check it rather than trust it. This is that, pointed at my own work — real SQLite, running in your browser. Pick a question, read the query, then edit it and run your own."
          />
        </div>
        <div className="mt-8 max-w-6xl">
          <CareerQuery />
        </div>
      </section>
      <PipelineStory />
      <PipelineStoryMobile />
      <SystemMap />
      <FeaturedProjects />
      <TestimonialBlock />
      <ContactCTA />
    </>
  );
}
