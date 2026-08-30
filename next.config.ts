import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  reactStrictMode: true,
  poweredByHeader: false,
  images: {
    formats: ['image/avif', 'image/webp'],
    remotePatterns: [{ protocol: 'https', hostname: 'res.cloudinary.com' }],
  },
  experimental: {
    // Keeps icon/primitive barrels tree-shaken so route bundles stay inside
    // the budgets in docs/02-TRD.md §10.1.
    optimizePackageImports: ['lucide-react'],
  },
}

export default nextConfig
