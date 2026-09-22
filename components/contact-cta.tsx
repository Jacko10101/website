import Link from "next/link";

export function ContactCTA({ title = "Have something in mind?", lede = "A platform to improve, an interesting role, or a question about the work. I’d be glad to hear from you." }: { title?: string; lede?: string }) {
  return <section className="new-signoff container"><div><p className="overline">Let’s talk</p><h2>{title}</h2><p>{lede}</p></div><Link href="/contact" className="signoff-orbit" aria-label="Get in touch"><span>Say hello</span><span aria-hidden>↗</span></Link></section>;
}
