import { Hero } from "@/components/hero";
import { Services } from "@/components/services";
import { ProjectsPreview } from "@/components/projects-preview";
import { CTA } from "@/components/cta";

export default function Home() {
  return (
    <>
      <Hero />
      <Services />
      <ProjectsPreview />
      <CTA />
    </>
  );
}
