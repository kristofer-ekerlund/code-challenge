const LONG_TERM_CACHE = 'public, max-age=31536000, immutable';
const SHORT_TERM_CACHE = 'public, max-age=600, stale-while-revalidate=86400';

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  compress: true,
  poweredByHeader: false,
  images: {
    formats: ['image/avif', 'image/webp'],
    minimumCacheTTL: 60,
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'picsum.photos',
        pathname: '/**',
      },
    ],
  },
  compiler: {
    removeConsole: process.env.NODE_ENV === 'production',
  },
  experimental: {
    optimizePackageImports: [
      '@tanstack/react-virtual',
      'react-infinite-scroll-hook',
    ],
    webpackBuildWorker: true,
  },
  async headers() {
    return [
      {
        source: '/_next/static/:path*',
        headers: [
          {
            key: 'Cache-Control',
            value: LONG_TERM_CACHE,
          },
        ],
      },
      {
        source: '/:all*(js|css|svg|png|jpg|jpeg|gif|webp|avif|ico|woff2?)',
        headers: [
          {
            key: 'Cache-Control',
            value: LONG_TERM_CACHE,
          },
        ],
      },
      {
        source: '/:path*',
        headers: [
          {
            key: 'Cache-Control',
            value: SHORT_TERM_CACHE,
          },
        ],
      },
    ];
  },
};

export default nextConfig;
