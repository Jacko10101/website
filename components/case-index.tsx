import { TransitionLink as Link } from "@/components/view-transition";
import Image from "next/image";
import { WorkPreview } from "@/components/work-preview";

export function CaseIndex() {
  return (
    <section id="selected-work" className="selected-work container">
      <div className="section-masthead">
        <h2 className="editorial-heading">An answer needs<br /><span>evidence.</span></h2>
        <p className="folio-label">02 / AI infrastructure</p>
      </div>

      <article className="feature-story clarity-story">
        <div className="story-margin"><span className="folio-label">Clarity / Loweconex</span></div>
        <div className="story-body clarity-layout">
          <div className="clarity-copy">
            <Link href="/projects/clarity" className="story-title-link"><h3 className="story-title" style={{ viewTransitionName: "title-clarity" }}>Clarity<span aria-hidden>↗</span></h3></Link>
            <p className="story-deck">An answer you can<br className="hidden lg:block" /> check the working for.</p>
            <p className="story-summary">Ask a question in English. Get an answer with the SQL that actually ran.
              I built the infrastructure and trust layer across roughly thirty tenant databases.</p>
            <p className="margin-note">The interesting part is what<br />it refuses to answer.</p>
            <Link href="/projects/clarity" className="editorial-link">Inside Clarity <span aria-hidden>↗</span></Link>
          </div>
          <figure>
            <WorkPreview><Link href="/projects/clarity" className="project-image-link clarity-stage" aria-label="Read how Clarity checks its answers">
              <Image src="/clarity/answer-with-sql.png" alt="Clarity answering a question about sites, with the executed SQL expanded underneath." width={2000} height={1025} sizes="(min-width: 1024px) 55vw, 100vw" className="project-screenshot" />
              <span className="image-open" aria-hidden>Explore Clarity ↗</span>
            </Link></WorkPreview>
            <figcaption className="image-caption">An answer, with its working. Screenshot from the product.</figcaption>
          </figure>
        </div>
      </article>

      <div className="machine-next"><Link href="/projects/ai-gateway">The gateway behind Clarity ↗</Link><Link href="/projects">All seven projects ↗</Link></div>
    </section>
  );
}
