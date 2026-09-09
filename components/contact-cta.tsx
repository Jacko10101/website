import Link from "next/link";
import { profile } from "@/lib/profile";

export function ContactCTA({
  title = "Let’s talk.",
  lede = "If you need someone to build and run your platform, I’d like to hear what you’re working on.",
}: { title?: string; lede?: string }) {
  return (
    <section className="contact-signoff">
      <div className="container">
        <div className="signoff-top"><span className="folio-label">Have something in mind?</span><span className="folio-label">{profile.availability.short}</span></div>
        <div className="signoff-main">
          <h2>{title}</h2>
          <div><p>{lede}</p><Link href="/contact" className="editorial-link">Get in touch <span aria-hidden>↗</span></Link></div>
        </div>
        <a className="signoff-email" href="mailto:jack@devlinops.com">jack@devlinops.com <span aria-hidden>↗</span></a>
      </div>
    </section>
  );
}
