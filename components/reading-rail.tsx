"use client";

import { useEffect, useState, type MouseEvent } from "react";

/**
 * A rail of ticks down the left margin of a long case study, one per
 * section heading, the current one lit. Hover or focus a tick and that
 * section's name appears beside it on a plate; click to go there. A reading
 * time sits above. It exists because the longest page here is nine
 * thousand pixels tall and gave a reader no sense of where they were.
 *
 * The current section is the last heading that has crossed the upper third
 * of the viewport, worked out from geometry on scroll, so the last section
 * lights when you reach it and a deep link lights the right tick.
 *
 * At rest each link is only as wide as its tick, so the rail never sits
 * over the article column; the label joins the link while hovered, which
 * is what keeps the hover alive as the pointer moves onto it.
 *
 * Wide screens only. Pages with fewer than four sections get nothing.
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
    let headings: HTMLElement[] = [];
    let raf = 0;

    const pick = () => {
      raf = 0;
      const line = window.innerHeight * 0.3;
      let current: string | null = headings[0]?.id ?? null;
      for (const h of headings) {
        if (h.getBoundingClientRect().top <= line) current = h.id;
        else break;
      }
      setActive(current);
    };
    const onScroll = () => {
      if (!raf) raf = window.requestAnimationFrame(pick);
    };

    // After layout, so the headings and their positions are final.
    const frame = window.requestAnimationFrame(() => {
      const article = document.querySelector("article");
      if (!article) return;
      headings = [...article.querySelectorAll("h2")].filter((h) => h.textContent?.trim());
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

      pick();
      window.addEventListener("scroll", onScroll, { passive: true });
      window.addEventListener("resize", onScroll);
    });

    return () => {
      window.cancelAnimationFrame(frame);
      if (raf) window.cancelAnimationFrame(raf);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, []);

  if (items.length === 0) return null;

  const go = (e: MouseEvent<HTMLAnchorElement>, id: string) => {
    const target = document.getElementById(id);
    if (!target) return;
    e.preventDefault();
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    target.scrollIntoView({ behavior: reduced ? "auto" : "smooth", block: "start" });
    window.history.replaceState(null, "", `#${id}`);
  };

  return (
    <nav
      aria-label="Sections"
      className="fixed left-4 top-1/2 z-30 hidden -translate-y-1/2 flex-col gap-2 xl:flex"
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
            onClick={(e) => go(e, item.id)}
            aria-current={on ? "location" : undefined}
            className="group/tick flex h-4 items-center pr-2 outline-none"
          >
            <span
              aria-hidden
              className={`block h-px shrink-0 transition-[width,background-color] duration-200 ${
                on ? "w-6 bg-primary" : "w-3.5 bg-muted-foreground/55 group-hover/tick:bg-muted-foreground"
              }`}
            />
            <span
              className={`ml-3 hidden whitespace-nowrap rounded border border-border bg-background px-2 py-0.5 font-mono text-[11px] group-hover/tick:inline group-focus-visible/tick:inline ${
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
