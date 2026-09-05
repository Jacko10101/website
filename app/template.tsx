"use client";

import { ReactNode, useEffect, useState } from "react";
import "@/components/view-transition";

/**
 * The rise between routes, in CSS. It must never gate the *first* paint:
 * the landing page renders as served, and only a client-side navigation
 * animates. The flag is false on the server and on first mount, true on
 * every template remount after that. Reduced motion is handled by the
 * global rule in globals.css, which zeroes the animation.
 *
 * This used to be a framer-motion `motion.div`, which put the whole
 * animation library on every route for a 350ms fade.
 */
let hasNavigated = false;

export default function Template({ children }: { children: ReactNode }) {
  // Read once per mount, as state rather than a ref so it is never read
  // during render.
  // A view transition (components/view-transition.tsx) animates the crossing
  // itself; the rise would run on top of it, so it stands aside.
  const [isNavigation] = useState(() => hasNavigated && !window.__viewTransition);

  useEffect(() => {
    hasNavigated = true;
  }, []);

  return <div className={isNavigation ? "route-enter" : undefined}>{children}</div>;
}
