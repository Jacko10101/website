# devlinops.com

[![checks](https://github.com/Jacko10101/website/actions/workflows/checks.yml/badge.svg)](https://github.com/Jacko10101/website/actions/workflows/checks.yml)

Jack Devlin’s platform engineering portfolio: [devlinops.com](https://www.devlinops.com).

## The site

The homepage introduces the work with an interactive delivery example. Visitors can ship a change, give Nightshift a ticket, or ask Clarity a question, then try a failure condition. These are illustrative workflows with sample data, with links to the real projects.

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

`/lab` contains the on-call simulator, a map of tools shared across projects, an optional SQLite workbench and a request waterfall recorded by the visitor’s browser. The on-call game offers untimed practice and a timed shift. Reading evidence is free; decisions affect the budget. Resolved incidents explain the lesson, and the handover includes an expandable debrief. The terminal and incident simulator are also available from any page. Press `/` for the terminal; try `inspect nightshift`, `compare`, `sql` or `oncall`.

## Implementation

Next.js 16 App Router, React 19, TypeScript and Tailwind 4. Content routes are prerendered.

- `lib/case-studies.ts` holds the stories. `lib/projects.ts` derives the registry used by navigation, the sitemap, the terminal and the career database, with separately sourced scope figures.
- `lib/profile.ts` holds availability and personal facts. `lib/experience.ts` feeds About and structured data.
- `components/work-case-study.tsx` supplies the reading layout. Existing project demos retain their own behaviour; Clarity’s examples are selected individually to keep the page readable.
- `components/platform-playground.tsx` owns the homepage workflow example. Mode changes cancel a running example; reduced motion returns the outcome immediately. The decorative background has a pause control and a static reduced-motion version.
- `app/folio.css` and `app/atmosphere.css` define deep ink surfaces, soft lime accents and slow ambient contours. Fonts are Inter, a system serif and JetBrains Mono, with web fonts downloaded at build time and served locally.
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

Browser scripts use Chrome DevTools Protocol and accept a base URL and `CHROME_PATH`. Viewport checks cover every route at 320, 390, 768, 1024 and 1440 pixels, document status, console errors, mobile navigation, keyboard controls and reduced motion. Surface checks exercise the terminal, incident game, SQL workbench, project demos, recorded research, and success/failure/cancellation in all three homepage examples. The design script saves desktop and mobile page screenshots to the OS temporary directory.

The contact form requires `NEXT_PUBLIC_WEB3FORMS_KEY`; without it, the contact page offers email. The site otherwise runs without configuration. `npm run build -- --webpack` is available when the local environment requires the alternative compiler.
