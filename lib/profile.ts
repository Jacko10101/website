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
    from: "October 2026",
    /** One-liner used in the footer, ticker and CTA. */
    short: "Available from October 2026 · permanent or contract · remote-first",
    /** Fuller status line used in the hero. */
    status:
      "UK-based · remote-first, open to relocation · permanent or contract · from October 2026",
  },

  msc: {
    label: "MSc AI",
    finishes: "September 2026",
    // TODO(jack): set when confirmed, e.g. "Distinction" — it will appear in
    // the hero and About automatically. Leave null until it's real.
    result: null as string | null,
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
