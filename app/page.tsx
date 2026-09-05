import { Hero } from "@/components/hero";
import { CaseIndex } from "@/components/case-index";
import { ContactCTA } from "@/components/contact-cta";
import { TestimonialBlock } from "@/components/testimonial";

/**
 * A reader gives this page about forty seconds. It gets one claim, one
 * moving object, the proof, and the work as an index, in that order.
 *
 * What used to sit here and doesn't now: a ticker restating the tiles, a
 * pipeline scroll scene that was a generic GitOps explainer with two
 * invented specifics in it, and six identical cards. The career query is on
 * /lab. The capability manifest's content lives in About's stack.
 */
export default function Home() {
  return (
    <>
      <Hero />
      <CaseIndex />
      <TestimonialBlock />
      <ContactCTA />
    </>
  );
}
