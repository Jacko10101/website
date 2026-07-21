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
