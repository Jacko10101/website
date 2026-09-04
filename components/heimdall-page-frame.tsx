import Link from "next/link";
import { ReactNode } from "react";
import { ArrowLeft, ArrowRight } from "lucide-react";

/**
 * Heimdall-only page frame. The case study reads as a day on the platform
 * team, so the page is set as the shift log itself: one continuous rail runs
 * down the left margin and every section is an entry appended to it — a node
 * on the rail, a hairline rule, then the entry body.
 *
 * Clock times are only printed where they are true: the morning entries when
 * the tool actually gets opened, and the end-of-day close. Entries that
 * explain how the thing is built sit on the same rail with no time, because
 * "how it's wired" does not happen at half twelve.
 *
 * The rail is drawn per-entry (each entry owns the segment from its node to
 * the next entry's node), so it stays continuous as long as entries stack
 * with zero vertical margin between them; spacing lives in each entry's
 * padding-bottom. Deliberately not the shared CaseStudyHero / TechSidebar /
 * CaseStudyCTA the other studies use.
 */

/* Shared rail geometry. Node is 11px wide centred on x = 5.5px; the segment
   is a 1px line at left: 5px. Entries indent their content clear of both. */
const ENTRY_INDENT = "pl-7 sm:pl-12";

function RailNode({ top }: { top: string }) {
  return (
    <span
      className="absolute left-0 w-[11px] h-[11px] rounded-full border-2 border-primary bg-background z-10"
      style={{ top }}
      aria-hidden
    />
  );
}

/**
 * One entry in the day's log. `time` is optional: omit it for entries that
 * belong on the rail but don't happen at a particular hour. `pos` controls
 * the rail segment:
 * - "first"  — the segment starts at this entry's node and runs down;
 * - "middle" — the segment runs the full height (the node sits on it);
 * - "last"   — a stub from the top down to the node, then the rail ends.
 */
export function LogEntry({
  time,
  label,
  title,
  children,
  pos = "middle",
  className = "",
}: {
  time?: string;
  label: string;
  title?: string;
  children: ReactNode;
  pos?: "first" | "middle" | "last";
  className?: string;
}) {
  const spacing = pos === "last" ? "" : "pb-12 md:pb-16";
  // Untimed entries have a shorter header line, so their node sits higher.
  const nodeTop = time ? "9px" : "5px";
  const stubHeight = time ? "h-[14px]" : "h-[10px]";
  return (
    <section className={`relative ${ENTRY_INDENT} ${spacing} ${className}`}>
      <span
        className={`absolute left-[5px] w-px bg-border ${
          pos === "first"
            ? "top-[14px] bottom-0"
            : pos === "last"
              ? `top-0 ${stubHeight}`
              : "top-0 bottom-0"
        }`}
        aria-hidden
      />
      <RailNode top={nodeTop} />

      <div className="flex flex-wrap items-baseline gap-x-4 gap-y-1 font-mono">
        {time && (
          <span className="text-2xl font-semibold text-primary glow-soft tabular-nums shrink-0">
            {time}
          </span>
        )}
        <span className="text-sm text-muted-foreground tracking-wider">{label}</span>
      </div>

      <div className="border-t border-border/60 mt-3 pt-5">
        {title && (
          <h2 className="display text-2xl sm:text-3xl text-foreground mb-6">
            {title}
          </h2>
        )}
        {children}
      </div>
    </section>
  );
}

// The day starting: back link and log preamble sit above the rail, then the
// first entry — 08:52, the clock the whole page hangs from — opens the rail
// that runs unbroken to 18:05. The title block is that entry's body.
export function DayLogHeader() {
  return (
    <header className="relative pt-24 md:pt-28 overflow-hidden">
      <div className="absolute inset-0 grid-background pointer-events-none" aria-hidden />

      <div className="container px-4 relative z-10">
        <div className="max-w-7xl mx-auto">
          <Link
            href="/projects"
            className="inline-flex items-center gap-2 text-sm font-mono text-muted-foreground hover:text-primary transition-colors mb-6 group"
          >
            <ArrowLeft className="h-4 w-4 group-hover:-translate-x-1 transition-transform" />
            Back to Projects
          </Link>

          <p className="font-mono text-xs text-muted-foreground tracking-wider mb-6">
            day log · platform team
          </p>

          {/* Entry zero. Larger clock than the entries below — the day starts
              here — so the node and segment offsets are its own. */}
          <div className={`relative ${ENTRY_INDENT} pb-12 md:pb-16`}>
            <span
              className="absolute left-[5px] top-[19px] bottom-0 w-px bg-border"
              aria-hidden
            />
            <RailNode top="14px" />

            <div className="flex flex-wrap items-baseline gap-x-4 gap-y-1 font-mono">
              <span className="text-3xl sm:text-4xl font-semibold text-primary glow-soft tabular-nums shrink-0">
                08:52
              </span>
              <span className="text-sm text-muted-foreground tracking-wider">
                first tab of the day
              </span>
            </div>

            <div className="border-t border-border/60 mt-3 pt-5 max-w-4xl">
              <h1 className="display text-4xl sm:text-5xl md:text-6xl text-foreground mb-3">
                Heimdall
              </h1>
              <p className="font-mono text-sm text-muted-foreground mb-3">
                One page showing where every ticket and every service actually is.
              </p>
              <p className="font-mono text-xs text-muted-foreground mb-5">
                Built and run it solo · Loweconex, a UK IoT platform business ·
                2025 → ongoing
              </p>
              <p className="text-xl text-muted-foreground leading-relaxed">
                Before standup, before email, the platform team opens the same
                page. It answers one question across 20 services and four
                environments: where is my ticket right now? More than 20
                engineers use it every morning, and standup runs off it.
              </p>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}

/* The one panel that earns a box: the wall display beside the log, showing
   the dashboard's own vitals. Set as a screen — dark glass, chrome bar,
   live dot — not a card. */
function WallDisplay({
  label,
  note,
  children,
}: {
  label: string;
  note?: ReactNode;
  children: ReactNode;
}) {
  return (
    <div className="rounded-md border border-border bg-black/40 overflow-hidden">
      <div className="flex items-center justify-between gap-3 px-4 py-2.5 border-b border-border">
        <h3 className="font-mono text-xs tracking-wider text-primary">{label}</h3>
        {note && (
          <span className="font-mono text-[10px] text-muted-foreground">{note}</span>
        )}
      </div>
      <div className="p-4">{children}</div>
    </div>
  );
}

/* Everything else on the desk is just a list under a mono heading and a
   hairline rule — notes pinned beside the display, not more boxes. */
function DeskList({ label, children }: { label: string; children: ReactNode }) {
  return (
    <div className="border-t border-border/60 pt-4">
      <h3 className="font-mono text-xs tracking-wider text-primary mb-4">{label}</h3>
      {children}
    </div>
  );
}

// The desk: the dashboard's own vitals on a wall display, then what's
// running, and the other tabs open, worn as day-log furniture.
export function DayLogSidebar({
  vitals,
  technologies,
  related,
}: {
  vitals: Array<{ label: string; value: string }>;
  technologies: string[];
  related: Array<{ title: string; href: string }>;
}) {
  return (
    <aside className="space-y-8 lg:sticky lg:top-24 self-start">
      <WallDisplay
        label="vitals"
        note={
          <span className="inline-flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" aria-hidden />
            live
          </span>
        }
      >
        <dl className="divide-y divide-border/60">
          {vitals.map((v) => (
            <div
              key={v.label}
              className="flex items-baseline justify-between gap-4 py-2.5 first:pt-0 last:pb-0"
            >
              <dt className="font-mono text-xs text-muted-foreground shrink-0">
                {v.label}
              </dt>
              <dd className="text-sm text-foreground text-right">{v.value}</dd>
            </div>
          ))}
        </dl>
      </WallDisplay>

      <DeskList label="stack">
        <div className="flex flex-wrap gap-x-3 gap-y-1.5 font-mono text-xs text-muted-foreground">
          {technologies.map((tech) => (
            <span key={tech} className="hover:text-foreground transition-colors">
              {tech}
            </span>
          ))}
        </div>
      </DeskList>

      <DeskList label="related">
        <div className="space-y-3">
          {related.map((project) => (
            <Link
              key={project.href}
              href={project.href}
              className="flex items-center justify-between gap-3 text-sm font-medium hover:text-primary transition-colors group"
            >
              <span>{project.title}</span>
              <ArrowRight className="w-4 h-4 shrink-0 group-hover:translate-x-1 transition-transform" />
            </Link>
          ))}
        </div>
      </DeskList>
    </aside>
  );
}

// The day ending: the last entry on the rail. `pos="last"` stops the rail at
// the 18:05 node, closing the line the header opened.
export function DayLogClose() {
  return (
    <LogEntry time="18:05" label="clocking off" pos="last">
      <p>
        <Link
          href="/contact"
          className="font-mono text-sm text-primary hover:underline underline-offset-4"
        >
          say hello →
        </Link>
      </p>
    </LogEntry>
  );
}
