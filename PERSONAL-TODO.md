# Things only Jack can fill in

Everything below is wired into the site already — each item renders the moment
you supply it, and shows nothing until then. No placeholders appear anywhere.

## 1. Real photo — `public/jack-photo.jpg`
Currently a generic avatar. Drop any decent photo of yourself over it (square-ish
crop works best). The About page applies the green CRT treatment automatically,
so almost any photo will sit well in the design.

## 2. Testimonial — `lib/profile.ts` → `testimonial`
One quoted line from an EM, tech lead or teammate, with an attribution
(anonymised company is fine: "Engineering Manager, a UK IoT company").
This is the single highest-impact addition for hiring. Renders as a
full-width quote block on the homepage.

## 3. MSc result — `lib/profile.ts` → `msc.result`
When it's confirmed (e.g. `"Distinction"`), set it and it appears in the hero
automatically. Leave `null` until it's real — the site's rule is that nothing
unverified gets shown.

## 4. Case-study context — `lib/projects.ts` → each `context` field
One line per project: role · duration · setting.
Example: `"Sole platform engineer · 8 months · UK IoT scale-up"`.
Renders under the subtitle on the homepage tiles and the projects page.
This is the first thing a hiring manager wants and only you know it.

## 5. Visa / right-to-work note — `lib/profile.ts` → `visaNote`
If you want to say something about your right-to-work or visa position for a
target country (e.g. Australia), one plain sentence here renders on /contact.
Only state what's actually true for you.

## 6. Where is the site hosted?
Tell Claude the hosting setup (Vercel? Cloudflare? A VPS?) and the deploy
provenance in the footer can link to the real CI run, plus the colophon can
describe the actual pipeline. Also: the CLI's `neofetch` currently claims
"Host: Vercel" — correct it if that's wrong.

## 7. Numbers drift (2 minutes)
The estate is described as "20", "20+" and "a couple dozen" services in
different places (about page, projects data). Pick one phrasing and Claude can
sweep it everywhere.

## 8. Clarity screenshots — the biggest single lift available
`/projects/clarity` is the strongest thing on the site and currently has no
images. Heimdall has five; the gap shows. Drop PNGs in `public/clarity/` and add
entries to the `SHOTS` array at the top of `app/projects/clarity/page.tsx`. The
section renders itself once the array is non-empty and stays hidden until then.

Worth capturing, roughly in value order:

1. **An answer with its SQL showing.** The single most persuasive image on the
   whole site: a real question, a real answer, and the verbatim query underneath
   it. This is the thing everyone else's AI portfolio can't show.
2. **A caught fabrication.** A `chat_audit` row (or the Grafana panel) where
   `fabricated_names` is non-empty and the regenerate resolved it. Proof the
   detectors fire on real traffic rather than in my demo.
3. **The grounding Grafana panel.** `clarity.grounding.violations` by type over
   time, plus `grounding.regenerate` resolved vs unresolved. Turns the claim
   into a measurement.
4. **The schema-intelligence directory.** A slice of a compiled doc showing the
   business summaries and the `(no new data since …)` freshness marks. Makes the
   KAG argument concrete.
5. **A dashboard the AI built.** Shows it as a product, not a chat toy.

**Redact before exporting**: tenant and customer names (the site never names the
employer or its customers), real site IDs, usernames and email addresses, any
hostname containing the company domain, and account IDs. Rename tenants to
something neutral if they appear in a schema path.
