# DevlinOps Portfolio Website

Professional portfolio website for Jack Devlin - Platform Engineering & DevOps Consulting.

🌐 **Live Site**: [devlinops.com](https://devlinops.com) (pending deployment)

## Tech Stack

- **Framework**: Next.js 16 (App Router)
- **Styling**: Tailwind CSS 4.x with OKLCH color space
- **Animations**: Framer Motion
- **Theme**: next-themes (dark/light mode)
- **Language**: TypeScript (strict mode)
- **Deployment**: TBD (Vercel recommended)

## Features

### 🎨 Unique Design Elements

- **Animated Terminal Component**: Auto-typing terminal showing real DevOps commands (`kubectl`, `argocd`, `helm`, `terraform`)
- **Tech Stack Showcase**: 8 animated technology icons with hover effects
- **Interactive Dashboard Gallery**: Click-to-expand modals for Grafana dashboard screenshots
- **Code Snippets**: Real production code samples with copy-to-clipboard functionality
- **Smooth Animations**: Page transitions and scroll-triggered animations throughout

### 📄 Pages

- **Homepage**: Hero with terminal, services overview, tech stack, featured projects, CTA
- **Services**: 7 comprehensive platform engineering offerings with detailed descriptions
- **Projects**: 3 in-depth case studies:
  - CI/CD & GitOps Platform Engineering (400 deploys/month)
  - DORA Metrics & Developer Experience Platform (Python + Bash)
  - Enterprise Observability Stack (Prometheus, Grafana, Loki)
- **About**: Personal bio, education (MSc AI in progress, BSc CS), tech stack, working philosophy
- **Contact**: Email, GitHub, LinkedIn with helpful messaging guidelines

### 🎯 Personalization

- **Human Copy**: Conversational, authentic tone - no corporate jargon
- **Real Code**: Production script snippets from actual projects
- **Education Highlight**: MSc in AI studies showcased with AI+Platform Engineering angle
- **Current Status**: "What I'm Up To Now" section showing active learning
- **Personal Photo**: Professional headshot on About page

### 🚀 Performance

- **Full-Width Layout**: Custom container configuration for optimal space usage
- **Responsive Design**: Mobile-first, scales from phone to 4K displays
- **Dark Mode**: Working theme toggle with proper hydration handling
- **Optimized Images**: Next.js Image component with proper sizing
- **Type Safety**: Strict TypeScript throughout

## Project Structure

```
website/
├── app/
│   ├── layout.tsx              # Root layout with theme provider
│   ├── page.tsx                # Homepage
│   ├── about/page.tsx          # About page with photo
│   ├── contact/page.tsx        # Contact page
│   ├── services/page.tsx       # Services listing
│   ├── projects/
│   │   ├── page.tsx            # Projects overview
│   │   ├── cicd-gitops/        # Case study 1
│   │   ├── dora-devex/         # Case study 2 (with code snippets)
│   │   └── observability/      # Case study 3 (with dashboard gallery)
│   └── globals.css             # Global styles + dark mode
├── components/
│   ├── navigation.tsx          # Header with theme toggle
│   ├── hero.tsx                # Homepage hero
│   ├── terminal.tsx            # Animated terminal component
│   ├── tech-stack.tsx          # Animated tech icons
│   ├── services.tsx            # Services grid
│   ├── projects-preview.tsx    # Featured projects
│   ├── cta.tsx                 # Call-to-action section
│   ├── footer.tsx              # Footer component
│   ├── code-snippet.tsx        # Code display with copy button
│   ├── metrics-showcase.tsx    # Dashboard image gallery
│   └── theme-provider.tsx      # next-themes wrapper
├── public/
│   ├── logo.png                # Site logo
│   ├── jack-photo.jpg          # Personal photo
│   └── dashboards/             # Dashboard screenshots
│       ├── iot-gateway.png
│       ├── kafka-metrics.png
│       └── node-exporter.png
└── tailwind.config.ts          # Tailwind configuration
```

## Development

```bash
# Install dependencies
npm install

# Run dev server
npm run dev

# Build for production
npm run build

# Start production server
npm start
```

## Deployment Checklist

- [ ] Add personal photo (`public/jack-photo.jpg`)
- [ ] Add dashboard screenshots to `public/dashboards/`
- [ ] Configure domain DNS (devlinops.com)
- [ ] Deploy to Vercel/Netlify
- [ ] Set up professional email (jack@devlinops.com)
- [ ] Submit sitemap to Google Search Console
- [ ] Add analytics (optional)

## Key Decisions

- **No Turbopack**: Disabled due to OneDrive compatibility issues
- **Custom Container**: Overrode Tailwind's default max-widths for full-width layouts
- **OKLCH Colors**: Modern color space for better dark mode handling
- **Minimal Dependencies**: Only essential packages to keep bundle small

## Future Enhancements

See "Next-Level Improvements" section below for advanced feature ideas.

---

**Built by Jack Devlin** | Platform Engineering & DevOps Consulting