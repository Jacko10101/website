# devlinops.com

[![checks](https://github.com/Jacko10101/website/actions/workflows/checks.yml/badge.svg)](https://github.com/Jacko10101/website/actions/workflows/checks.yml)

Jack Devlin’s platform engineering portfolio: [devlinops.com](https://www.devlinops.com).

## The site

The homepage opens with “Good software. Solid ground.” on a warm paper surface. A custom isometric illustration shows the three layers of the work: infrastructure, the developer platform, and AI services. Visitors can select a layer to find its related case study. Selected projects, experiment previews, and contact details follow.

Eight case studies explain the problem, my contribution, the decisions and the result:

| Route | Project |
| --- | --- |
| `/projects/nightshift` | Engineering automation and a supervised Jira ticket-delivery pilot |
| `/projects/heimdall` | A shared view of tickets, changes and running deployments |
| `/projects/clarity` | Natural-language database insights and downloadable reports |
| `/projects/pipeline-platform` | Shared CI/CD, GitOps integration and post-deploy verification |
| `/projects/observability` | Connected metrics, logs, traces and actionable alerts |
| `/projects/ai-gateway` | Shared model access, workload identity and usage attribution |
| `/projects/ml-scheduler` | MSc research into Kubernetes recovery under limited capacity |
| `/projects/smart-home` | Local home automation on K3s |

The stories distinguish production services, pilot results and research. Metrics describe evidenced scope or recorded experiments; there are no invented time-saving claims. Nightshift’s tested draft delivery is separate from human acceptance and merge. The MSc result is Distinction, completed alongside work.

`/lab` contains the on-call simulator, a map of tools shared across projects, an optional SQLite workbench, a request waterfall recorded by the visitor’s browser, and the former homepage’s interactive Kubernetes name cluster. The on-call game offers untimed practice and a timed shift. Reading evidence is free; decisions affect the budget. Resolved incidents explain the lesson, and the handover includes an expandable debrief. The terminal and incident simulator are also available from any page. Press `/` for the terminal; try `inspect nightshift`, `compare`, `sql` or `oncall`.

## Implementation

Next.js 16 App Router, React 19, TypeScript and Tailwind 4. Content routes are prerendered.

- `lib/case-studies.ts` holds the stories. `lib/projects.ts` derives the registry used by navigation, the sitemap, the terminal and the career database, with separately sourced scope figures.
- `lib/profile.ts` holds availability and personal facts. `lib/experience.ts` feeds About and structured data.
- `components/work-case-study.tsx` supplies the reading layout. Existing project demos retain their own behaviour; Clarity’s examples are selected individually to keep the page readable.
- `components/platform-sculpture.tsx` owns the homepage illustration and layer selection. `components/landing-sections.tsx` supplies the project and experiment previews. Layer motion respects reduced motion. The former homepage cluster lives in `/lab#scheduler`, with pointer and keyboard controls.
- `app/design-system.css` supplies one paper, forest and terracotta theme across every route, with contained forest panels for interactive instruments. `app/landing.css` owns homepage composition; `app/folio.css` and `app/atmosphere.css` supply the inner layouts and instrument artwork. Fonts are Inter, a system serif and JetBrains Mono, with web fonts downloaded at build time and served locally.
- `next.config.ts` captures build provenance and sets security headers. Production CSP allows the SQLite WebAssembly engine without general `unsafe-eval`.
- Vercel deploys on a push to `main`; local edits and previews do not publish.

## Running and checking

```sh
npm ci
npm run dev
npm run typecheck
npm run lint
npm test
npm run build
npm start -- -p 3111
```

Against the running production server:

```sh
npm run check:viewports
npm run check:surfaces
node scripts/review-design.mjs http://localhost:3111
```

Browser scripts use Chrome DevTools Protocol and accept a base URL and `CHROME_PATH`. Viewport checks cover every route at 320, 390, 768, 1024 and 1440 pixels, document status, console errors and mobile navigation. Surface checks exercise the terminal, incident game, SQL workbench, project demos, recorded research, keyboard node failure in the lab, homepage layer selection, and reduced motion. The design script saves desktop and mobile page screenshots to the OS temporary directory.

The contact form requires `NEXT_PUBLIC_WEB3FORMS_KEY`; without it, the contact page offers email. The site otherwise runs without configuration. `npm run build -- --webpack` is available when the local environment requires the alternative compiler.
