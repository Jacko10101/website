import type { Metadata } from "next";
import { ContactForm } from "@/components/contact-form";
import { profile } from "@/lib/profile";

export const metadata: Metadata = {
  alternates: { canonical: "/contact" }, title: "Contact",
  description: `Get in touch with Jack Devlin. ${profile.availability.sentence}`,
  openGraph: { title: "Contact · Jack Devlin", description: `Get in touch. ${profile.availability.sentence}`, url: "/contact" },
};

export default function ContactPage() {
  return (
    <div className="folio-surface">
      <div className="container interior-page contact-page">
        <div className="folio-line"><span>Contact</span><span>Jack Devlin / Northern Ireland</span></div>
        <h1 className="interior-title">What are you<br /><em>working on?</em></h1>
        <div className="contact-opening">
          <div>
            <p className="interior-lede">Get in touch about a role, a project, or a question about the work here.</p>
            <a className="contact-address" href="mailto:jack@devlinops.com">jack@devlinops.com <span aria-hidden>↗</span></a>
          </div>
          <dl className="contact-facts">
            <div><dt>Availability</dt><dd>{profile.availability.status}</dd></div>
            <div><dt>Location</dt><dd>{profile.lookingFor.locations}</dd></div>
            <div><dt>Work rights</dt><dd>{profile.lookingFor.workRights}</dd></div>
          </dl>
        </div>
        {process.env.NEXT_PUBLIC_WEB3FORMS_KEY && <section className="contact-form-section"><div><p className="folio-label">Or write here</p><h2 className="ledger-heading mt-5">Or leave<br />a note</h2></div><ContactForm /></section>}
        <div className="contact-other-links">
          <a href="/cv.pdf" download="jack-devlin-cv.pdf"><span className="folio-label">Background</span><span>Download my CV <span aria-hidden>↓</span></span></a>
          <a href="https://github.com/Jacko10101" target="_blank" rel="noopener noreferrer"><span className="folio-label">Source</span><span>Find me on GitHub <span aria-hidden>↗</span></span></a>
        </div>
      </div>
    </div>
  );
}
