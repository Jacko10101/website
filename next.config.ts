import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  images: {
    formats: ['image/avif', 'image/webp'],
  },
  // Configure Turbopack root to avoid OneDrive permission issues
  turbopack: {
    root: '/Users/jackdevlin/Library/CloudStorage/OneDrive-LoweRental/Documents/personal/website',
  },
}

export default nextConfig
