"use client";

import { motion } from "framer-motion";
import {
  Cloud,
  Server,
  GitBranch,
  Activity,
  Container,
  Database,
  Shield,
  Zap,
} from "lucide-react";

const technologies = [
  { name: "Kubernetes", icon: Container, color: "text-blue-500" },
  { name: "AWS", icon: Cloud, color: "text-orange-500" },
  { name: "ArgoCD", icon: GitBranch, color: "text-purple-500" },
  { name: "Prometheus", icon: Activity, color: "text-red-500" },
  { name: "Terraform", icon: Server, color: "text-indigo-500" },
  { name: "PostgreSQL", icon: Database, color: "text-cyan-500" },
  { name: "Istio", icon: Shield, color: "text-green-500" },
  { name: "Kafka", icon: Zap, color: "text-yellow-500" },
];

export function TechStack() {
  return (
    <section className="border-b border-border py-24">
      <div className="container px-4 md:px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="mb-12 text-center"
        >
          <h2 className="mb-4 text-3xl font-bold tracking-tight sm:text-4xl md:text-5xl">
            Tech Stack
          </h2>
          <p className="mx-auto max-w-2xl text-lg text-muted-foreground">
            Tools I work with daily to build production-grade infrastructure.
          </p>
        </motion.div>

        <div className="grid grid-cols-2 gap-6 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-8">
          {technologies.map((tech, index) => (
            <motion.div
              key={tech.name}
              initial={{ opacity: 0, scale: 0.8 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.3, delay: index * 0.05 }}
              whileHover={{ scale: 1.1, rotate: 5 }}
              className="group relative flex flex-col items-center justify-center gap-3 rounded-lg border border-border bg-card p-6 transition-all hover:border-primary hover:shadow-lg"
            >
              <tech.icon className={`h-10 w-10 ${tech.color} transition-transform group-hover:scale-110`} />
              <span className="text-sm font-medium text-center">{tech.name}</span>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
