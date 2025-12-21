# devlinops.com

My portfolio site. Not your typical "here's my CV in website form" - this one builds itself.

**[devlinops.com](https://devlinops.com)**

## The Fun Bits

**First visit?** Watch the site compile and deploy in a terminal before your eyes. Return visitors get a cheeky "Served from edge cache • 23ms" toast instead.

**Press `/` anywhere.** Opens a fully functional terminal. Try `kubectl get pods` or `vim` (yes, you'll need to `:q` to exit).

**Find the 404 page.** It's a Kubernetes pod stuck in CrashLoopBackOff with live restart counters.

**Know the Konami Code?** ↑↑↓↓←→←→BA

## What's Inside

Three case studies from my platform engineering work - CI/CD pipelines doing 400+ deploys/month, a DORA metrics platform I built from scratch (~8000 lines of Python + Bash), and a self-hosted observability stack that saves 95% vs Datadog/New Relic.

All figures verified against the actual source code. No "reduced deployment time by 300%" nonsense.

## Tech

Next.js 16, Tailwind CSS 4, Framer Motion. Dark mode only because light mode is for documentation sites.

Previously had Three.js for a fancy 3D background - ripped it out for an 82% bundle reduction. The terminal animation is more on-brand anyway.

## Run Locally

```bash
npm install && npm run dev
```

Clear `localStorage.removeItem("build-seen")` in console to re-watch the build sequence.

---

**[See it live →](https://devlinops.com)**
