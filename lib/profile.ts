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
    from: "September 2026",
    /** One-liner used in the footer, ticker and CTA. */
    short: "Available from September 2026 · contract or full-time · remote-first",
    /** Fuller status line used in the hero. */
    status:
      "UK-based · remote-first, open to relocation · contract or full-time · from September 2026",
  },

  msc: {
    label: "MSc AI",
    finishes: "August 2026",
    // TODO(jack): set when confirmed, e.g. "Distinction" — it will appear in
    // the hero and About automatically. Leave null until it's real.
    result: null as string | null,
  },

  // TODO(jack): one quoted line from an EM or teammate transforms the site.
  // e.g. { quote: "…", attribution: "Engineering Manager, a UK IoT company" }
  testimonial: null as Testimonial | null,

  // TODO(jack): if you want to state right-to-work/visa position for a target
  // country, put one plain sentence here and it renders on /contact.
  // e.g. "I hold a UK passport and am eligible for [visa] in Australia."
  visaNote: null as string | null,
};
