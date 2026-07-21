"use client";

import { useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { SectionHeading } from "@/components/section-heading";

interface MapNode {
  id: string;
  label: string;
  sub?: string;
  title: string;
  description: string;
  x: number;
  y: number;
  w: number;
  h: number;
  variant?: "plain" | "sub" | "foundation";
}

// One diagram instead of seven cards: the stack I actually run, drawn as the
// system it is. Every node is focusable; details render below the SVG.
const nodes: MapNode[] = [
  {
    id: "git",
    label: "git",
    sub: "source of truth",
    title: "Git as the control plane",
    description:
      "Everything downstream of this node is derived state. Deploys, rollbacks, promotions and infrastructure all trace back to a commit.",
    x: 20, y: 210, w: 130, h: 64,
  },
  {
    id: "security",
    label: "security",
    sub: "SAST · SCA · policy",
    title: "Security automation",
    description:
      "SAST and SCA scanning wired into CI so it isn't optional, runtime security on the cluster, policy-as-code for the things people forget.",
    x: 190, y: 90, w: 160, h: 58,
  },
  {
    id: "ci",
    label: "ci pipeline",
    sub: "shared library",
    title: "CI/CD pipelines",
    description:
      "One shared pipeline library imported by every service — build, test, scan, push. ~400 deploys/month across 20 services on a single .ci/builds.yaml.",
    x: 190, y: 210, w: 160, h: 64,
  },
  {
    id: "argocd",
    label: "argocd",
    sub: "gitops",
    title: "GitOps with ArgoCD",
    description:
      "ArgoCD and Image Updater reconcile the cluster to what git says. Promotion is a commit, rollback is a revert, the audit log is git log.",
    x: 410, y: 210, w: 150, h: 64,
  },
  {
    id: "cluster",
    label: "kubernetes",
    sub: "EKS · K3s",
    title: "Kubernetes & EKS",
    description:
      "Cluster operations end to end: GPU node pools, zero-downtime upgrades, right-sizing for cost. The same discipline runs my single-node K3s homelab.",
    x: 620, y: 120, w: 220, h: 250,
  },
  {
    id: "services",
    label: "services",
    title: "Production services",
    description:
      "A couple dozen Java and Node services, deployed through the shared pipeline and watched by Heimdall.",
    x: 640, y: 172, w: 180, h: 48,
    variant: "sub",
  },
  {
    id: "gpu",
    label: "gpu pool",
    sub: "ml workloads",
    title: "MLOps & AI infrastructure",
    description:
      "Where the platform work is heading: model serving on K8s, GPU scheduling and reproducible training pipelines. MSc dissertation in progress on GPU-aware scheduling.",
    x: 640, y: 236, w: 180, h: 48,
    variant: "sub",
  },
  {
    id: "data",
    label: "kafka",
    sub: "streams",
    title: "Data platforms",
    description:
      "Kafka and stream processing — training data pipelines and schema evolution that doesn't break consumers.",
    x: 640, y: 300, w: 180, h: 48,
    variant: "sub",
  },
  {
    id: "obs",
    label: "observability",
    sub: "prom · grafana · loki",
    title: "Observability",
    description:
      "Self-hosted Prometheus, Grafana and Loki — ~25 dashboards, 50+ alerts with a runbook each, at ~£5k/yr instead of ~£100k commercial.",
    x: 620, y: 410, w: 220, h: 58,
  },
  {
    id: "aws",
    label: "aws",
    sub: "EKS · VPC · IAM · MSK",
    title: "AWS",
    description:
      "EKS, IAM, VPC, Route 53, S3, MSK, RDS — the boring fundamentals, done properly.",
    x: 20, y: 410, w: 540, h: 58,
    variant: "foundation",
  },
];

const edges = [
  { from: "git", to: "ci", d: "M150 242 H190" },
  { from: "security", to: "ci", d: "M270 148 V210" },
  { from: "ci", to: "argocd", d: "M350 242 H410" },
  { from: "argocd", to: "cluster", d: "M560 242 H620" },
  { from: "cluster", to: "obs", d: "M730 370 V410", dashed: true },
];

export function SystemMap() {
  const [selected, setSelected] = useState("cluster");
  const active = nodes.find((n) => n.id === selected)!;

  return (
    <section className="relative py-24 md:py-32 overflow-hidden">
      <div className="container">
        <SectionHeading
          command="cat platform.svg"
          title="What I build"
          index="02"
          lede="Not a list of logos — the system itself. Select a node; everything here is something I have run in production or at home."
        />

        <div className="xl:grid xl:grid-cols-[1fr_20rem] xl:gap-8 xl:items-start">
        <div className="overflow-x-auto pb-2">
          <motion.svg
            viewBox="0 0 860 490"
            className="min-w-[720px] w-full max-w-5xl"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-80px" }}
            role="group"
            aria-label="Diagram of the platform stack: git feeds CI, CI feeds ArgoCD, ArgoCD reconciles Kubernetes, observability watches everything, all running on AWS"
          >
            {/* Edges */}
            {edges.map((edge) => (
              <motion.path
                key={`${edge.from}-${edge.to}`}
                d={edge.d}
                fill="none"
                stroke="var(--color-border)"
                strokeWidth={1.5}
                strokeDasharray={edge.dashed ? "4 4" : undefined}
                variants={{
                  hidden: { pathLength: 0, opacity: 0 },
                  visible: {
                    pathLength: 1,
                    opacity: 1,
                    transition: { duration: 0.8, delay: 0.3 },
                  },
                }}
              />
            ))}
            {/* Flow arrows */}
            {[{ x: 178, y: 242 }, { x: 398, y: 242 }, { x: 608, y: 242 }].map((p, i) => (
              <motion.path
                key={i}
                d={`M${p.x - 8} ${p.y - 5} L${p.x} ${p.y} L${p.x - 8} ${p.y + 5}`}
                fill="none"
                stroke="var(--color-primary)"
                strokeWidth={1.5}
                variants={{
                  hidden: { opacity: 0 },
                  visible: { opacity: 0.7, transition: { delay: 0.9 + i * 0.15 } },
                }}
              />
            ))}

            {/* Nodes */}
            {nodes.map((node, i) => {
              const isActive = node.id === selected;
              const isCluster = node.id === "cluster";
              return (
                <motion.g
                  key={node.id}
                  tabIndex={0}
                  role="button"
                  aria-pressed={isActive}
                  aria-label={`${node.title} — select for details`}
                  className="cursor-pointer focus:outline-none"
                  onClick={() => setSelected(node.id)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" || e.key === " ") {
                      e.preventDefault();
                      setSelected(node.id);
                    }
                  }}
                  variants={{
                    hidden: { opacity: 0, y: 8 },
                    visible: {
                      opacity: 1,
                      y: 0,
                      transition: { duration: 0.4, delay: 0.1 + i * 0.06 },
                    },
                  }}
                >
                  <rect
                    x={node.x}
                    y={node.y}
                    width={node.w}
                    height={node.h}
                    rx={6}
                    fill={
                      isCluster
                        ? "transparent"
                        : isActive
                          ? "oklch(0.72 0.19 150 / 0.1)"
                          : "var(--color-card)"
                    }
                    stroke={isActive ? "var(--color-primary)" : "var(--color-border)"}
                    strokeWidth={isActive ? 1.5 : 1}
                    strokeDasharray={node.variant === "foundation" ? "5 4" : undefined}
                  />
                  <text
                    x={isCluster ? node.x + 12 : node.x + node.w / 2}
                    y={isCluster ? node.y + 24 : node.y + (node.sub ? node.h / 2 - 4 : node.h / 2 + 4)}
                    textAnchor={isCluster ? "start" : "middle"}
                    className="font-mono"
                    fontSize={13}
                    fontWeight={600}
                    fill={isActive ? "var(--color-primary)" : "var(--color-foreground)"}
                  >
                    {node.label}
                  </text>
                  {node.sub && (
                    <text
                      x={isCluster ? node.x + 12 : node.x + node.w / 2}
                      y={isCluster ? node.y + 40 : node.y + node.h / 2 + 14}
                      textAnchor={isCluster ? "start" : "middle"}
                      className="font-mono"
                      fontSize={10}
                      fill="var(--color-muted-foreground)"
                    >
                      {node.sub}
                    </text>
                  )}
                </motion.g>
              );
            })}
          </motion.svg>
        </div>

        {/* Detail panel — beside the diagram on wide screens */}
        <motion.div
          key={active.id}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="mt-6 xl:mt-2 max-w-3xl rounded-lg border border-primary/30 bg-card/70 p-6 glow-border xl:sticky xl:top-28"
          aria-live="polite"
        >
          <p className="font-mono text-[10px] uppercase tracking-wider text-muted-foreground mb-2">selected node</p>
          <h3 className="font-mono font-semibold text-lg text-primary mb-2">
            {active.title}
          </h3>
          <p className="text-muted-foreground leading-relaxed text-sm">{active.description}</p>
        </motion.div>
        </div>

        <div className="mt-12">
          <Link
            href="/projects"
            className="inline-flex items-center gap-2 font-mono text-primary hover:text-foreground transition-colors"
          >
            Or just look at what I&apos;ve shipped →
          </Link>
        </div>
      </div>
    </section>
  );
}
