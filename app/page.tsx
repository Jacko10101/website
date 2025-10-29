import { Hero } from "@/components/hero";
import { Services } from "@/components/services";
import { TechStack } from "@/components/tech-stack";
import { ProjectsPreview } from "@/components/projects-preview";
import { CTA } from "@/components/cta";

export default function Home() {
  return (
    <>
      <Hero />
      <Services />
      <TechStack />
      <ProjectsPreview />
      <CTA />
    </>
  );
}
