import Link from "next/link";
import { PodName } from "@/components/pod-name";

export function Hero() {
  return <section className="pod-hero container" aria-labelledby="hero-title">
    <p className="overline"><span className="status-dot" /> Platform engineer</p>
    <PodName>
      <h1 id="hero-title" className="pod-title"><span className="sr-only">Jack Devlin. </span>I build what a software team <em>ships on.</em></h1>
      <div className="pod-copy-row"><p className="hero-description">Three years at Loweconex, a UK IoT business. Shared pipelines, monitoring, a release dashboard, and lately the AI services on top.</p>
      <div className="hero-actions"><a href="#selected-work" className="button-primary">See the work <span aria-hidden>↘</span></a><Link href="/about" className="text-link">About me <span aria-hidden>↗</span></Link><a href="/cv.pdf" download="jack-devlin-cv.pdf" className="text-link">CV (PDF) <span aria-hidden>↓</span></a></div>
      </div>
      <p className="hero-footnote"><span>Northern Ireland</span><span>MSc AI, Distinction</span><span>No sponsorship needed</span></p>
    </PodName>
  </section>;
}
