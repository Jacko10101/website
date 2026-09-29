import Link from "next/link";
import { ProjectCover } from "@/components/project-cover";

export function Hero() {
  return <section className="new-hero container" aria-labelledby="hero-title">
    <div className="hero-intro">
      <p className="overline"><span className="status-dot" /> Jack Devlin · Platform engineer</p>
      <h1 id="hero-title">I build what<br />a software team<br /><em>ships on.</em></h1>
      <p className="hero-description">Three years at Loweconex, a UK IoT business. Shared pipelines, monitoring, a release dashboard, and lately the AI services on top.</p>
      <div className="hero-actions"><a href="#selected-work" className="button-primary">See the work <span aria-hidden>↘</span></a><Link href="/about" className="text-link">About me <span aria-hidden>↗</span></Link><a href="/cv.pdf" download="jack-devlin-cv.pdf" className="text-link">CV (PDF) <span aria-hidden>↓</span></a></div>
      <p className="hero-footnote"><span>Northern Ireland</span><span>MSc AI, Distinction</span><span>No sponsorship needed</span></p>
    </div>
    <div className="hero-instrument"><Link href="/projects/heimdall" className="work-art hero-shot" aria-label="Read the Heimdall case study"><ProjectCover id="heimdall" /><span className="art-arrow" aria-hidden>↗</span></Link><p className="hero-shot-caption"><span>Heimdall, the release dashboard I built and run.</span><span>Standup runs off it.</span></p></div>
  </section>;
}
