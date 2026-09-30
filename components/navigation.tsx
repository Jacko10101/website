"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";

const navItems = [
  { name: "Work", href: "/projects" },
  { name: "About", href: "/about" },
  { name: "Experiments", href: "/lab" },
  { name: "Contact", href: "/contact" },
];

export function Navigation() {
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const toggle = useRef<HTMLButtonElement>(null);
  const active = (href: string) => pathname === href || pathname.startsWith(href + "/");

  useEffect(() => {
    if (!mobileMenuOpen) return;
    const close = (event: KeyboardEvent) => {
      if (event.key === "Escape") { setMobileMenuOpen(false); toggle.current?.focus(); }
    };
    const breakpoint = window.matchMedia("(min-width: 768px)");
    const resize = () => { if (breakpoint.matches) setMobileMenuOpen(false); };
    window.addEventListener("keydown", close);
    breakpoint.addEventListener("change", resize);
    return () => { window.removeEventListener("keydown", close); breakpoint.removeEventListener("change", resize); };
  }, [mobileMenuOpen]);

  const openTerminal = () => {
    setMobileMenuOpen(false);
    window.__cliRequested = true;
    window.dispatchEvent(new Event("devlinops:cli"));
  };

  return (
    <nav className="site-navigation folio-surface" aria-label="Main navigation">
      <div className="container nav-inner">
        <Link href="/" className="nav-monogram" aria-label="Jack Devlin home" onClick={() => setMobileMenuOpen(false)}>jd<span>.</span></Link>
        <span className="nav-wordmark">Jack Devlin</span>
        <div className="desktop-navigation">
          {navItems.map((item) => <Link key={item.href} href={item.href} aria-current={active(item.href) ? "page" : undefined}>{item.name}</Link>)}
          <button type="button" onClick={openTerminal} className="terminal-key" aria-label="Open the terminal" title="Open terminal (/) ">/</button>
        </div>
        <button ref={toggle} type="button" onClick={() => setMobileMenuOpen(!mobileMenuOpen)} className="mobile-menu-toggle" aria-expanded={mobileMenuOpen} aria-controls="mobile-menu">{mobileMenuOpen ? "Close −" : "Menu +"}</button>
      </div>
      <div id="mobile-menu" className="mobile-navigation" hidden={!mobileMenuOpen}>
        <div className="container">
          {navItems.map((item, index) => <Link key={item.href} href={item.href} aria-current={active(item.href) ? "page" : undefined} onClick={() => setMobileMenuOpen(false)}><span className="folio-label">0{index + 1}</span>{item.name}<span aria-hidden>↗</span></Link>)}
          <button type="button" onClick={openTerminal}>Open the terminal <span aria-hidden>↗</span></button>
        </div>
      </div>
    </nav>
  );
}
