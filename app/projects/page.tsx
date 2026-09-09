import type { Metadata } from "next";
import { TransitionLink as Link } from "@/components/view-transition";
import Image from "next/image";
import { inReadingOrder } from "@/lib/projects";
import { ContactCTA } from "@/components/contact-cta";
import { EstateMap } from "@/components/estate-map";

const images: Record<string, {src: string; width: number; height: number; alt: string}> = {
  heimdall: { src: "/heimdall/dashboard.png", width: 2192, height: 1810, alt: "Heimdall deployment dashboard" },
  clarity: { src: "/clarity/answer-with-sql.png", width: 2000, height: 1025, alt: "Clarity answer with its SQL" },
};

export default function ProjectsPage() {
  return (
    <div className="folio-surface">
      <div className="container interior-page">
        <div className="folio-line"><span>Project index</span><span>2024—26 / 07 entries</span></div>
        <div className="index-opening"><h1 className="interior-title">Built.<br /><em>And operated.</em></h1><p className="interior-lede">Five systems at Loweconex, a dissertation, and the infrastructure in my flat.
          Here’s what I built, why it exists, and what I learned running it.</p></div>
        <div className="project-directory">
          {inReadingOrder().map((p, index) => <article key={p.id} className="directory-entry">
            <div className="directory-number">{String(index + 1).padStart(2, "0")}</div>
            <div className="directory-content">
              <p className="folio-label">{p.year} / {p.statusLabel}</p>
              <Link href={p.href} className="directory-title"><h2 style={{ viewTransitionName: `title-${p.id}` }}>{p.title}</h2><span aria-hidden>↗</span></Link>
              <p className="directory-subtitle">{p.subtitle}</p>
              <p className="story-summary mt-5">{p.outcome ?? p.description}</p>
              <p className="directory-context">{p.context}</p>
              <Link href={p.href} className="quiet-link">Read the {p.id === "ml-scheduler" ? "research" : "case study"} <span aria-hidden>↗</span></Link>
            </div>
            <Link href={p.href} className={`directory-art ${images[p.id] ? "has-image" : ""}`} aria-label={`Open ${p.title}`}>
              {images[p.id] ? <Image {...images[p.id]} alt={images[p.id].alt} sizes="(min-width: 1024px) 260px, (min-width: 768px) 180px, 80vw" className="w-full h-auto" /> : <><span className="directory-stat">{p.stats[0]?.value}</span><span>{p.stats[0]?.label}</span></>}
            </Link>
          </article>)}
        </div>
        <details className="platform-overview">
          <summary><span>How the work fits together</span><span aria-hidden>+</span></summary>
          <p className="story-summary mt-4 mb-8">The five production systems sit on the same platform. This is where each one fits.</p>
          <div className="ink-surface p-4 sm:p-8"><EstateMap /></div>
        </details>
      </div>
      <ContactCTA />
    </div>
  );
}

export const metadata: Metadata = {
  alternates: { canonical: "/projects" }, title: "Projects",
  description: "Platform engineering by Jack Devlin: deployment tooling, shared CI/CD, observability, AI infrastructure, and Kubernetes research.",
  openGraph: { title: "Projects · Jack Devlin", description: "Seven projects. What I built, why it exists, and what I learned running it.", url: "/projects" },
};
