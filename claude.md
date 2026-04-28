# DevlinOps Portfolio Website — Build Log

**Owner**: Jack Devlin (jack@devlinops.com)
**Live**: https://devlinops.com
**Repo**: https://github.com/Jacko10101/website
**Status**: Live in production, ongoing work to showcase Heimdall as the lead project for the 2026 job search.

---

## Why this site exists

Portfolio + case studies for platform / SRE / DevOps roles. Aimed at hiring managers and engineers who can recognise good systems-design choices in 90 seconds of skimming.

The site itself is intended to demonstrate the discipline it advertises:
- The "site compiles" intro literally shows a build pipeline.
- The 404 is a crashed pod with live restart counters.
- The footer surfaces commit hash, build time, uptime.
- Pressing `/` opens a CLI navigator. Konami code triggers Matrix rain.

---

## Lead project: Heimdall

`/projects/dora-devex` is the Heimdall case study (URL kept for sitemap stability — internal page id is still `dora-devex`).

**What it is**: A Python/Flask SRE dashboard stitching GitOps, ArgoCD, Thanos, Bitbucket, JIRA and Sentry into one answer to "where is my ticket right now?". Used daily by 20+ engineers across 17 services.

**The case study covers**:
1. Why it exists (one question, twenty places to look)
2. Six-screen product tour (real screenshots in `public/heimdall/`)
3. Architecture — one writer, sixteen readers (`components/heimdall-architecture.tsx`)
4. Concurrency: snapshot pattern + GIL-atomic pointer swap with code excerpt
5. Failure detection: six classes the pod-level classifier recognises
6. Data layer: zero-downtime JSONL → TimescaleDB migration behind a flag
7. Operability: one-curl health check, two-layer config, runbook
8. Impact stats and lessons

**Source material** lives in Heimdall's own README + `docs/ARCHITECTURE.md` — the case study is grounded in those, not invented.

---

## Other case studies

- `/projects/cicd-gitops` — GitOps pipeline platform. ~~Originally referenced bash reporter + deployment gates as separate things; those are now folded into the standardised pipelines architecture and need a refresh.~~ **TODO: rewrite with current pipeline architecture.**
- `/projects/observability` — self-hosted Prometheus/Grafana/Loki stack.

---

## Tech stack

- Next.js 16.x (App Router, Turbopack)
- React 19, TypeScript strict
- Tailwind CSS 4
- Framer Motion (only animation library — no GSAP/Lenis/Three.js)
- Dark mode only (forced theme)
- Static export, deployed on Vercel

---

## Local development

```bash
cd /Users/jackdevlin/personal/website
npm install      # uses .npmrc → public registry, NOT work CodeArtifact
npm run dev      # http://localhost:3000
npm run build    # production build, all pages prerender static
```

**Important**: there's a `~/.npmrc` from work pointing at AWS CodeArtifact. The project-level `.npmrc` overrides it back to the public registry. Don't delete `.npmrc`.

The dev server uses Turbopack. `next.config.ts` sets `turbopack.root = path.resolve(__dirname)` to silence the "multiple lockfiles" warning caused by an unrelated `~/package-lock.json`.

### Re-running the build sequence

```javascript
// Browser console
localStorage.removeItem("build-seen")
// Then refresh
```

---

## File structure

```
website/
├── app/
│   ├── layout.tsx              Root layout, metadata
│   ├── page.tsx                Homepage
│   ├── template.tsx            Page transitions
│   ├── not-found.tsx           Crashed-pod 404
│   ├── globals.css             Global styles + noise texture
│   ├── about/page.tsx
│   ├── contact/page.tsx
│   └── projects/
│       ├── page.tsx
│       ├── cicd-gitops/page.tsx
│       ├── dora-devex/page.tsx       ← Heimdall case study
│       └── observability/page.tsx
├── components/
│   ├── build-sequence.tsx           "Site compiles" intro
│   ├── hero-journey.tsx             Hero orchestration
│   ├── navigation.tsx
│   ├── footer.tsx                   Commit / load time / uptime
│   ├── cli-navigation.tsx           Press `/`
│   ├── konami-code.tsx              Matrix rain
│   ├── case-study-layout.tsx        Hero, sections, sidebar, CTA
│   ├── heimdall-architecture.tsx    Heimdall topology SVG (replaces dora-architecture)
│   ├── cicd-architecture.tsx
│   ├── observability-architecture.tsx
│   ├── featured-projects.tsx        Homepage projects (Heimdall first)
│   ├── what-i-do.tsx                Skills grid
│   ├── scroll-reveal.tsx            FadeUp / Stagger / GlassCard
│   ├── code-snippet.tsx
│   └── ...
├── public/
│   ├── heimdall/                    Six product screenshots
│   ├── dashboards/                  Grafana screenshots
│   └── ...
├── .npmrc                           Public registry override
├── next.config.ts                   Security headers + turbopack root
└── CLAUDE.md
```

---

## Editorial principles

1. **British English** — "optimise", "behaviour", "centralised".
2. **No corporate speak** — "Helping early-stage companies scale their infrastructure" is banned. Lead with concrete things: 17 services, 20+ engineers, single-thread collector.
3. **Pull from primary sources** — Heimdall case study borrows voice from its own README. Don't invent metrics; if it isn't in the README/architecture doc, it isn't on the page.
4. **One claim per sentence** — case study writing should read like the README does, not like a CV bullet point.
5. **No fake terminal mockups** when real screenshots exist. The DORA case study used to render a fake Teams notification in HTML — don't reintroduce that pattern.

---

## Roadmap

- [x] Phase 0: Heimdall screenshots + case study rewrite + featured-projects reorder + about-page 2026 update + hero refresh
- [ ] Phase 1: refresh `/projects/cicd-gitops` for the standardised pipelines architecture (bash reporter and gates moved in there)
- [ ] Phase 2: public sanitised Heimdall demo at `heimdall.devlinops.com` (likely static-export Jinja from `make dev-ui` fixtures)
- [ ] Phase 3: hero positioning round 2 — depending on the kind of role I'm closing in on
