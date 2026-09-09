"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { BUILD } from "@/lib/build-info";

export function Footer() {
  const pathname = usePathname();
  const folio = ["/", "/about", "/projects", "/contact", "/lab"].includes(pathname);
  return (
    <footer className={`site-footer ${folio ? "folio-surface" : ""}`}>
      <div className="container">
        <div className="footer-main">
          <Link href="/" className="footer-signature">Jack Devlin<span>.</span></Link>
          <p>Platform engineer.<br />Northern Ireland, working everywhere.</p>
          <div className="footer-links"><Link href="/about">About</Link><a href="https://github.com/Jacko10101" target="_blank" rel="noopener noreferrer">GitHub ↗</a><a href="/cv.pdf" download="jack-devlin-cv.pdf">CV ↓</a><Link href="/contact">Contact</Link></div>
        </div>
        <div className="footer-colophon">
          <span>© {new Date().getFullYear()} Jack Devlin</span>
          <div className="flex flex-wrap items-center gap-x-6 gap-y-2">
            {BUILD.commitUrl && <a href={BUILD.commitUrl} target="_blank" rel="noopener noreferrer" title="Source commit">Source / {BUILD.shortSha}</a>}
            <button type="button" onClick={() => { window.__cliRequested = true; window.dispatchEvent(new Event("devlinops:cli")); }}>There’s a terminal, too <span aria-hidden>↗</span></button>
          </div>
        </div>
      </div>
    </footer>
  );
}
