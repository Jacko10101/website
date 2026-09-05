"use client";

import { useEffect, useState } from "react";

/**
 * A rail of ticks down the left margin of a long case study, one per
 * section heading, the current one lit. Hover the rail and the section
 * names appear beside the ticks; click one to go there. A reading time
 * sits above it. It exists because the longest page here is nine thousand
 * pixels tall and gave a reader no sense of where they were.
 *
 * Wide screens only, where the container's side padding leaves a margin to
 * sit in. Pages with fewer than four sections get nothing.
 */

interface Item {
  id: string;
  text: string;
}

function slug(text: string) {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 48);
}

export function ReadingRail() {
  const [items, setItems] = useState<Item[]>([]);
  const [active, setActive] = useState<string | null>(null);
  const [minutes, setMinutes] = useState<number | null>(null);

  useEffect(() => {
    let observer: IntersectionObserver | null = null;
    // After layout, so the headings and their positions are final.
    const frame = window.requestAnimationFrame(() => {
      const article = document.querySelector("article");
      if (!article) return;
      const headings = [...article.querySelectorAll("h2")].filter((h) => h.textContent?.trim());
      if (headings.length < 4) return;

      const seen = new Set<string>();
      const list = headings.map((h, i) => {
        let id = h.id || slug(h.textContent ?? "") || `section-${i}`;
        while (seen.has(id)) id = `${id}-${i}`;
        seen.add(id);
        if (!h.id) h.id = id;
        return { id, text: (h.textContent ?? "").trim() };
      });
      setItems(list);

      const words = (article.textContent ?? "").split(/\s+/).filter(Boolean).length;
      setMinutes(Math.max(1, Math.round(words / 230)));

      // The lit tick is the last heading that has crossed the upper third.
      observer = new IntersectionObserver(
        (entries) => {
          for (const entry of entries) {
            if (entry.isIntersecting) setActive((entry.target as HTMLElement).id);
          }
        },
        { rootMargin: "-20% 0px -70% 0px", threshold: 0 },
      );
      for (const h of headings) observer.observe(h);
    });
    return () => {
      window.cancelAnimationFrame(frame);
      observer?.disconnect();
    };
  }, []);

  if (items.length === 0) return null;

  return (
    <nav
      aria-label="Sections"
      className="group fixed left-4 top-1/2 z-30 hidden -translate-y-1/2 flex-col gap-2.5 xl:flex"
    >
      {minutes !== null && (
        <span className="mb-2 font-mono text-[10px] tabular-nums text-muted-foreground/80">
          {minutes} min
        </span>
      )}
      {items.map((item) => {
        const on = item.id === active;
        return (
          <a
            key={item.id}
            href={`#${item.id}`}
            aria-current={on ? "location" : undefined}
            className="relative flex h-3 items-center"
          >
            <span
              aria-hidden
              className={`block h-px transition-[width,background-color] duration-200 ${
                on ? "w-6 bg-primary" : "w-3.5 bg-muted-foreground/40 group-hover:bg-muted-foreground/70"
              }`}
            />
            <span
              className={`pointer-events-none absolute left-9 whitespace-nowrap font-mono text-[11px] opacity-0 transition-opacity duration-150 group-hover:opacity-100 group-focus-within:opacity-100 ${
                on ? "text-primary" : "text-muted-foreground"
              }`}
            >
              {item.text}
            </span>
          </a>
        );
      })}
    </nav>
  );
}
