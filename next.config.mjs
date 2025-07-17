/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    unoptimized: false,
    formats: ['image/webp', 'image/avif'],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
    domains: ['simryo.com', 'cdn.simryo.com'],
    minimumCacheTTL: 31536000,
    dangerouslyAllowSVG: true,
    contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;",
  },
  experimental: {
    scrollRestoration: true,
    webVitalsAttribution: ['CLS', 'FCP', 'FID', 'INP', 'LCP', 'TTFB'],
  },
  serverExternalPackages: ['@prisma/client'],
  compress: true,
  poweredByHeader: false,
  generateEtags: true,
  httpAgentOptions: {
    keepAlive: true,
  },
  headers: async () => [
    {
      source: '/(.*)',
      headers: [
        {
          key: 'X-Frame-Options',
          value: 'DENY',
        },
        {
          key: 'X-Content-Type-Options',
          value: 'nosniff',
        },
        {
          key: 'X-XSS-Protection',
          value: '1; mode=block',
        },
        {
          key: 'Referrer-Policy',
          value: 'strict-origin-when-cross-origin',
        },
        {
          key: 'Permissions-Policy',
          value: 'camera=(), microphone=(), geolocation=(), payment=(), usb=(), serial=(), bluetooth=(), magnetometer=(), gyroscope=(), accelerometer=()',
        },
        {
          key: 'Strict-Transport-Security',
          value: 'max-age=31536000; includeSubDomains; preload',
        },
        {
          key: 'Content-Security-Policy',
          value: "default-src 'self'; script-src 'self' 'unsafe-inline' 'unsafe-eval' https://www.googletagmanager.com https://www.google-analytics.com https://static.hotjar.com https://www.clarity.ms; style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; font-src 'self' https://fonts.gstatic.com; img-src 'self' data: https: blob:; connect-src 'self' https://api.simryo.com https://www.google-analytics.com https://vitals.vercel-insights.com; frame-src 'self' https://www.google.com; object-src 'none'; base-uri 'self'; form-action 'self'; upgrade-insecure-requests;",
        },
      ],
    },
    {
      source: '/api/(.*)',
      headers: [
        {
          key: 'Cache-Control',
          value: 'public, max-age=3600, s-maxage=86400, stale-while-revalidate=604800',
        },
      ],
    },
    {
      source: '/blog/(.*)',
      headers: [
        {
          key: 'Cache-Control',
          value: 'public, max-age=86400, s-maxage=604800, stale-while-revalidate=2592000',
        },
      ],
    },
    {
      source: '/(.*)\\.(js|css|png|jpg|jpeg|gif|ico|svg|woff|woff2|ttf|eot)',
      headers: [
        {
          key: 'Cache-Control',
          value: 'public, max-age=31536000, immutable',
        },
      ],
    },
  ],
  rewrites: async () => [
    {
      source: '/sitemap.xml',
      destination: '/api/sitemap',
    },
    {
      source: '/rss.xml',
      destination: '/api/rss',
    },
    {
      source: '/robots.txt',
      destination: '/api/robots',
    },
  ],
  redirects: async () => [
    {
      source: '/esim',
      destination: '/plans',
      permanent: true,
    },
    {
      source: '/international-sim',
      destination: '/plans',
      permanent: true,
    },
    {
      source: '/travel-sim',
      destination: '/plans',
      permanent: true,
    },
  ],
}

export default nextConfig
