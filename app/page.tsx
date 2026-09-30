import { Hero } from "@/components/hero";
import { LandingWork, LandingAfterHours, LandingContact } from "@/components/landing-sections";
import { TestimonialBlock } from "@/components/testimonial";

export default function Home() {
  return (
    <div className="landing-page">
      <Hero />
      <LandingWork />
      <LandingAfterHours />
      <TestimonialBlock />
      <LandingContact />
    </div>
  );
}
