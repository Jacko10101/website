import Image from "next/image";
import Link from "next/link";

export function LandingWork() {
  return <section id="selected-work" className="landing-work landing-container" aria-labelledby="landing-work-title">
    <div className="landing-section-heading"><div><p className="landing-label"><span className="landing-index">01 /</span> Selected work</p><h2 id="landing-work-title">What I’ve been <em>building.</em></h2></div><p>Projects from Loweconex,<br />where I’ve worked since 2023.</p></div>
    <div className="landing-work-grid">
      <article className="landing-project">
        <Link href="/projects/heimdall" className="landing-project-art heimdall-art" aria-label="Read the Heimdall case study">
          <div className="project-art-top"><span>HEIMDALL / RELEASE VISIBILITY</span><span>↗</span></div>
          <p className="project-art-headline">Where did that<br /><em>change land?</em></p>
          <div className="landing-browser"><div className="landing-browser-bar"><i /><i /><i /><span>heimdall / environments</span></div><Image src="/heimdall/environments-2026.png" alt="Heimdall dashboard showing deployments across environments" width={1600} height={1000} sizes="(max-width: 700px) 90vw, 45vw" /></div>
          <span className="landing-art-badge">25 services. One view.</span>
        </Link>
        <div className="landing-project-meta"><span>Developer tooling</span><span><i /> In production</span></div>
        <h3><Link href="/projects/heimdall">Heimdall <span aria-hidden>↗</span></Link></h3>
        <p>A release dashboard connecting tickets, pull requests, deployments and tests across 25 services and four environments.</p>
      </article>
      <article className="landing-project">
        <Link href="/projects/nightshift" className="landing-project-art nightshift-art" aria-label="Read the Nightshift case study">
          <div className="project-art-top"><span>NIGHTSHIFT / ENGINEERING AUTOMATION</span><span>↗</span></div>
          <p className="project-art-headline">Picking up<br /><em>the next ticket.</em></p>
          <div className="nightshift-workflow"><span className="nightshift-workflow-ticket"><span aria-hidden>≡</span><span>TAGGED JIRA TICKET<small>Fix a security finding.</small></span></span><span className="nightshift-workflow-path" aria-hidden>↓</span><span className="nightshift-workflow-agent"><span className="nightshift-asterisk" aria-hidden>✳</span><span>Nightshift<small>Implement · verify</small></span></span><span className="nightshift-workflow-path" aria-hidden>↓</span><span className="nightshift-workflow-draft"><span aria-hidden>⑂</span><span>DRAFT PULL REQUEST<small>Tests attached.</small></span><span className="nightshift-check" aria-hidden>✓</span></span></div>
          <span className="landing-art-badge">Human review before merge.</span>
        </Link>
        <div className="landing-project-meta"><span>Applied AI</span><span><i /> Running</span></div>
        <h3><Link href="/projects/nightshift">Nightshift <span aria-hidden>↗</span></Link></h3>
        <p>Engineering agents for tagged Jira tickets, PR reviews, security automation and incident response. Built around scoped workflows and human review.</p>
      </article>
    </div>
    <div className="landing-work-rows">
      <Link href="/projects/pipeline-platform"><span className="landing-row-icon" aria-hidden>⑂</span><span><strong>The delivery platform</strong><small>Shared Java and Node pipelines for 25 services, with tests after deployment.</small></span><span className="landing-row-category">CI/CD & GitOps</span><span className="landing-row-arrow" aria-hidden>↗</span></Link>
      <Link href="/projects/clarity"><span className="landing-row-icon" aria-hidden>✳</span><span><strong>Clarity</strong><small>Customer data queried in plain English, with SQL and CSV reports.</small></span><span className="landing-row-category">AI services</span><span className="landing-row-arrow" aria-hidden>↗</span></Link>
    </div>
    <div className="landing-work-end"><span>Plus observability, the AI gateway, research, and the homelab.</span><Link href="/projects" className="landing-text-link">All eight case studies <span aria-hidden>↗</span></Link></div>
  </section>;
}

export function LandingAfterHours() {
  return <section className="landing-after-hours" aria-labelledby="after-hours-title"><div className="landing-container">
    <div className="landing-after-hours-heading"><div><p className="landing-label"><span className="landing-index">02 /</span> Experiments & personal projects</p><h2 id="after-hours-title">A little further<br /><em>under the hood.</em></h2></div><p>Try an incident simulation,<br />explore the research, or visit the homelab.</p></div>
    <div className="landing-experiments">
      <Link href="/lab#shift"><span className="experiment-number">01</span><span className="experiment-art experiment-pager" aria-hidden><span>02:17<small>YOU HAVE THE PAGER.</small></span></span><span className="landing-label">Interactive / On-call</span><h3>Your shift starts here. <span aria-hidden>↗</span></h3><p>Work through five incidents<br />based on failures I’ve investigated.</p></Link>
      <Link href="/lab#scheduler"><span className="experiment-number">02</span><span className="experiment-art experiment-cluster" aria-hidden>{Array.from({length:35}, (_,i) => <i key={i} className={i > 13 && i < 21 ? "cluster-displaced" : ""} />)}</span><span className="landing-label">Interactive / Kubernetes</span><h3>Break a little cluster. <span aria-hidden>↗</span></h3><p>Take a node down and watch the<br />most important work find a home.</p></Link>
      <Link href="/projects/smart-home"><span className="experiment-number">03</span><span className="experiment-art experiment-home" aria-hidden><svg viewBox="0 0 120 90"><path d="M17 42 60 10 103 42M27 36V79H93V36M50 79V51H70V79" /><circle cx="60" cy="33" r="3" /><path d="M42 33a18 18 0 0 1 36 0M33 33a27 27 0 0 1 54 0" /></svg></span><span className="landing-label">Personal / Homelab</span><h3>The cluster at home. <span aria-hidden>↗</span></h3><p>Home Assistant on a Raspberry Pi,<br />running the lights and sensors in my flat.</p></Link>
    </div>
    <Link href="/lab" className="landing-text-link">Step inside the lab <span aria-hidden>↗</span></Link>
  </div></section>;
}

export function LandingContact({ numbered = true }: { numbered?: boolean }) {
  return <section className="landing-contact landing-container" aria-labelledby="landing-contact-title">
    <div className="landing-contact-top"><p className="landing-label">{numbered && <span className="landing-index">03 /</span>} What’s next?</p><span className="landing-contact-star" aria-hidden>✳</span></div>
    <h2 id="landing-contact-title">Let’s talk about<br /><em>what’s next.</em></h2>
    <div className="landing-contact-bottom"><p>I’m open to roles in platform engineering, developer tools and AI infrastructure.<br />Remote-first, open to relocating, and no sponsorship needed.</p><Link href="/contact" className="landing-button">Get in touch <span aria-hidden>↗</span></Link></div>
  </section>;
}
