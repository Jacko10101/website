import { describe, expect, it } from "vitest";
import { featuredProjects } from "@/lib/projects";
import nextConfig from "../next.config";
import sitemap from "./sitemap";

/**
 * The sitemap drives the viewport check in CI and is what search engines
 * read; the redirects are what keeps the old URLs alive. Both are small
 * enough to pin exactly.
 */

const HOST = "https://www.devlinops.com";

describe("the sitemap", () => {
  const entries = sitemap();
  const urls = entries.map((e) => e.url);

  it("is on the canonical host only, with no duplicates", () => {
    for (const u of urls) expect(u.startsWith(HOST)).toBe(true);
    expect(new Set(urls).size).toBe(urls.length);
  });

  it("lists every case study, the on-call page and the CV", () => {
    for (const p of featuredProjects) if (p.href) expect(urls).toContain(HOST + p.href);
    expect(urls).toContain(`${HOST}/oncall`);
    expect(urls).toContain(`${HOST}/cv.pdf`);
  });

  it("does not list the routes that only redirect", () => {
    expect(urls).not.toContain(`${HOST}/playground`);
    expect(urls).not.toContain(`${HOST}/colophon`);
  });

  it("dates every entry", () => {
    for (const e of entries) expect(Number.isNaN(new Date(e.lastModified as Date).getTime())).toBe(false);
  });
});

describe("the redirects", () => {
  it("send the old page names to /oncall, permanently", async () => {
    const redirects = await nextConfig.redirects!();
    const to = Object.fromEntries(redirects.map((r) => [r.source, r]));
    expect(to["/playground"]).toMatchObject({ destination: "/oncall", permanent: true });
    expect(to["/colophon"]).toMatchObject({ destination: "/oncall", permanent: true });
    expect(redirects).toHaveLength(2);
  });
});
