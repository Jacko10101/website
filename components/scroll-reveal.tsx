import { ReactNode } from "react";

/**
 * These used to be scroll-triggered reveals. Body content now renders
 * instantly — motion is reserved for the hero, the pipeline theatre and the
 * interactive demos — so they render plain containers with the same API.
 */
export function FadeUp({
  children,
  className = "",
}: {
  children: ReactNode;
  delay?: number;
  duration?: number;
  className?: string;
  once?: boolean;
}) {
  return <div className={className}>{children}</div>;
}

export function StaggerContainer({
  children,
  className = "",
}: {
  children: ReactNode;
  className?: string;
  staggerDelay?: number;
  initialDelay?: number;
}) {
  return <div className={className}>{children}</div>;
}

export function StaggerItem({
  children,
  className = "",
}: {
  children: ReactNode;
  className?: string;
}) {
  return <div className={className}>{children}</div>;
}

// Animated grid background
export function GridPattern({ opacity = 0.02 }: { opacity?: number }) {
  return (
    <div
      className="absolute inset-0 pointer-events-none"
      style={{
        backgroundImage: `
          linear-gradient(color-mix(in oklab, var(--color-primary) 30%, transparent) 1px, transparent 1px),
          linear-gradient(90deg, color-mix(in oklab, var(--color-primary) 30%, transparent) 1px, transparent 1px)
        `,
        backgroundSize: "60px 60px",
        opacity,
      }}
    />
  );
}

// Glass card component
export function GlassCard({
  children,
  className = "",
  hover = true,
}: {
  children: ReactNode;
  className?: string;
  hover?: boolean;
}) {
  return (
    <div
      className={`
        relative rounded-2xl border border-border
        bg-card/50 backdrop-blur-sm
        ${hover ? "transition-colors duration-200 hover:border-primary/30" : ""}
        ${className}
      `}
    >
      {children}
    </div>
  );
}
