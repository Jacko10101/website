"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { Nanum_Pen_Script } from "next/font/google";

/**
 * The platform, drawn the way I'd draw it on a whiteboard in an interview:
 * wobbly ink boxes on graph paper, with notes in red pencil. Point at a box
 * and it shades in; click and it opens that case study.
 *
 * rough.js is imported on mount, so it never costs first paint. The links
 * underneath carry the same destinations for keyboard and screen readers;
 * the drawing itself is hidden from assistive technology.
 */

const hand = Nanum_Pen_Script({ weight: "400", subsets: ["latin"], display: "swap" });

const INK = "#1d3a31";
const RED = "#c2412d";

interface Box { id: string; x: number; y: number; w: number; h: number; label: string; href?: string; say: string }

const BOXES: Box[] = [
  { id: "clarity", x: 30, y: 40, w: 150, h: 58, label: "Clarity", href: "/projects/clarity", say: "Clarity: I took it from a prototype to production. The SQL is checked before it runs." },
  { id: "nightshift", x: 30, y: 175, w: 150, h: 58, label: "Nightshift", href: "/projects/nightshift", say: "Nightshift: engineering agents for tagged Jira tickets, PR reviews, security automation and incidents." },
  { id: "gateway", x: 260, y: 105, w: 160, h: 58, label: "AI gateway", href: "/projects/ai-gateway", say: "AI gateway: shared model access, with a separate key and usage records for each consumer." },
  { id: "models", x: 500, y: 105, w: 110, h: 58, label: "models", href: "/projects/ai-gateway", say: "AI gateway: ask for a model that isn’t on your list and you get a 401." },
  { id: "pipe", x: 30, y: 470, w: 520, h: 64, label: "commit  →  shared pipeline  →  image  →  ArgoCD", href: "/projects/pipeline-platform", say: "Delivery: shared Java and Node pipelines, now used by 25 services." },
  { id: "envs", x: 640, y: 250, w: 190, h: 200, label: "", say: "Four environments. ArgoCD promotes the same image through each." },
  { id: "obs", x: 640, y: 40, w: 190, h: 120, label: "observability", href: "/projects/observability", say: "Observability: metrics, logs and traces I built and run, with 72 alerts linked to runbooks." },
  { id: "heimdall", x: 330, y: 300, w: 170, h: 58, label: "Heimdall", href: "/projects/heimdall", say: "Heimdall: the deployment dashboard used by engineers and release managers, including in standup." },
];
const ARROWS = [
  "M180 69 C 220 69, 220 120, 260 128", "M180 204 C 220 204, 220 150, 260 142", "M420 134 L 500 134",
  "M105 233 L 105 470", "M550 502 C 600 502, 600 350, 640 350", "M735 250 L 735 160",
  "M640 100 C 560 100, 520 230, 440 300", "M470 470 L 430 358",
];
const NOTES = [
  { x: 124, y: 330, lines: ["draft PRs only.", "a human merges"] },
  { x: 560, y: 212, lines: ["this is what pages me"], arrow: "M680 204 C 700 196, 712 180, 716 168" },
  { x: 300, y: 262, lines: ["“where’s my change?”"] },
  { x: 40, y: 575, lines: ["everything starts here"] },
];
const RESTING = "Point at a box to see what I did there. Click to read the story.";

export function Whiteboard() {
  const svgRef = useRef<SVGSVGElement>(null);
  const [lit, setLit] = useState<string | null>(null);
  const [ready, setReady] = useState(false);
  const router = useRouter();
  const say = BOXES.find((b) => b.id === lit)?.say ?? RESTING;

  useEffect(() => {
    const svg = svgRef.current;
    if (!svg) return;
    let cancelled = false;
    let timer = 0;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    import("roughjs").then(({ default: rough }) => {
      if (cancelled) return;
      const rc = rough.svg(svg);
      const NS = "http://www.w3.org/2000/svg";
      let hoverId: string | null = null;
      let boil = 0;

      const text = (x: number, y: number, s: string, cls?: string, rot?: number) => {
        const t = document.createElementNS(NS, "text");
        t.setAttribute("x", String(x)); t.setAttribute("y", String(y));
        if (cls) t.setAttribute("class", cls);
        if (rot) t.setAttribute("transform", `rotate(${rot} ${x} ${y})`);
        t.textContent = s;
        return t;
      };
      const render = () => {
        svg.replaceChildren();
        const seed = (k: number) => 7 + k * 13;
        ARROWS.forEach((d, k) => {
          svg.appendChild(rc.path(d, { stroke: INK, strokeWidth: 1.4, roughness: 1.1, seed: seed(k) }));
          const n = d.match(/-?\d+(\.\d+)?/g)!.map(Number);
          const [x2, y2] = n.slice(-2), [x1, y1] = n.slice(-4, -2);
          const a = Math.atan2(y2 - y1, x2 - x1), L = 10;
          svg.appendChild(rc.linearPath([[x2 - L * Math.cos(a - 0.45), y2 - L * Math.sin(a - 0.45)], [x2, y2], [x2 - L * Math.cos(a + 0.45), y2 - L * Math.sin(a + 0.45)]], { stroke: INK, strokeWidth: 1.4, roughness: 0.8, seed: seed(k + 40) }));
        });
        BOXES.forEach((b, k) => {
          const g = document.createElementNS(NS, "g");
          const href = BOXES.find((x) => x.id === hoverId)?.href;
          const on = hoverId === b.id || (!!href && b.href === href);
          g.appendChild(rc.rectangle(b.x, b.y, b.w, b.h, {
            stroke: INK, strokeWidth: on ? 2 : 1.5, roughness: 1.3,
            seed: on ? seed(k + 80) + boil : seed(k + 80),
            fill: on ? "rgba(194,65,45,.5)" : undefined, fillStyle: "hachure", hachureGap: 7, fillWeight: 1.1,
          }));
          if (b.id === "envs") ["dev", "qa", "preprod", "prod"].forEach((e, j) => {
            g.appendChild(rc.rectangle(b.x + 18, b.y + 16 + j * 44, b.w - 36, 32, { stroke: INK, strokeWidth: 1, roughness: 1, seed: seed(j + 120) }));
            g.appendChild(text(b.x + 30, b.y + 37 + j * 44, e));
          });
          else if (b.id === "obs") {
            g.appendChild(text(b.x + 16, b.y + 32, "observability"));
            g.appendChild(text(b.x + 16, b.y + 62, "prometheus · thanos", "sub"));
            g.appendChild(text(b.x + 16, b.y + 92, "loki · tempo · grafana", "sub"));
          } else g.appendChild(text(b.x + 16, b.y + b.h / 2 + 5, b.label));
          const hit = document.createElementNS(NS, "rect");
          hit.setAttribute("x", String(b.x)); hit.setAttribute("y", String(b.y));
          hit.setAttribute("width", String(b.w)); hit.setAttribute("height", String(b.h));
          hit.setAttribute("fill", "transparent");
          g.appendChild(hit);
          if (b.href) g.style.cursor = "pointer";
          g.addEventListener("pointerenter", () => { hoverId = b.id; setLit(b.id); render(); });
          g.addEventListener("click", () => { if (b.href) router.push(b.href); });
          svg.appendChild(g);
        });
        NOTES.forEach((n, k) => {
          n.lines.forEach((line, j) => svg.appendChild(text(n.x, n.y + j * 24, line, "note", k % 2 ? 2 : -3)));
          if (n.arrow) svg.appendChild(rc.path(n.arrow, { stroke: RED, strokeWidth: 1.3, roughness: 1.2, seed: seed(k + 200) }));
        });
      };
      svg.addEventListener("pointerleave", () => { hoverId = null; setLit(null); render(); });
      // The lit box's ink shimmers at about seven frames a second.
      if (!reduced) timer = window.setInterval(() => { if (hoverId) { boil = (boil + 1) % 6; render(); } }, 150);
      document.fonts.ready.then(() => { if (!cancelled) { render(); setReady(true); } });
    });
    return () => { cancelled = true; clearInterval(timer); };
  }, [router]);

  return (
    <figure className="whiteboard" data-ready={ready} style={{ ["--hand" as string]: hand.style.fontFamily }}>
      <svg ref={svgRef} viewBox="0 0 860 600" aria-hidden="true" />
      <figcaption>
        <span aria-live="polite">{say}</span>
        <nav aria-label="Case studies on the whiteboard">
          {BOXES.filter((b) => b.href && b.id !== "models").map((b) => <Link key={b.id} href={b.href!}>{b.label.startsWith("commit") ? "Delivery" : b.label[0].toUpperCase() + b.label.slice(1)}</Link>)}
        </nav>
      </figcaption>
    </figure>
  );
}
