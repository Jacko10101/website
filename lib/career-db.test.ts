import { describe, expect, it, beforeAll } from "vitest";
import initSqlJs, { type Database } from "sql.js";
import { QUESTIONS, TABLES } from "./career-db";
import { validate } from "./sql-guard";

/**
 * The career query on /lab builds a real SQLite database in the
 * browser from lib/projects.ts and runs curated questions against it. This
 * builds the same database under Node and checks that every question runs,
 * returns rows, and passes the guard that gates the query box.
 */

let db: Database;

beforeAll(async () => {
  const SQL = await initSqlJs();
  db = new SQL.Database();
  for (const table of TABLES) {
    db.run(table.ddl);
    const placeholders = table.columns.map(() => "?").join(", ");
    for (const row of table.rows) {
      db.run(`INSERT INTO ${table.name} VALUES (${placeholders})`, row as (string | number)[]);
    }
  }
});

describe("the tables", () => {
  it.each(TABLES.map((t) => [t.name, t] as const))("%s has rows the width of its columns", (_name, table) => {
    expect(table.rows.length).toBeGreaterThan(0);
    for (const row of table.rows) expect(row).toHaveLength(table.columns.length);
  });

  it("holds every project once", () => {
    const [result] = db.exec("SELECT count(*) FROM project");
    const project = TABLES.find((t) => t.name === "project")!;
    expect(result.values[0][0]).toBe(project.rows.length);
  });
});

describe("every curated question", () => {
  it.each(QUESTIONS.map((q) => [q.ask, q.sql] as const))("%s", (_ask, sql) => {
    expect(validate(sql).verdict.allowed).toBe(true);
    const results = db.exec(sql);
    expect(results).toHaveLength(1);
    expect(results[0].values.length).toBeGreaterThan(0);
  });
});
