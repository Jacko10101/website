"use client";

import { useEffect, useState } from "react";

interface Vital {
  id: string;
  label: string;
  name: string;
  value: string | null;
  rating: "good" | "ok" | "poor" | null;
  /** What the number actually tells you, in plain words. */
  meaning: string;
  /** The bar the verdict is judged against. */
  goodIs: string;
}

function rate(value: number, good: number, poor: number): "good" | "ok" | "poor" {
  if (value <= good) return "good";
  if (value <= poor) return "ok";
  return "poor";
}

/**
 * Real web vitals for the visitor's own session, measured in their browser.
 * Nothing here is hardcoded — if a metric can't be measured, it shows "—".
 */
export function SessionVitals() {
  const [ttfb, setTtfb] = useState<number | null>(null);
  const [fcp, setFcp] = useState<number | null>(null);
  const [lcp, setLcp] = useState<number | null>(null);
  const [cls, setCls] = useState<number | null>(null);

  useEffect(() => {
    // The timing API is client-only, so mount is the earliest these can be
    // read without a hydration mismatch.
    /* eslint-disable react-hooks/set-state-in-effect */
    const nav = performance.getEntriesByType("navigation")[0] as
      | PerformanceNavigationTiming
      | undefined;
    if (nav) {
      const t = Math.round(nav.responseStart - nav.startTime);
      if (t >= 0) setTtfb(t);
    }

    const paint = performance
      .getEntriesByType("paint")
      .find((e) => e.name === "first-contentful-paint");
    if (paint) setFcp(Math.round(paint.startTime));
    /* eslint-enable react-hooks/set-state-in-effect */

    const observers: PerformanceObserver[] = [];

    // The synchronous read above misses a first paint that lands after this
    // effect runs, which showed as "not measurable" on a page that had
    // measured it. A buffered observer catches it either way.
    try {
      const paintObserver = new PerformanceObserver((list) => {
        const entry = list.getEntries().find((e) => e.name === "first-contentful-paint");
        if (entry) setFcp(Math.round(entry.startTime));
      });
      paintObserver.observe({ type: "paint", buffered: true });
      observers.push(paintObserver);
    } catch {
      // not supported in this browser — the tile shows "—"
    }

    try {
      const lcpObserver = new PerformanceObserver((list) => {
        const entries = list.getEntries();
        const last = entries[entries.length - 1];
        if (last) setLcp(Math.round(last.startTime));
      });
      lcpObserver.observe({ type: "largest-contentful-paint", buffered: true });
      observers.push(lcpObserver);
    } catch {
      // not supported in this browser — the tile shows "—"
    }

    try {
      let clsTotal = 0;
      const clsObserver = new PerformanceObserver((list) => {
        for (const entry of list.getEntries()) {
          const shift = entry as PerformanceEntry & {
            value: number;
            hadRecentInput: boolean;
          };
          if (!shift.hadRecentInput) {
            clsTotal += shift.value;
            setCls(clsTotal);
          }
        }
      });
      clsObserver.observe({ type: "layout-shift", buffered: true });
      setCls((c) => c ?? 0);
      observers.push(clsObserver);
    } catch {
      // not supported
    }

    return () => observers.forEach((o) => o.disconnect());
  }, []);

  const vitals: Vital[] = [
    {
      id: "ttfb",
      label: "TTFB",
      name: "time to first byte",
      value: ttfb !== null ? `${ttfb}ms` : null,
      rating: ttfb !== null ? rate(ttfb, 200, 600) : null,
      meaning: "How long the server took to start answering you.",
      goodIs: "under 200ms",
    },
    {
      id: "fcp",
      label: "FCP",
      name: "first contentful paint",
      value: fcp !== null ? `${fcp}ms` : null,
      rating: fcp !== null ? rate(fcp, 1800, 3000) : null,
      meaning: "How long before anything at all appeared on screen.",
      goodIs: "under 1.8s",
    },
    {
      id: "lcp",
      label: "LCP",
      name: "largest contentful paint",
      value: lcp !== null ? `${lcp}ms` : null,
      rating: lcp !== null ? rate(lcp, 2500, 4000) : null,
      meaning: "When the main content finished rendering.",
      goodIs: "under 2.5s",
    },
    {
      id: "cls",
      label: "CLS",
      name: "cumulative layout shift",
      value: cls !== null ? cls.toFixed(3) : null,
      rating: cls !== null ? rate(cls, 0.1, 0.25) : null,
      meaning: "How much the page jumped around while loading. 0 is perfectly still.",
      goodIs: "under 0.1",
    },
  ];

  const ratingClasses = {
    good: "text-primary border-primary/40",
    ok: "text-warn border-warn/40",
    poor: "text-error border-error/40",
  };

  const ratingWord = { good: "good", ok: "fair", poor: "slow" };

  return (
    <div>
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {vitals.map((vital) => (
          <div
            key={vital.id}
            className={`rounded-md border bg-card/60 p-4 flex flex-col ${
              vital.rating ? ratingClasses[vital.rating] : "border-border text-muted-foreground"
            }`}
          >
            <div className="font-mono text-2xl font-semibold">
              {vital.value ?? "—"}
            </div>
            <div className="font-mono text-xs mt-1 text-foreground/80">
              {vital.label} · {vital.name}
            </div>
            <p className="mt-2 text-[11px] leading-4 text-muted-foreground flex-1">
              {vital.meaning}
            </p>
            <p className="mt-2 text-[11px] font-mono">
              {vital.rating ? (
                <>
                  {vital.id === "cls" && vital.rating === "good" ? "still" : ratingWord[vital.rating]}
                  <span className="text-muted-foreground"> · good is {vital.goodIs}</span>
                </>
              ) : (
                <span className="text-muted-foreground">not measurable here</span>
              )}
            </p>
          </div>
        ))}
      </div>
      <p className="mt-3 text-xs text-muted-foreground">
        Measured in your browser, on this visit — not a screenshot of a good
        day. Thresholds are the Core Web Vitals definitions. This site ships as
        static files, so a slow first byte is the journey to you, not a server
        thinking.
      </p>
    </div>
  );
}
