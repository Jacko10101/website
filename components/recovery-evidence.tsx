"use client";

import { useState } from "react";
import { pairedRecovery } from "@/lib/recovery-evidence";

const mean = (values: number[]) => values.reduce((sum,value) => sum + value,0) / values.length;
const y = (value: number) => 275 - (value - 70) / 30 * 230;

export function RecoveryEvidence() {
  const [round,setRound] = useState<number | null>(null);
  const before = round === null ? mean(pairedRecovery.knapsack) : pairedRecovery.knapsack[round];
  const after = round === null ? mean(pairedRecovery.ai) : pairedRecovery.ai[round];
  return <div className="recovery-evidence">
    <div className="evidence-head"><span>RECORDED ON AMAZON EKS</span><span>05 PAIRED NODE FAILURES</span></div>
    <div className="evidence-numbers" role="status" aria-live="polite" aria-atomic="true">
      <div><span>Trust the labels</span><strong>{before.toFixed(1)}<small>%</small></strong></div>
      <span className="evidence-arrow" aria-hidden>↗</span>
      <div><span>Measure the behaviour</span><strong>{after.toFixed(1)}<small>%</small></strong></div>
      <p>{round === null ? "Five-run mean" : `Run ${round + 1}`} · +{(after-before).toFixed(1)} percentage points</p>
    </div>
    <svg className="evidence-plot" viewBox="0 0 620 310" role="img" aria-label={`Weighted completion at the horizon. ${round === null ? 'Every paired run improved when the scheduler checked measured behaviour.' : `Run ${round + 1}: ${before}% trusting labels, ${after}% using measured behaviour.`}`}>
      {[70,80,90,100].map(value => <g key={value}><line x1="60" x2="570" y1={y(value)} y2={y(value)} stroke="currentColor" opacity=".14" /><text x="30" y={y(value)+4} fill="currentColor" fontSize="10">{value}</text></g>)}
      {pairedRecovery.knapsack.map((value,index) => <g key={index} className="evidence-pair" data-selected={round === null || round === index}>
        <path d={`M125 ${y(value)} C270 ${y(value)} 350 ${y(pairedRecovery.ai[index])} 505 ${y(pairedRecovery.ai[index])}`} fill="none" stroke="currentColor" strokeWidth={round === index ? 2.5 : 1.4} />
        <circle cx="125" cy={y(value)} r="4" fill="#99a9a0" /><circle cx="505" cy={y(pairedRecovery.ai[index])} r="4" fill="#9adab1" />
      </g>)}
      <text x="125" y="306" textAnchor="middle" fill="currentColor" fontSize="10">Label-only knapsack</text><text x="505" y="306" textAnchor="middle" fill="#9adab1" fontSize="10">Evidence-weighted knapsack</text>
    </svg>
    <div className="evidence-controls" role="group" aria-label="Inspect recorded recovery runs"><button type="button" aria-pressed={round === null} onClick={() => setRound(null)}>All runs</button>{pairedRecovery.ai.map((_,index) => <button key={index} type="button" aria-pressed={round === index} onClick={() => setRound(index)}>0{index+1}</button>)}</div>
    <p className="evidence-footnote">Weighted completion at the horizon. Each line connects the two results for one workload and node failure.</p>
  </div>;
}
