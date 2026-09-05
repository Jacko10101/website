import { existsSync, readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";
import { READING_ORDER, firstSentence, inReadingOrder, projects } from "./projects";

/**
 * lib/projects.ts is the single source the homepage index, /projects, the
 * estate map, the sitemap and the terminal all read. These pin the
 * invariants the pages assume rather than check.
 */

const withPages = projects.filter((p) => p.href !== null);

describe("the project data", () => {
  it("has a unique id per project", () => {
    const ids = projects.map((p) => p.id);
    expect(new Set(ids).size).toBe(ids.length);
  });

  it("marks exactly one project as the one to open first", () => {
    expect(projects.filter((p) => p.startHere).length).toBe(1);
  });

  it("routes every page to a file that exists, at the path its id implies", () => {
    for (const p of withPages) {
      expect(p.href).toBe(`/projects/${p.id}`);
      expect(existsSync(`app${p.href}/page.tsx`)).toBe(true);
    }
  });

  it("gives every page a document type and a link verb", () => {
    for (const p of withPages) {
      expect(p.docType, p.id).toBeTruthy();
      expect(p.docCta, p.id).toBeTruthy();
    }
  });

  it("reads every page, once, in READING_ORDER", () => {
    expect([...READING_ORDER].sort()).toEqual(withPages.map((p) => p.id).sort());
    expect(inReadingOrder().map((p) => p.id)).toEqual([...READING_ORDER]);
  });

  it("names every case study's heading for the shared-element transition", () => {
    // The index row's title morphs into the page heading only if both carry
    // the same view-transition-name. Headings live in the page or its frame.
    const frames = [
      "components/heimdall-page-frame.tsx",
      "components/pipeline-page-pr.tsx",
      "components/ai-gateway-incident.tsx",
    ].map((f) => readFileSync(f, "utf8")).join("\n");
    for (const p of withPages) {
      const source = readFileSync(`app${p.href}/page.tsx`, "utf8") + frames;
      expect(source, p.id).toContain(`viewTransitionName: "title-${p.id}"`);
    }
  });
});

describe("firstSentence", () => {
  it("returns the first sentence and leaves the rest", () => {
    expect(firstSentence("One. Two three. Four.")).toBe("One.");
    expect(firstSentence("Costs about £5k. Two years on.")).toBe("Costs about £5k.");
  });

  it("returns the whole text when there is no sentence break", () => {
    expect(firstSentence("No full stop here")).toBe("No full stop here");
    expect(firstSentence("Ends with a stop.")).toBe("Ends with a stop.");
  });
});
