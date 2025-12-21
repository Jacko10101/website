# DevlinOps Portfolio Website - Build Log

**Date**: October 30, 2025 → December 20, 2025
**Project**: devlinops.com
**Status**: 🚀 **LIVE IN PRODUCTION** - https://devlinops.com ✅

---

## Phase 5: "Site Compiles" Intro Experience ✅ COMPLETE

**Date**: December 20, 2025

### Concept: The Site Builds Itself

Instead of a traditional hero or video-style animation, first-time visitors experience the site literally building and deploying in front of them via a terminal interface.

**The Experience**:
```
First visit → Terminal appears → Shows git clone, npm install, npm run build, deploy →
Terminal fades up → Hero content reveals beneath with staggered animations →
localStorage remembers → Return visits show "Served from edge cache" toast
```

**Implementation**:
- `components/build-sequence.tsx` - Terminal animation with realistic build output
- `components/hero-journey.tsx` - Orchestrates the experience, handles phases
- Phases: `loading` → `building` → `revealing` → `complete`
- Staggered hero animations (eyebrow → headline → subheading → tags → CTAs → scroll indicator)
- ~3 second build sequence, ~2.5 second reveal
- Return visitors see instant load + "Served from edge cache • 23ms" toast

**Why This Works**:
- ✅ Unique - Haven't seen a portfolio that "builds itself"
- ✅ On-brand - Literally demonstrates CI/CD expertise
- ✅ Fast - Only ~5 seconds total, not annoying
- ✅ Clever - Return visitor cache message is a nice touch
- ✅ Lightweight - No Three.js, just Framer Motion

---

## Phase 6: Future - Incident Response Game 🎮 PLANNED

### Concept: Interactive Debugging Experience

A gamified incident response simulation where visitors become the on-call engineer.

**The Vision**:
- Site starts in a "broken" state with alerts firing
- Visitors run commands to diagnose and fix issues
- Timer tracks resolution speed
- Reveals portfolio content as systems are "fixed"
- Optional leaderboard for competitive element

**Potential Mechanics**:
1. **Alert appears**: `CRITICAL: PodCrashLoopBackOff in production`
2. **Visitor types**: `kubectl get pods` → sees failing pod
3. **Visitor types**: `kubectl logs <pod>` → sees error
4. **Visitor types**: `kubectl rollback` → fixes issue
5. **System recovers** → Next section of portfolio reveals

**Why This Would Work**:
- Interactive and memorable
- Showcases incident response expertise
- Gamification encourages exploration
- Unique in the portfolio space
- Could be a standalone `/incident` page or main experience

**Status**: Concept stage, planned for future implementation

---

## Phase 4: Polish & Performance ✅ COMPLETE

**Date**: December 20, 2025

### Security & Performance Improvements

**Security Headers Added** (`next.config.ts`):
- ✅ X-Frame-Options: SAMEORIGIN
- ✅ X-Content-Type-Options: nosniff
- ✅ Referrer-Policy: strict-origin-when-cross-origin
- ✅ Permissions-Policy (camera, microphone, geolocation disabled)
- ✅ Content-Security-Policy

**Bundle Size Optimization**:
- Removed Three.js and related packages (was 1.2MB chunk)
- Removed unused gsap and lenis packages
- New largest chunk: ~220KB (82% reduction)
- Removed 70 packages total

**Build Improvements**:
- Fixed metadataBase warning
- Updated sitemap (removed deleted /services page)
- Next.js upgraded to 16.1.0 (security fix)
- npm registry configured for public packages (`.npmrc`)

### Visual Enhancements

**Subtle Noise Texture** (`globals.css`):
- SVG-based noise overlay at 1.5% opacity
- Adds film grain/texture without distraction
- Fixed position, covers entire viewport

**Custom 404 Page** (`app/not-found.tsx`):
- Full Kubernetes "CrashLoopBackOff" theme
- Live restart counter that increments
- Live "age" timer
- kubectl output with pod status table
- Events and logs sections
- "kubectl apply -f homepage.yaml" CTA

**Footer Build Info** (`components/footer.tsx`):
- Shows commit hash (from Vercel env vars)
- Shows branch name
- Live page load time (Performance API)
- Site uptime counter since launch
- "All systems operational" status indicator

---

## Phase 3: Polish, Deploy & Launch ✅ COMPLETE

### What Was Built (October 30, 2025)

**Interactive Features**:
- ✅ **CLI Navigation** - Press `/` to open terminal navigation
  - `kubectl get pods` - Shows humorous pod names
  - `docker ps` - Container list with funny names
  - `terraform plan/apply` - Fake Terraform output
  - `argocd app list` - ArgoCD applications
  - `vim` - Vim simulator with :q to exit
  - `whoami` - ASCII tree bio
  - `history` - Command history

- ✅ **Konami Code Easter Egg** - Matrix rain animation (↑↑↓↓←→←→BA)

- ✅ **View Transitions API** - Smooth page transitions via template.tsx + CSS

**Visual Polish**:
- ✅ Favicons and OG images complete
- ✅ British English throughout
- ✅ Authentic, personal tone (no corporate speak)

**Deployment**:
- ✅ Vercel with automatic deployments
- ✅ Custom domain: devlinops.com
- ✅ SSL/HTTPS automatic

---

## Tech Stack

**Current (Lightweight)**:
- Next.js 16.1.0 (Turbopack disabled for OneDrive)
- Tailwind CSS 4.x (OKLCH color space)
- Framer Motion (animations)
- TypeScript (strict mode)
- Dark mode only (forced theme)

**Removed**:
- ~~Three.js / @react-three/fiber~~ (replaced with CSS animations)
- ~~gsap~~ (unused)
- ~~lenis~~ (unused)
- ~~next-themes~~ (dark only now)

---

## File Structure

```
website/
├── app/
│   ├── layout.tsx              # Root layout with metadata
│   ├── page.tsx                # Homepage
│   ├── template.tsx            # Page transitions (Framer Motion)
│   ├── not-found.tsx           # Custom 404 (crashed pod theme)
│   ├── globals.css             # Global styles + noise texture
│   ├── robots.ts               # Robots.txt generation
│   ├── sitemap.ts              # Sitemap generation
│   ├── about/page.tsx
│   ├── contact/page.tsx
│   └── projects/
│       ├── page.tsx
│       ├── cicd-gitops/page.tsx
│       ├── dora-devex/page.tsx
│       └── observability/page.tsx
├── components/
│   ├── build-sequence.tsx      # Terminal "site compiles" animation
│   ├── hero-journey.tsx        # Hero with build sequence orchestration
│   ├── navigation.tsx          # Header nav
│   ├── footer.tsx              # Footer with build info
│   ├── cli-navigation.tsx      # Terminal navigation (press /)
│   ├── konami-code.tsx         # Easter egg
│   ├── scroll-reveal.tsx       # Shared animation components
│   ├── case-study-layout.tsx   # Case study page components
│   ├── featured-projects.tsx   # Homepage projects section
│   ├── what-i-do.tsx           # Homepage services section
│   ├── cta-section.tsx         # Call to action
│   ├── contact-form.tsx        # Contact page form
│   ├── cicd-architecture.tsx   # SVG architecture diagram
│   ├── dora-architecture.tsx   # SVG architecture diagram
│   ├── observability-architecture.tsx
│   ├── metrics-showcase.tsx    # Dashboard screenshots
│   ├── code-snippet.tsx        # Code blocks
│   └── back-to-top.tsx
├── public/
│   ├── dashboards/             # Dashboard screenshots
│   ├── favicon files
│   └── og-image.png
├── .npmrc                      # Public npm registry
├── next.config.ts              # Next.js config + security headers
├── package.json
└── CLAUDE.md                   # This file
```

---

## Case Studies

### 1. CI/CD & GitOps Platform Engineering
**Path**: `/projects/cicd-gitops/`
- Graduate QA → Platform Engineer journey
- 20 microservices, 400 deploys/month, 4 environments
- ArgoCD, Kustomize, App-of-Apps pattern
- ~5min builds, zero prod incidents

### 2. DORA Metrics & Developer Experience Platform
**Path**: `/projects/dora-devex/`
- Python metrics collector + Bash pipeline reporter
- 413 deployments tracked/month
- Jira-integrated deployment gates
- 80% reduction in status questions

### 3. Enterprise Observability Stack
**Path**: `/projects/observability/`
- Self-hosted Prometheus/Grafana/Loki
- <$5K/yr vs $150K cloud solutions
- 25+ dashboards, 50+ alert rules
- 70% MTTD reduction

---

## Development

### Running Locally
```bash
cd "/Users/jackdevlin/Library/CloudStorage/OneDrive-LoweRental/Documents/personal/website"
npm run dev
# Opens on http://localhost:3000
```

### Testing Build Sequence
```javascript
// In browser console - clears the "seen" flag
localStorage.removeItem("build-seen")
// Then refresh to see the build animation again
```

### Commands
```bash
npm install    # Install dependencies
npm run dev    # Dev server
npm run build  # Production build
npm start      # Start production server
```

### Repository
- **Remote**: https://github.com/Jacko10101/website.git
- **Branch**: main

---

## Design Principles

1. **Dark Mode Only** - No light mode toggle, consistent experience
2. **Terminal Aesthetic** - Green/cyan accents, monospace where appropriate
3. **Playful + Professional** - Easter eggs and personality, but quality content
4. **Performance First** - No heavy libraries, lazy load where possible
5. **British English** - "Optimise" not "optimize"
6. **No Corporate Speak** - Authentic voice, no buzzwords

---

## What Makes This Portfolio Stand Out

1. **"Site Compiles" Intro** - Literally watch the site build and deploy
2. **CLI Navigation** - Press `/` for a full terminal experience
3. **Crashed Pod 404** - On-brand error page with live counters
4. **Build Info Footer** - Shows commit, load time, uptime
5. **Konami Code** - Matrix rain easter egg
6. **Interactive Architecture Diagrams** - Hover states, animations
7. **Real Metrics** - Actual business impact numbers
8. **Future: Incident Response Game** - Gamified debugging experience

---

## Summary

**Status**: 🚀 **LIVE IN PRODUCTION** at https://devlinops.com

The portfolio demonstrates platform engineering expertise through both content AND experience. The site itself is a showcase of the skills it describes - CI/CD (build sequence), observability (build info), infrastructure (terminal aesthetic), and developer experience (smooth interactions).

Goal: Award-worthy, memorable, and genuinely fun to visit.
