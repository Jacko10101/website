"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";

const commands = [
  { cmd: "kubectl get pods -n production", delay: 0 },
  { cmd: "argocd app sync platform --prune", delay: 2000 },
  { cmd: "helm upgrade prometheus ./charts/observability", delay: 4000 },
  { cmd: "terraform apply -auto-approve", delay: 6000 },
];

export function Terminal() {
  const [currentCommand, setCurrentCommand] = useState(0);
  const [displayText, setDisplayText] = useState("");
  const [isTyping, setIsTyping] = useState(false);

  useEffect(() => {
    if (currentCommand >= commands.length) {
      // Reset after showing all commands
      const resetTimer = setTimeout(() => {
        setCurrentCommand(0);
        setDisplayText("");
      }, 3000);
      return () => clearTimeout(resetTimer);
    }

    const command = commands[currentCommand];
    const timer = setTimeout(() => {
      setIsTyping(true);
      let charIndex = 0;

      const typeInterval = setInterval(() => {
        if (charIndex < command.cmd.length) {
          setDisplayText(command.cmd.substring(0, charIndex + 1));
          charIndex++;
        } else {
          clearInterval(typeInterval);
          setIsTyping(false);
          setTimeout(() => {
            setCurrentCommand(prev => prev + 1);
            setDisplayText("");
          }, 1500);
        }
      }, 50);

      return () => clearInterval(typeInterval);
    }, command.delay);

    return () => clearTimeout(timer);
  }, [currentCommand]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.6 }}
      className="mx-auto max-w-3xl mt-8 px-4"
    >
      <div className="rounded-lg border border-border bg-card shadow-lg overflow-hidden">
        {/* Terminal Header */}
        <div className="flex items-center gap-2 border-b border-border bg-secondary px-4 py-3">
          <div className="flex gap-2">
            <div className="h-3 w-3 rounded-full bg-red-500" />
            <div className="h-3 w-3 rounded-full bg-yellow-500" />
            <div className="h-3 w-3 rounded-full bg-green-500" />
          </div>
          <span className="ml-2 text-xs text-muted-foreground font-mono">
            devlinops@platform ~ %
          </span>
        </div>

        {/* Terminal Body */}
        <div className="bg-card p-4 sm:p-6 font-mono text-xs sm:text-sm">
          {commands.slice(0, currentCommand).map((cmd, idx) => (
            <div key={idx} className="mb-3">
              <div className="flex items-center gap-2">
                <span className="text-primary">$</span>
                <span className="text-foreground">{cmd.cmd}</span>
              </div>
              <div className="text-muted-foreground text-xs mt-1.5 ml-4">
                {idx === 0 && "✓ All pods running"}
                {idx === 1 && "✓ Sync successful"}
                {idx === 2 && "✓ Release upgraded"}
                {idx === 3 && "✓ Apply complete"}
              </div>
            </div>
          ))}

          {displayText && (
            <div className="flex items-center gap-2">
              <span className="text-primary">$</span>
              <span className="text-foreground">{displayText}</span>
              {isTyping && (
                <span className="inline-block w-2 h-4 bg-primary animate-pulse" />
              )}
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
}
