"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, useEffect } from "react";

export function NotFoundClient() {
  const current = usePathname();
  const [pathname,setPathname] = useState<string | null>(null);
  useEffect(() => {
    // The prerendered 404 cannot know the requested pathname.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setPathname(current);
  },[current]);
  return <div className="missing-surface min-h-screen flex items-center justify-center px-4 py-32"><div className="w-full max-w-3xl">
    <p className="folio-label">404 / Route lookup</p><h1 className="missing-heading">Nothing deployed<br /><span>at this address.</span></h1>
    <div className="missing-route"><span aria-hidden>↳</span><code>{pathname ?? "Looking up the requested route…"}</code><span>NO MATCH</span></div>
    <p className="missing-copy">This address doesn’t point to a page. The work is still here.</p>
    <div className="missing-links"><Link href="/">Back to the surface ↗</Link><Link href="/projects">Explore the projects ↗</Link><Link href="/lab">Open the tools ↗</Link></div>
  </div></div>;
}
