"use client";

import { useState } from "react";
import { GroundingDemo } from "@/components/grounding-demo";
import { SqlPlayground } from "@/components/sql-playground";
import { SchemaDirectory } from "@/components/schema-directory";

const examples = [
  { id: "answer", label: "Check an answer", component: GroundingDemo },
  { id: "sql", label: "Try the SQL guard", component: SqlPlayground },
  { id: "schema", label: "Explore the schema", component: SchemaDirectory },
];

export function ClarityWorkbench() {
  const [selected, setSelected] = useState("answer");
  const example = examples.find(item => item.id === selected)!;
  const Example = example.component;
  return <div className="clarity-workbench">
    <div className="instrument-switcher" role="group" aria-label="Choose a Clarity example">
      {examples.map((item, index) => <button key={item.id} type="button" data-example={item.id} aria-pressed={selected === item.id} onClick={() => setSelected(item.id)}><span>0{index + 1}</span>{item.label}</button>)}
    </div>
    <div className="instrument-example" role="region" aria-label={example.label}><Example /></div>
  </div>;
}
