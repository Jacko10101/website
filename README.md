# devlinops.com

[![checks](https://github.com/Jacko10101/website/actions/workflows/checks.yml/badge.svg)](https://github.com/Jacko10101/website/actions/workflows/checks.yml)

My site: [devlinops.com](https://www.devlinops.com). Case studies of platform work, each written in the form the work took.

## What's on it

Seven case studies, each in its own register, because a dashboard, a pipeline and a dissertation are not the same kind of document.

| Route | What it is | Written as |
| --- | --- | --- |
| `/projects/heimdall` | The deployment dashboard 20+ engineers open every morning | A day log |
| `/projects/pipeline-platform` | One shared CI/CD library replacing twenty drifted pipelines | A merged pull request |
| `/projects/observability` | Self-hosted Prometheus, Thanos, Loki, Tempo and Grafana | An architecture decision record |
| `/projects/ai-gateway` | One endpoint in front of every model call, keys that fail closed | An incident review |
| `/projects/clarity` | Natural-language querying across about thirty tenant databases | Claims with receipts |
| `/projects/smart-home` | The same GitOps discipline, sized to a flat | A hardware spec sheet |
| `/projects/ml-scheduler` | Capacity-aware pod recovery under real node failure, my MSc | A paper |

The homepage opens with an inspectable cutaway of Heimdall and the platform beneath it. Product, delivery, runtime and observability layers connect to the decisions in the case studies. Clarity follows, then an interactive comparison of five recorded EKS recovery pairs, using the same data as the dissertation page. `/lab` contains an on-call simulator, an interactive map of tools shared across projects, an optional SQLite workbench and a live browser request waterfall.

The rule for numbers is measured or absent. Two figures on the pipeline page are still marked TODO until I pull them from the real repos.

## How it's built

Next.js 16 on the App Router, React 19, Tailwind 4. Content routes are prerendered as static HTML.

- **Provenance.** `next.config.ts` reads the commit, branch and commit time from git (or Vercel's build environment) and bakes them in. The footer links to the source commit on GitHub. Nothing there is invented; each value degrades to absent.
- **Content security.** A CSP with no `unsafe-eval`. The SQLite engine on `/lab` runs under `wasm-unsafe-eval`, which is the narrow grant it needs. HSTS, frame-ancestors, and the rest are set by the app, not inherited from the host.
- **Sources of truth.** `lib/projects.ts` holds every project's data; the homepage, the index, the sitemap, the career database and the terminal all read from it. `lib/profile.ts` holds availability and the other facts only I can supply. `lib/experience.ts` feeds the About page and the JSON-LD, so the two cannot drift.
- **Type and colour.** Inter paired with a system serif for the public folio; JetBrains Mono for labels, data and the terminal. The web fonts are self-hosted at build. Home, About, Projects and Contact use charcoal, off-white text and restrained green accents. Technical case studies keep their own dark phosphor palettes (`lib/phosphors.ts`), as do the embedded experiments.
- **Homepage interactions.** Native buttons select the architecture layers and individual research runs. The cutaway is a schematic, not live telemetry; the research chart uses recorded results from `lib/recovery-evidence.ts`. Reduced motion disables the layer transition and pointer tilt. Normal navigation remains directly available.
- **Hosting.** Vercel. A push to `main` deploys, which is why the checks below exist.

The cross-surface design and interaction audit is recorded in [SURFACE-AUDIT.md](SURFACE-AUDIT.md). The terminal now inspects the real projects; the pager includes pausing and a handover record.

## Checks

```
npm run typecheck        # tsc
npm run lint             # ESLint, Next's config
npm test                 # Vitest: SQL guard, career database and layout-shift windows
npm run check:viewports  # every route at 320px, 390px, 768px, 1024px and 1440px, plus keyboard and reduced-motion checks
npm run check:surfaces   # terminal, full pager shifts and embedded tools at phone and desktop sizes
```

The unit tests cover the browser port of Clarity's SQL validator, the career database and layout-shift windows. The viewport check drives Chrome over the DevTools Protocol with real device metrics. It checks horizontal overflow, document status and console errors, then exercises the mobile menu, cutaway layers and recorded research results using keyboard events, including reduced-motion behavior and checks for obstructed controls. The separate surface check exercises terminal navigation and focus, pager completion and failure, SQL queries and the project instruments at 320, 390 and 1440 pixels. Both browser scripts accept a base URL and a `CHROME_PATH` override.

The surface journey can be run locally against the production preview. See `.github/workflows` for the automated CI checks.

## Running it

```
npm ci
npm run dev        # http://localhost:3000
npm run build && npm start -- -p 3111   # the port check:viewports expects
```

The contact form posts to Web3Forms and needs `NEXT_PUBLIC_WEB3FORMS_KEY`; without it the page offers direct email before asking anyone to fill in a form. Everything else runs with no configuration. For a local environment where Turbopack cannot bind its internal worker port, `npm run build -- --webpack` uses the supported alternative compiler. Development allows React’s eval-based debugging; production keeps the stricter script policy.

## The extras

Press `/` for the project workbench: `inspect heimdall`, `compare` and `sql` are useful starting points. `oncall`, or the Konami code, opens the incident simulator. `chaos` temporarily disrupts the page and restores its captured state; Escape ends it early. The 404 shows the missing route and offers a way back.
