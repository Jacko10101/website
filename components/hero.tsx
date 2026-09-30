import Link from "next/link";
import { PlatformSculpture } from "@/components/platform-sculpture";

export function Hero() {
  return (
    <section className="landing-hero landing-container" aria-labelledby="hero-title">
      <div className="landing-hero-top">
        <p className="landing-label">Platform engineer <span>/</span> Northern Ireland</p>
        <Link href="/contact" className="landing-availability"><span /> Open to a conversation <span aria-hidden>↗</span></Link>
      </div>
      <div className="landing-hero-grid">
        <div className="landing-hero-copy">
          <h1 id="hero-title">Good software.<br /><em>Solid ground.</em><span className="hero-full-stop" aria-hidden>✳</span></h1>
          <p className="landing-intro">I’m Jack, a platform engineer at Loweconex. I build and run our delivery pipelines, monitoring and developer tools, alongside AI services for customers and engineers.</p>
          <div className="landing-actions">
            <a href="#selected-work" className="landing-button">Explore my work <span aria-hidden>↘</span></a>
            <Link href="/about" className="landing-text-link">A little about me <span aria-hidden>↗</span></Link>
          </div>
          <div className="landing-hero-note"><span className="landing-note-rule" /><p>Three years at Loweconex.<br />Building and running the platform.</p></div>
        </div>
        <PlatformSculpture />
      </div>
      <div className="landing-proof">
        <p className="landing-label">The work<br /><span>at a glance.</span></p>
        <Link href="/projects/pipeline-platform"><strong>25</strong><span>services on shared pipelines</span></Link>
        <Link href="/projects/heimdall"><strong>4</strong><span>environments in one view</span></Link>
        <Link href="/projects/ml-scheduler"><strong>MSc AI <span>↗</span></strong><span>Completed with Distinction</span></Link>
        <a href="/cv.pdf" download="jack-devlin-cv.pdf" className="landing-cv">My background <span>CV / PDF <span aria-hidden>↓</span></span></a>
      </div>
    </section>
  );
}
