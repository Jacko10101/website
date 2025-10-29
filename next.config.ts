import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  images: {
    formats: ['image/avif', 'image/webp'],
  },
  // Disable Turbopack due to OneDrive permissions
  turbopack: false as any,
}

export default nextConfig
