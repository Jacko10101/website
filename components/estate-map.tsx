"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";
import { firstSentence, projects } from "@/lib/projects";
import { plainLeftClick, useTransitionRouter } from "@/components/view-transition";

/**
 * The platform, drawn once: delivery along the bottom, the four
 * environments in the middle, the observability stack watching them,
 * Heimdall reading everything, and on the left the AI layer in the order
 * a call takes: Clarity, through the gateway, out to a model. The five
 * regions are the five Loweconex case studies; hover one and it takes the
 * accent while the rest recedes, and the caption under the map becomes
 * that study's claim and link. Click, and the title travels into the page.
 *
 * Every label is a fact the case studies already state. Traffic moves along
 * the edges slowly, pauses off screen, and stops under reduced motion.
 *
 * The map is decoration for a keyboard or screen-reader user: the rows
 * beneath it carry the same five links with proper names, so the SVG is
 * hidden from assistive technology and out of the tab order. Each region
 * has an invisible hit box, because an SVG <a> has no box of its own and
 * hover would flicker in the gaps between its strokes.
 */

type Key = "pipeline-platform" | "observability" | "heimdall" | "ai-gateway" | "clarity";

const byId = (id: Key) => projects.find((p) => p.id === id);

const ENVS = [
  { x: 136, label: "dev" },
  { x: 310, label: "qa" },
  { x: 484, label: "preprod" },
  { x: 658, label: "prod", prod: true },
];

function Region({
  id,
  hot,
  setHot,
  hit,
  children,
}: {
  id: Key;
  hot: Key | null;
  setHot: (k: Key | null) => void;
  /** Invisible hit boxes, in viewBox units: x, y, width, height. */
  hit: [number, number, number, number][];
  children: ReactNode;
}) {
  const p = byId(id);
  const push = useTransitionRouter();
  if (!p?.href) return null;
  const href = p.href;
  return (
    <a
      href={href}
      className={`region${hot === id ? " hot" : ""}`}
      tabIndex={-1}
      onPointerEnter={() => setHot(id)}
      onPointerLeave={() => setHot(null)}
      onClick={(e) => {
        if (!plainLeftClick(e)) return;
        e.preventDefault();
        push(href);
      }}
    >
      {hit.map(([x, y, w, h]) => (
        <rect key={`${x},${y}`} x={x} y={y} width={w} height={h} fill="transparent" pointerEvents="all" />
      ))}
      {children}
    </a>
  );
}

/** Dashed edges start at different phases, so the flow isn't a metronome. */
function Flow({ d, i, thin = false }: { d: string; i: number; thin?: boolean }) {
  return (
    <path
      className={`edge flow${thin ? " thin" : ""}`}
      d={d}
      style={{ animationDelay: `-${((i * 0.37) % 2.4).toFixed(2)}s` }}
    />
  );
}

export function EstateMap() {
  const [hot, setHot] = useState<Key | null>(null);
  const [paused, setPaused] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const active = hot ? byId(hot) : null;

  // Eighteen dashed edges animating for a map that has scrolled away is
  // paint work for nobody; pause them off screen.
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(([entry]) => setPaused(!entry.isIntersecting));
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <div className="hidden lg:block" ref={ref}>
      <div
        className="estate max-w-[1100px]"
        data-hot={hot ?? undefined}
        data-paused={paused ? "" : undefined}
        aria-hidden
      >
        <svg viewBox="0 0 960 600" className="block h-auto w-full overflow-visible">
          {/* the environments: the ground everything else stands on */}
          <g className="neutral">
            {ENVS.map((e) => (
              <g key={e.label}>
                <rect className="env" x={e.x} y={350} width={148} height={102} />
                <text className="sub" x={e.x + 12} y={368}>
                  {e.label}
                </text>
                {Array.from({ length: 20 }, (_, i) => (
                  <circle
                    key={i}
                    className={`svc${e.prod ? " prod" : ""}`}
                    cx={e.x + 22 + (i % 5) * 26}
                    cy={388 + Math.floor(i / 5) * 16}
                    r={2.6}
                  />
                ))}
              </g>
            ))}
          </g>

          <Region id="pipeline-platform" hot={hot} setHot={setHot} hit={[[40, 512, 680, 72], [822, 386, 120, 56]]}>
            <Flow d="M232 540 H262" i={0} />
            <Flow d="M334 540 H372" i={1} />
            <Flow d="M520 540 H560" i={2} />
            <Flow d="M640 526 C 640 480, 210 500, 210 452" i={3} />
            <Flow d="M645 526 C 645 480, 384 500, 384 452" i={4} />
            <Flow d="M650 526 C 650 490, 558 500, 558 452" i={5} />
            <Flow d="M655 526 C 655 490, 732 500, 732 452" i={6} />
            <Flow d="M720 541 C 790 541, 822 470, 822 407" i={7} />
            <rect className="node" x={40} y={526} width={192} height={30} />
            <text className="big" x={52} y={545}>Bitbucket Pipelines</text>
            <text className="sub" x={52} y={570}>shared library · one file per service</text>
            <rect className="node" x={262} y={526} width={72} height={30} />
            <text className="big" x={277} y={545}>ECR</text>
            <rect className="node" x={372} y={526} width={148} height={30} />
            <text className="big" x={384} y={545}>GitOps repo</text>
            <text className="sub" x={384} y={570}>image updater · kustomize</text>
            <rect className="node" x={560} y={526} width={160} height={30} />
            <text className="big" x={572} y={545}>ArgoCD</text>
            <text className="sub" x={572} y={570}>sync · ~400 deploys a month</text>
            <rect className="node" x={822} y={392} width={120} height={30} />
            <text className="big" x={834} y={411}>Sentry</text>
            <text className="sub" x={834} y={436}>post-deploy tests</text>
          </Region>

          <Region id="observability" hot={hot} setHot={setHot} hit={[[700, 58, 250, 180]]}>
            <Flow d="M210 350 C 210 300, 700 300, 736 236" i={8} thin />
            <Flow d="M384 350 C 384 305, 720 300, 748 236" i={9} thin />
            <Flow d="M558 350 C 558 310, 740 300, 760 236" i={10} thin />
            <Flow d="M732 350 C 732 310, 760 300, 772 236" i={11} thin />
            <rect className="node" x={700} y={150} width={250} height={86} />
            <text className="big" x={714} y={172}>Prometheus · Thanos</text>
            <text className="big" x={714} y={196}>Loki</text>
            <text className="big" x={714} y={220}>Tempo</text>
            <text className="sub" x={886} y={172}>metrics</text>
            <text className="sub" x={886} y={196}>logs</text>
            <text className="sub" x={886} y={220}>traces</text>
            <path className="edge" d="M760 150 V118" />
            <path className="edge" d="M890 150 V118" />
            <rect className="node" x={700} y={88} width={110} height={30} />
            <text className="big" x={712} y={107}>Grafana</text>
            <rect className="node" x={830} y={88} width={120} height={30} />
            <text className="big" x={842} y={107}>Alertmanager</text>
            <text className="sub" x={700} y={72}>22 dashboards · 50+ alerts, a runbook each</text>
          </Region>

          <Region id="heimdall" hot={hot} setHot={setHot} hit={[[250, 66, 372, 72]]}>
            <Flow d="M136 526 C 136 420, 300 210, 400 132" i={12} />
            <Flow d="M640 526 C 640 420, 560 200, 500 132" i={13} />
            <Flow d="M882 392 C 882 330, 660 250, 580 132" i={14} />
            <path className="edge" d="M330 96 H372" />
            <rect className="node ext" x={250} y={82} width={80} height={30} />
            <text x={262} y={101}>Jira</text>
            <rect className="node" x={372} y={72} width={250} height={60} />
            <text className="big" x={386} y={96}>Heimdall</text>
            <text className="sub" x={386} y={118}>where every ticket is · 20+ engineers daily</text>
          </Region>

          {/* The AI layer reads top-down the way a call goes out: Clarity asks,
              the gateway checks the key and the allowlist, the model answers. */}
          <Region id="ai-gateway" hot={hot} setHot={setHot} hit={[[40, 46, 200, 146]]}>
            <Flow d="M130 118 V92" i={15} />
            <rect className="node ext" x={72} y={62} width={116} height={30} />
            <text x={86} y={81}>Gemini</text>
            <rect className="node" x={40} y={118} width={200} height={46} />
            <text className="big" x={54} y={138}>AI Gateway</text>
            <text className="sub" x={54} y={155}>LiteLLM · allowlists per key</text>
            <text className="sub" x={54} y={184}>every model call goes through it</text>
          </Region>

          <Region id="clarity" hot={hot} setHot={setHot} hit={[[40, 204, 200, 70]]}>
            <Flow d="M130 210 V164" i={16} />
            <Flow d="M240 240 C 420 240, 640 260, 700 350" i={17} thin />
            <rect className="node" x={40} y={210} width={200} height={58} />
            <text className="big" x={54} y={232}>Clarity</text>
            <text className="sub" x={54} y={250}>English in, SQL that ran out</text>
            <text className="sub" x={54} y={264}>~30 tenants · no vector store</text>
          </Region>
        </svg>

        <p className="mt-3 flex min-h-5 items-baseline gap-3.5 font-mono text-xs text-muted-foreground/80">
          {active ? (
            <>
              <span className="rounded border border-primary/45 px-1.5 py-0.5 text-[10px] uppercase tracking-[0.16em] text-primary">
                {active.docType}
              </span>
              <span className="text-foreground">{firstSentence(active.outcome ?? active.description)}</span>
              <span className="ml-auto whitespace-nowrap text-primary">{active.docCta ?? "case study"} →</span>
            </>
          ) : (
            <span>The platform at Loweconex, 2023 to now. The five case studies are places on it; hover one.</span>
          )}
        </p>
      </div>
    </div>
  );
}
