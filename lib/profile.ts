/**
 * Personal facts that only Jack can supply, in one place.
 * Anything set to `null` simply doesn't render — the site never shows a
 * placeholder. Fill these in as they become real; each is marked TODO(jack).
 */

export interface Testimonial {
  quote: string;
  /** e.g. "Engineering Manager, [company or 'a UK IoT company']" */
  attribution: string;
}

export const profile = {
  availability: {
    /** Short badge text — footer photo caption, ticker, OG images. */
    from: "available now",
    /** One-liner used in the footer, ticker and CTA. */
    short: "Available now · permanent or contract",
    /** Fuller status line used in the hero. */
    status: "Available now · permanent or contract",
    /** Sentence form, for prose and meta descriptions. */
    sentence:
      "Available now, permanent or contract, remote-first and open to relocating.",
  },

  // What I'm actually looking for, stated so a recruiter doesn't have to
  // infer it. Rendered as the hero's status block and reused wherever the
  // question comes up.
  lookingFor: {
    roles:
      "Platform engineering · developer experience · observability · AI infrastructure",
    locations: "Remote-first · open to relocating",
    /** The differentiator: no sponsorship question anywhere I'm applying. */
    workRights:
      "Irish and British citizen — full right to work in Ireland, the UK and the EU, no sponsorship needed",
  },

  msc: {
    label: "MSc AI",
    status: "submitted September 2026",
    result: "Distinction" as string | null,
  },

  // TODO(jack): one quoted line from an EM or teammate transforms the site.
  // e.g. { quote: "…", attribution: "Engineering Manager, a UK IoT company" }
  testimonial: null as Testimonial | null,

  // Right-to-work position, rendered on /contact. Worth stating plainly: it
  // removes the sponsorship question that filters most UK applicants out of
  // EU roles before anyone reads the CV.
  visaNote:
    "Irish and British citizen. Full right to live and work anywhere in the EU as well as the UK, no sponsorship required." as string | null,
};
