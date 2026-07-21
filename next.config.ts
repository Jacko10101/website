import type { NextConfig } from 'next'
import path from 'node:path'
import { execSync } from 'node:child_process'

// Real build provenance, captured at build time. Vercel exposes its own git env
// vars; locally we ask git directly. Everything falls back to "unknown" rather
// than pretending.
function git(cmd: string): string | undefined {
  try {
    return execSync(cmd, { stdio: ['ignore', 'pipe', 'ignore'] }).toString().trim() || undefined
  } catch {
    return undefined
  }
}

const commitSha =
  process.env.VERCEL_GIT_COMMIT_SHA ?? git('git rev-parse HEAD')
const commitBranch =
  process.env.VERCEL_GIT_COMMIT_REF ?? git('git rev-parse --abbrev-ref HEAD')
const commitTime = git('git log -1 --format=%cI')

const securityHeaders = [
  {
    key: 'X-DNS-Prefetch-Control',
    value: 'on'
  },
  {
    key: 'X-Frame-Options',
    value: 'SAMEORIGIN'
  },
  {
    key: 'X-Content-Type-Options',
    value: 'nosniff'
  },
  {
    key: 'Referrer-Policy',
    value: 'strict-origin-when-cross-origin'
  },
  {
    key: 'Permissions-Policy',
    value: 'camera=(), microphone=(), geolocation=()'
  },
  {
    key: 'Content-Security-Policy',
    value: [
      "default-src 'self'",
      "script-src 'self' 'unsafe-inline' https://plausible.io",
      "style-src 'self' 'unsafe-inline'",
      "img-src 'self' data: blob:",
      "font-src 'self' data:",
      "connect-src 'self' https://api.web3forms.com https://plausible.io",
      "frame-ancestors 'self'",
    ].join('; ')
  }
]

const nextConfig: NextConfig = {
  env: {
    NEXT_PUBLIC_BUILD_SHA: commitSha ?? '',
    NEXT_PUBLIC_BUILD_BRANCH: commitBranch ?? '',
    NEXT_PUBLIC_BUILD_TIME: commitTime ?? '',
    NEXT_PUBLIC_REPO_URL: 'https://github.com/Jacko10101/website',
  },
  images: {
    formats: ['image/avif', 'image/webp'],
  },
  turbopack: {
    root: path.resolve(__dirname),
  },
  async headers() {
    return [
      {
        source: '/:path*',
        headers: securityHeaders,
      },
    ]
  },
}

export default nextConfig
