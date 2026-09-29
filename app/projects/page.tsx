import type { Metadata } from "next";
import Link from "next/link";
import { inReadingOrder } from "@/lib/projects";
import { ProjectCover } from "@/components/project-cover";
import { ContactCTA } from "@/components/contact-cta";

export const metadata: Metadata = {
  title: "Work", alternates: { canonical: "/projects" },
  description: "The platforms, developer tools and AI services I build. Explore the work and the decisions behind it.",
  openGraph: { title: "Work · Jack Devlin", description: "Real projects, a few experiments, and what I learned along the way.", url: "/projects" },
};

export default function ProjectsPage() {
  return <div className="folio-surface"><div className="container interior-page work-index">
    <header className="page-intro"><p className="overline">Work</p><h1>All the<br /><em>work.</em></h1><p>Eight case studies: six from Loweconex, my MSc research, and the homelab.</p></header>
    <div className="project-grid">{inReadingOrder().map((project, index) => <article key={project.id} className="project-card"><Link href={project.href} className="project-tile-cover" aria-label={`Read about ${project.title}`}><ProjectCover id={project.id} /></Link><div className="work-meta"><span>{String(index + 1).padStart(2, "0")} / {project.docType}</span><span>{project.statusLabel}</span></div><h2><Link href={project.href} style={{ viewTransitionName: `title-${project.id}` }}>{project.title}<span aria-hidden>↗</span></Link></h2><p>{project.subtitle}</p><Link href={project.href} className="text-link">Read the story <span aria-hidden>↗</span></Link></article>)}</div>
    </div><ContactCTA /></div>;
}
