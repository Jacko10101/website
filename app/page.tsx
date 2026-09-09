import { HomeLab } from "@/components/home-lab";
import { Hero } from "@/components/hero";
import { CaseIndex } from "@/components/case-index";
import { ContactCTA } from "@/components/contact-cta";
import { TestimonialBlock } from "@/components/testimonial";

export default function Home() {
  return (
    <div className="folio-surface home-page">
      <Hero />
      <CaseIndex />
      <HomeLab />
      <TestimonialBlock />
      <ContactCTA />
    </div>
  );
}
