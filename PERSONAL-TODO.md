# Things only Jack can fill in

Everything below is wired into the site already — each item renders the moment
you supply it, and shows nothing until then. No placeholders appear anywhere.

## 1. Real photo — `public/jack-photo.jpg` ✅ done (16 Aug 2026)
You supplied a portrait; it's cropped square, resized to 800px and live on the
About page with the CRT treatment. If you want a different framing, drop a new
image in and say so.

## 2. Testimonial — `lib/profile.ts` → `testimonial` ← still the biggest gap
One quoted line from an EM, tech lead or teammate, with an attribution
(anonymised company is fine: "Engineering Manager, a UK IoT company").
This is the single highest-impact addition for hiring. Renders as a
full-width quote block on the homepage.

## 3. MSc result — `lib/profile.ts` → `msc.result` ✅ set to "Distinction"
Set on your instruction (31 Jul 2026). It renders in the hero, the ticker and
the CLI `whoami`. If the final result lands differently, change that one field
and every mention follows. Note your CV still says "on track for Distinction" —
worth deciding whether the two should match.

## 4. Case-study context — `lib/projects.ts` → each `context` field ✅ done
Every project now carries a role · setting line. Optional extra: team size
("… · platform team of 3") if you're comfortable naming it.

## 5. Visa / right-to-work note — `lib/profile.ts` → `visaNote` ✅ done
Set, and as of 16 Aug 2026 the Irish + British work-rights position also
renders in the hero's looking-for block and the CLI `whoami`.

## 6. Where is the site hosted? ← still open
Tell Claude the hosting setup (Vercel? Cloudflare? A VPS?) and the deploy
provenance in the footer can link to the real CI run, plus the colophon can
describe the actual pipeline. Also: the CLI's `neofetch` currently claims
"Host: Vercel" — correct it if that's wrong.

## 7. Numbers drift ✅ resolved
Verified 16 Aug 2026: the estate reads "20 services" (or "twenty") everywhere;
no "couple dozen" phrasing remains. Engineers are consistently "20+", which is
a different count and fine.

## 8. Clarity screenshots ✅ done — four are live
`answer-with-sql`, `estate-briefing`, `report-export` and `dashboard-from-chat`
render inline as receipts on /projects/clarity. Still worth capturing if you
get the chance (in value order from the original list):

1. **A caught fabrication.** A `chat_audit` row (or the Grafana panel) where
   `fabricated_names` is non-empty and the regenerate resolved it — it would
   close the one claim the ledger leaves open.
2. **The grounding Grafana panel.** `clarity.grounding.violations` by type over
   time. Turns the claim into a measurement.
3. **The schema-intelligence directory.** A compiled-doc slice showing business
   summaries and the `(no new data since …)` freshness marks.

**Redact before exporting**: tenant and customer names (the site never names the
employer's customers), real site IDs, usernames and email addresses, any
hostname containing the company domain, and account IDs.

## 9. Availability said "available now" until 16 Aug 2026 — sanity-check the new facts
The site now states: available from October 2026 · platform engineering, DevEx,
observability, AI infrastructure · Dublin, London, Amsterdam or remote-first
EU · Irish and British citizen, no sponsorship. If any of that is off, the
availability block lives in `lib/profile.ts` and everything follows from it.
