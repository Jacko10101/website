"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";
import Image from "next/image";

interface Metric {
  title: string;
  description: string;
  imagePath: string;
  category: string;
}

interface MetricsShowcaseProps {
  metrics: Metric[];
}

export function MetricsShowcase({ metrics }: MetricsShowcaseProps) {
  const [selectedMetric, setSelectedMetric] = useState<Metric | null>(null);

  return (
    <>
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {metrics.map((metric, index) => (
          <motion.div
            key={metric.title}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.3, delay: index * 0.1 }}
            onClick={() => setSelectedMetric(metric)}
            className="group cursor-pointer overflow-hidden rounded-lg border border-border bg-card transition-all hover:border-primary hover:shadow-lg"
          >
            <div className="relative aspect-video overflow-hidden bg-secondary">
              <Image
                src={metric.imagePath}
                alt={metric.title}
                fill
                className="object-cover transition-transform group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-background/80 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
            </div>
            <div className="p-4">
              <div className="mb-2">
                <span className="text-xs font-medium text-primary">
                  {metric.category}
                </span>
              </div>
              <h3 className="mb-2 font-semibold group-hover:text-primary transition-colors">
                {metric.title}
              </h3>
              <p className="text-sm text-muted-foreground line-clamp-2">
                {metric.description}
              </p>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Modal */}
      <AnimatePresence>
        {selectedMetric && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setSelectedMetric(null)}
            className="fixed inset-0 z-50 flex items-center justify-center bg-background/95 p-4 backdrop-blur-sm"
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="relative max-w-6xl w-full max-h-[90vh] overflow-auto rounded-lg border border-border bg-card shadow-2xl"
            >
              <button
                onClick={() => setSelectedMetric(null)}
                className="sticky top-4 right-4 z-10 ml-auto flex items-center justify-center rounded-full bg-secondary p-2 hover:bg-accent transition-colors"
                aria-label="Close modal"
              >
                <X className="h-5 w-5" />
              </button>
              <div className="p-6">
                <div className="mb-4">
                  <span className="text-xs font-medium text-primary">
                    {selectedMetric.category}
                  </span>
                  <h2 className="mt-2 text-2xl font-bold">
                    {selectedMetric.title}
                  </h2>
                  <p className="mt-2 text-muted-foreground">
                    {selectedMetric.description}
                  </p>
                </div>
                <div className="relative aspect-video w-full overflow-hidden rounded-lg border border-border">
                  <Image
                    src={selectedMetric.imagePath}
                    alt={selectedMetric.title}
                    fill
                    className="object-contain"
                  />
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
