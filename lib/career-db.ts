/**
 * The career database.
 *
 * Clarity's rule is that no answer asserts a number without the query that
 * produced it. This is that rule turned on the site itself: a small relational
 * database of the work, queried for real in the visitor's browser, with the
 * SQL always on show.
 *
 * Every row is derived from `lib/projects.ts` rather than retyped, so the
 * database cannot drift from the case studies the way hand-written copy did.
 */

import { projects } from "@/lib/projects";

export interface Table {
  name: string;
  ddl: string;
  columns: string[];
  rows: unknown[][];
}

/** Projects carry years as "2025–26" or "2026"; SQL wants an integer. */
function startYear(year: string): number {
  const match = year.match(/\d{4}/);
  return match ? Number(match[0]) : 0;
}

const projectRows = projects.map((p) => [
  p.id,
  p.title,
  p.subtitle,
  startYear(p.year),
  p.status,
  p.href ?? "",
]);

const techRows = projects.flatMap((p) => p.tags.map((tag) => [p.id, tag]));

const statRows = projects.flatMap((p) =>
  p.stats.map((s) => [p.id, s.value, s.label])
);

export const TABLES: Table[] = [
  {
    name: "project",
    ddl: "CREATE TABLE project (id STRING, name STRING, subtitle STRING, year INT, status STRING, href STRING)",
    columns: ["id", "name", "subtitle", "year", "status", "href"],
    rows: projectRows,
  },
  {
    name: "tech",
    ddl: "CREATE TABLE tech (project_id STRING, name STRING)",
    columns: ["project_id", "name"],
    rows: techRows,
  },
  {
    name: "stat",
    ddl: "CREATE TABLE stat (project_id STRING, value STRING, label STRING)",
    columns: ["project_id", "value", "label"],
    rows: statRows,
  },
];

/**
 * The questions are curated; the SQL underneath each one is real and so is the
 * result. Saying so plainly is the point — this page doesn't get to claim an
 * LLM it hasn't got.
 */
export const QUESTIONS: { ask: string; sql: string }[] = [
  {
    ask: "What's running in production?",
    sql: `SELECT name, subtitle, year
FROM project
WHERE status = 'production'
ORDER BY year DESC`,
  },
  {
    ask: "Which tools have you used on more than one project?",
    sql: `SELECT name AS tool, COUNT(*) AS projects
FROM tech
GROUP BY name
HAVING COUNT(*) > 1
ORDER BY projects DESC, tool ASC`,
  },
  {
    ask: "What have you actually built on Kubernetes?",
    sql: `SELECT p.name, p.subtitle, p.year
FROM project p
JOIN tech t ON t.project_id = p.id
WHERE t.name = 'Kubernetes'
ORDER BY p.year DESC`,
  },
  {
    ask: "Show me every number you claim, and which project it belongs to.",
    sql: `SELECT p.name AS project, s.value, s.label
FROM stat s
JOIN project p ON p.id = s.project_id
ORDER BY p.name`,
  },
  {
    ask: "How much of this is AI work rather than platform work?",
    sql: `SELECT p.name, t.name AS ai_tech
FROM project p
JOIN tech t ON t.project_id = p.id
WHERE t.name IN ('Gemini', 'LiteLLM', 'Spring AI', 'PyTorch')
ORDER BY p.name`,
  },
  {
    ask: "What were you shipping each year?",
    sql: `SELECT year, COUNT(*) AS projects
FROM project
GROUP BY year
ORDER BY year DESC`,
  },
];

/** Shown so a visitor can write their own query without guessing at names. */
export const SCHEMA_SUMMARY = TABLES.map(
  (t) => `${t.name}(${t.columns.join(", ")})`
).join("\n");
