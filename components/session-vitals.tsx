"use client";

import { useEffect, useState } from "react";

interface Vital {
  id: string;
  label: string;
  value: string | null;
  rating: "good" | "ok" | "poor" | null;
  hint: string;
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

    const observers: PerformanceObserver[] = [];

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
      value: ttfb !== null ? `${ttfb}ms` : null,
      rating: ttfb !== null ? rate(ttfb, 200, 600) : null,
      hint: "time to first byte",
    },
    {
      id: "fcp",
      label: "FCP",
      value: fcp !== null ? `${fcp}ms` : null,
      rating: fcp !== null ? rate(fcp, 1800, 3000) : null,
      hint: "first contentful paint",
    },
    {
      id: "lcp",
      label: "LCP",
      value: lcp !== null ? `${lcp}ms` : null,
      rating: lcp !== null ? rate(lcp, 2500, 4000) : null,
      hint: "largest contentful paint",
    },
    {
      id: "cls",
      label: "CLS",
      value: cls !== null ? cls.toFixed(3) : null,
      rating: cls !== null ? rate(cls, 0.1, 0.25) : null,
      hint: "cumulative layout shift",
    },
  ];

  const ratingClasses = {
    good: "text-primary border-primary/40",
    ok: "text-warn border-warn/40",
    poor: "text-error border-error/40",
  };

  return (
    <div>
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {vitals.map((vital) => (
          <div
            key={vital.id}
            className={`rounded-md border bg-card/60 p-4 ${
              vital.rating ? ratingClasses[vital.rating] : "border-border text-muted-foreground"
            }`}
          >
            <div className="font-mono text-2xl font-semibold">
              {vital.value ?? "—"}
            </div>
            <div className="font-mono text-xs mt-1 text-foreground/80">{vital.label}</div>
            <div className="text-[10px] text-muted-foreground">{vital.hint}</div>
          </div>
        ))}
      </div>
      <p className="mt-3 text-xs text-muted-foreground">
        Measured in your browser, on this visit — not a screenshot of a good day.
        Thresholds follow the Core Web Vitals definitions.
      </p>
    </div>
  );
}
