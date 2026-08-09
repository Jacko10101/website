"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";

/* -------------------------------------------------------------------------- */
/*  Trace a request through the gateway. Two independent things can 401 you:   */
/*  the model not existing at all, and the model existing but not being on     */
/*  your key's allowlist. That distinction is the whole design, so it's the    */
/*  thing you get to play with.                                                */
/* -------------------------------------------------------------------------- */

type Consumer = {
  id: string;
  label: string;
  tenant: string;
  feature: string;
  allow: string[];
  note?: string;
};

const CONSUMERS: Consumer[] = [
  {
    id: "chat",
    label: "clarity-chat",
    tenant: "tenant-a",
    feature: "chat",
    allow: ["gemini-2.5-flash", "gemini-3.6-flash"],
  },
  {
    id: "estate",
    label: "clarity-estate",
    tenant: "tenant-a",
    feature: "estate-summary",
    allow: ["gemini-2.5-flash"],
  },
  {
    id: "reviewer",
    label: "pr-review-agent",
    tenant: "platform",
    feature: "code-review",
    allow: ["gemini-3.6-flash"],
  },
  {
    id: "new",
    label: "new-service",
    tenant: "platform",
    feature: "unset",
    allow: [],
    note: "Key issued, allowlist never populated. This is the trap.",
  },
];

/** what the gateway config knows about, regardless of who may call it */
const MODEL_LIST = [
  "gemini-2.5-flash",
  "gemini-3.6-flash",
  "gemini-3.1-flash-lite",
];
const OFF_LIST = "gpt-4o";
const MODELS = [...MODEL_LIST, OFF_LIST];

type StageState = "pending" | "pass" | "fail" | "skipped";

type Stage = { key: string; label: string; detail: (c: Consumer, m: string) => string };

const STAGES: Stage[] = [
  {
    key: "auth",
    label: "authenticate virtual key",
    detail: (c) => `sk-…${c.id}  recognised`,
  },
  {
    key: "exists",
    label: "model in gateway config",
    detail: (_c, m) =>
      MODEL_LIST.includes(m)
        ? `${m} found in model_list`
        : `${m} is not deployed: no model_list entry`,
  },
  {
    key: "allow",
    label: "model on this key's allowlist",
    detail: (c, m) =>
      c.allow.includes(m)
        ? `${m} permitted for this key`
        : c.allow.length === 0
          ? `this key permits nothing yet`
          : `key permits ${c.allow.join(", ")}`,
  },
  {
    key: "tag",
    label: "stamp attribution",
    detail: (c) => `user=${c.tenant}  tags: env=prod, feature=${c.feature}`,
  },
  { key: "route", label: "route to provider", detail: (_c, m) => `upstream call → ${m}` },
  {
    key: "spend",
    label: "write spend log",
    detail: (c) => `billed to ${c.tenant} / ${c.feature}`,
  },
];

function outcomeFor(c: Consumer, m: string) {
  if (!MODEL_LIST.includes(m))
    return {
      failAt: 1,
      code: 401,
      why: "that model isn't deployed. Nothing in the gateway config answers to that name.",
    };
  if (!c.allow.includes(m))
    return {
      failAt: 2,
      code: 401,
      why:
        c.allow.length === 0
          ? "the model exists and is fully deployed. This key was just never told about it, which is the half of onboarding everyone forgets."
          : "the model exists, but this key isn't permitted to call it. No fallback, no quiet downgrade to something cheaper.",
    };
  return { failAt: -1, code: 200, why: "" };
}

export function GatewayTracer() {
  // opens on `new-service`: a key with an empty allowlist, which is the trap
  // the whole exhibit exists to show
  const [consumer, setConsumer] = useState<Consumer>(CONSUMERS[3]);
  const [model, setModel] = useState<string>(MODELS[0]);
  const [step, setStep] = useState<number>(-1);
  const timers = useRef<ReturnType<typeof setTimeout>[]>([]);
  const reduceMotion = useReducedMotion();

  const outcome = outcomeFor(consumer, model);
  const lastStep = outcome.failAt === -1 ? STAGES.length - 1 : outcome.failAt;

  const clearTimers = () => {
    timers.current.forEach(clearTimeout);
    timers.current = [];
  };

  const run = useCallback(() => {
    clearTimers();
    if (reduceMotion) {
      // no staged reveal: show every stage immediately
      setStep(lastStep);
      return;
    }
    setStep(-1);
    for (let i = 0; i <= lastStep; i++) {
      timers.current.push(setTimeout(() => setStep(i), 90 + i * 190));
    }
  }, [lastStep, reduceMotion]);

  useEffect(() => clearTimers, []);
  // re-run whenever the request changes, so it always reflects the current pick
  useEffect(() => {
    run();
  }, [consumer, model, run]);

  const stateOf = (i: number): StageState => {
    if (i > step) return "pending";
    if (outcome.failAt === i) return "fail";
    if (outcome.failAt !== -1 && i > outcome.failAt) return "skipped";
    return "pass";
  };

  const done = step >= lastStep;

  return (
    <div className="rounded-xl border border-border bg-card/40 overflow-hidden">
      <div className="border-b border-border bg-card/60 px-4 py-3">
        <div className="font-mono text-xs text-muted-foreground mb-2">
          consumer key
        </div>
        <div className="flex flex-wrap gap-2">
          {CONSUMERS.map((c) => (
            <button
              key={c.id}
              type="button"
              onClick={() => setConsumer(c)}
              aria-pressed={c.id === consumer.id}
              className={`rounded-md border px-2.5 py-1 font-mono text-xs transition-colors ${
                c.id === consumer.id
                  ? "border-primary/60 bg-primary/10 text-primary"
                  : "border-border text-muted-foreground hover:text-foreground"
              }`}
            >
              {c.label}
            </button>
          ))}
        </div>

        <div className="font-mono text-xs text-muted-foreground mt-4 mb-2">
          requested model
        </div>
        <div className="flex flex-wrap gap-2">
          {MODELS.map((m) => (
            <button
              key={m}
              type="button"
              onClick={() => setModel(m)}
              aria-pressed={m === model}
              className={`rounded-md border px-2.5 py-1 font-mono text-xs transition-colors ${
                m === model
                  ? "border-primary/60 bg-primary/10 text-primary"
                  : "border-border text-muted-foreground hover:text-foreground"
              }`}
            >
              {m}
              {m === OFF_LIST && (
                <span className="ml-1.5 text-muted-foreground/60">not deployed</span>
              )}
            </button>
          ))}
        </div>

        {consumer.note && (
          <p className="mt-3 font-mono text-xs text-warn">
            {consumer.note}
          </p>
        )}
      </div>

      {/* the trace */}
      <div className="p-4 sm:p-5">
        <div className="space-y-1.5">
          {STAGES.map((s, i) => {
            const st = stateOf(i);
            const glyph =
              st === "pass" ? "✓" : st === "fail" ? "✗" : st === "skipped" ? "·" : " ";
            const tone =
              st === "pass"
                ? "text-primary"
                : st === "fail"
                  ? "text-error"
                  : "text-muted-foreground/60";
            return (
              <motion.div
                key={s.key}
                initial={false}
                animate={{ opacity: st === "pending" ? 0.45 : 1 }}
                transition={{ duration: 0.15 }}
                className="flex flex-wrap items-baseline gap-x-3 gap-y-0.5 font-mono text-xs"
              >
                <span className={`w-3 ${tone}`}>{glyph}</span>
                <span
                  className={
                    st === "skipped"
                      ? "text-muted-foreground/60 line-through"
                      : "text-foreground"
                  }
                >
                  {s.label}
                </span>
                {st !== "pending" && st !== "skipped" && (
                  <span className="text-muted-foreground">
                    {s.detail(consumer, model)}
                  </span>
                )}
              </motion.div>
            );
          })}
        </div>

        <div aria-live="polite">
        <AnimatePresence mode="wait">
          {done && (
            <motion.div
              key={`${consumer.id}-${model}`}
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.18 }}
              className={`mt-4 rounded-md border p-3 ${
                outcome.code === 200
                  ? "border-primary/40 bg-primary/5"
                  : "border-error/50 bg-error/5"
              }`}
            >
              <div className="font-mono text-xs font-semibold mb-1">
                <span
                  className={
                    outcome.code === 200 ? "text-primary" : "text-error"
                  }
                >
                  HTTP {outcome.code}
                </span>
              </div>
              <p className="text-sm text-muted-foreground leading-relaxed">
                {outcome.code === 200 ? (
                  <>
                    Call made, and the spend lands against{" "}
                    <span className="text-foreground">{consumer.tenant}</span> for{" "}
                    <span className="text-foreground">{consumer.feature}</span>{" "}
                    rather than into one undifferentiated bill.
                  </>
                ) : (
                  outcome.why
                )}
              </p>
            </motion.div>
          )}
        </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
