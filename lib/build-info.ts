// Build provenance, injected at build time by next.config.ts (git locally,
// Vercel env vars in CI). Everything here is real or absent — never invented.
const sha = process.env.NEXT_PUBLIC_BUILD_SHA || null;
const repoUrl = process.env.NEXT_PUBLIC_REPO_URL || null;

export const BUILD = {
  sha,
  shortSha: sha ? sha.slice(0, 7) : null,
  branch: process.env.NEXT_PUBLIC_BUILD_BRANCH || null,
  time: process.env.NEXT_PUBLIC_BUILD_TIME || null,
  repoUrl,
  commitUrl: sha && repoUrl ? `${repoUrl}/commit/${sha}` : null,
};

export function formatBuildDate(iso: string | null): string | null {
  if (!iso) return null;
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return null;
  return d.toLocaleDateString("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}
