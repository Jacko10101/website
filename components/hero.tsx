import Link from "next/link";
import { PlatformPlayground } from "@/components/platform-playground";

export function Hero() {
  return <section className="new-hero container" aria-labelledby="hero-title">
    <div className="hero-intro">
      <p className="overline"><span className="status-dot" /> Jack Devlin · Platform engineer</p>
      <h1 id="hero-title">Behind the<br />software.<br /><em>In my element.</em></h1>
      <p className="hero-description">I build platforms that help people ship. Developer tools, reliable infrastructure, and AI that does useful work.</p>
      <div className="hero-actions"><a href="#selected-work" className="button-primary">Step inside <span aria-hidden>↘</span></a><Link href="/about" className="text-link">Meet the engineer <span aria-hidden>↗</span></Link></div>
      <p className="hero-footnote"><span>Northern Ireland</span><span>Building at Loweconex</span></p>
    </div>
    <div className="hero-instrument"><PlatformPlayground /></div>
    <div className="hero-bottom"><span><span className="hero-scroll-mark" aria-hidden>↓</span> A few things I’ve made. A few things you can try.</span><a href="/cv.pdf" download="jack-devlin-cv.pdf"><span>The one-page version ↗</span>Download my CV</a></div>
  </section>;
}
