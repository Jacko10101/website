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

The homepage opens on a small cluster losing a node and recovering it the way the dissertation's scheduler does. `/oncall` has the things on the site that run: a SQLite database of the work compiled to WebAssembly and queried in the browser, your own session's web vitals, and an on-call simulator with fourteen incidents.

The rule for numbers is measured or absent. Two figures on the pipeline page are still marked TODO until I pull them from the real repos.

## How it's built

Next.js 16 on the App Router, React 19, Tailwind 4. Every route is prerendered as static HTML; there is no server-side work at request time.

- **Provenance.** `next.config.ts` reads the commit, branch and commit time from git (or Vercel's build environment) and bakes them in. The footer shows the commit and links to it on GitHub. Nothing there is invented; each value degrades to absent.
- **Content security.** A CSP with no `unsafe-eval`. The SQLite engine on `/oncall` runs under `wasm-unsafe-eval`, which is the narrow grant it needs. HSTS, frame-ancestors, and the rest are set by the app, not inherited from the host.
- **Sources of truth.** `lib/projects.ts` holds every project's data; the homepage, the index, the sitemap, the career database and the terminal all read from it. `lib/profile.ts` holds availability and the other facts only I can supply. `lib/experience.ts` feeds the About page and the JSON-LD, so the two cannot drift.
- **Type and colour.** Inter for display, JetBrains Mono for labels, data and the terminal, both self-hosted at build. Dark only, one accent, and each case study re-tints the accent to its own CRT phosphor (`lib/phosphors.ts`).
- **Hosting.** Vercel. A push to `main` deploys, which is why the checks below exist.

## Checks

```
npm run typecheck        # tsc
npm run lint             # ESLint, Next's config
npm test                 # Vitest: the SQL guard and the career database
npm run check:viewports  # every route at 390px and 1440px, fails on horizontal overflow
```

The tests cover the two pieces of engineering the site leans on: the browser port of the SQL validator that refuses model-generated queries in Clarity, and the career database that `/oncall` builds in the visitor's tab. The viewport check drives Chrome over the DevTools Protocol with real device metrics, because a single unbreakable string dragging a page into horizontal scroll on a phone is a bug that has shipped before.

CI runs all of it, plus `npm audit` and the build, on every push and pull request.

## Running it

```
npm ci
npm run dev        # http://localhost:3000
npm run build && npm start -- -p 3111   # the port check:viewports expects
```

The contact form posts to Web3Forms and needs `NEXT_PUBLIC_WEB3FORMS_KEY`; without it the form explains that it isn't configured. Everything else runs with no configuration.

## The extras

If you read everything: press `/` for a terminal that knows the site's routes. `oncall` in it, or the Konami code, opens the incident simulator. `chaos` does what it says, and git puts it back. The 404 is a pod in CrashLoopBackOff.
