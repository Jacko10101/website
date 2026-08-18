"use client";

import { motion } from "framer-motion";
import { ReactNode, useEffect, useRef } from "react";

/**
 * The rise between routes. It must never gate the *first* paint: framer
 * serialises `initial` into the server-rendered HTML, so a bare
 * `initial={{ opacity: 0 }}` shipped every page invisible until hydration
 * finished. The flag is false on the server and on first mount, so the landing
 * page paints immediately; every template remount after that is a client-side
 * navigation and animates.
 */
let hasNavigated = false;

export default function Template({ children }: { children: ReactNode }) {
  const isNavigation = useRef(hasNavigated);

  useEffect(() => {
    hasNavigated = true;
  }, []);

  return (
    <motion.div
      initial={isNavigation.current ? { opacity: 0, y: 12 } : false}
      animate={{ opacity: 1, y: 0 }}
      transition={{
        duration: 0.35,
        ease: [0.22, 1, 0.36, 1],
      }}
    >
      {children}
    </motion.div>
  );
}
