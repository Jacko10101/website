"use client";

import { useState } from "react";
import { motion } from "framer-motion";

interface Metric {
  label: string;
  before: string;
  after: string;
  unit?: string;
}

interface BeforeAfterSliderProps {
  metrics: Metric[];
}

export function BeforeAfterSlider({ metrics }: BeforeAfterSliderProps) {
  const [sliderPosition, setSliderPosition] = useState(50);
  const [isDragging, setIsDragging] = useState(false);

  const handleMouseDown = () => setIsDragging(true);
  const handleMouseUp = () => setIsDragging(false);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!isDragging) return;

    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const percentage = (x / rect.width) * 100;
    setSliderPosition(Math.max(0, Math.min(100, percentage)));
  };

  const handleTouchMove = (e: React.TouchEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.touches[0].clientX - rect.left;
    const percentage = (x / rect.width) * 100;
    setSliderPosition(Math.max(0, Math.min(100, percentage)));
  };

  return (
    <div className="w-full space-y-6">
      {metrics.map((metric, index) => (
        <div key={index} className="space-y-3">
          <div className="text-sm font-medium text-muted-foreground">
            {metric.label}
          </div>

          {/* Slider Container */}
          <div
            className="relative h-20 overflow-hidden rounded-lg border border-border bg-card cursor-col-resize select-none"
            onMouseMove={handleMouseMove}
            onMouseDown={handleMouseDown}
            onMouseUp={handleMouseUp}
            onMouseLeave={handleMouseUp}
            onTouchMove={handleTouchMove}
            onTouchEnd={handleMouseUp}
          >
            {/* Before (Red) - Left Side */}
            <motion.div
              className="absolute inset-0 flex items-center justify-center bg-gradient-to-r from-red-500/10 to-red-500/5"
              style={{ clipPath: `inset(0 ${100 - sliderPosition}% 0 0)` }}
            >
              <div className="flex items-center gap-2">
                <span className="text-2xl font-bold text-red-600">
                  {metric.before}
                </span>
                {metric.unit && (
                  <span className="text-sm text-red-600/70">{metric.unit}</span>
                )}
              </div>
              <div className="absolute left-4 top-2 text-xs font-semibold text-red-600 uppercase tracking-wide">
                Before
              </div>
            </motion.div>

            {/* After (Green) - Right Side */}
            <motion.div
              className="absolute inset-0 flex items-center justify-center bg-gradient-to-r from-green-500/5 to-green-500/10"
              style={{ clipPath: `inset(0 0 0 ${sliderPosition}%)` }}
            >
              <div className="flex items-center gap-2">
                <span className="text-2xl font-bold text-green-600">
                  {metric.after}
                </span>
                {metric.unit && (
                  <span className="text-sm text-green-600/70">{metric.unit}</span>
                )}
              </div>
              <div className="absolute right-4 top-2 text-xs font-semibold text-green-600 uppercase tracking-wide">
                After
              </div>
            </motion.div>

            {/* Slider Handle */}
            <motion.div
              className="absolute top-0 bottom-0 w-1 bg-primary cursor-col-resize"
              style={{ left: `${sliderPosition}%` }}
              drag="x"
              dragConstraints={{ left: 0, right: 0 }}
              dragElastic={0}
              dragMomentum={false}
              onDrag={(_, info) => {
                const rect = (info.point.x / window.innerWidth) * 100;
                setSliderPosition(Math.max(0, Math.min(100, rect)));
              }}
            >
              {/* Handle Circle */}
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-8 w-8 rounded-full bg-primary shadow-lg flex items-center justify-center">
                <div className="flex gap-0.5">
                  <div className="w-0.5 h-4 bg-primary-foreground rounded" />
                  <div className="w-0.5 h-4 bg-primary-foreground rounded" />
                </div>
              </div>
            </motion.div>
          </div>

          {/* Helper Text */}
          <div className="text-xs text-center text-muted-foreground">
            Drag the slider to compare before and after
          </div>
        </div>
      ))}
    </div>
  );
}
