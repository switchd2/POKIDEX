/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'raw.githubusercontent.com',
      },
      {
        protocol: 'https',
        hostname: 'assets.pokemon.com',
      },
    ],
  },

  // Proxy /api/* requests to the Express backend.
  // In production (Vercel), if using multi-service routing and BACKEND_URL is not set,
  // we rewrite to the relative service path /_api.
  // Locally, it falls back to http://localhost:4000.
  async rewrites() {
    const isVercel = process.env.VERCEL === '1' || process.env.NOW_BUILDER !== undefined;
    const backendUrl = process.env.BACKEND_URL;

    if (isVercel && !backendUrl) {
      return [
        {
          source: '/api/:path*',
          destination: '/_api/api/:path*',
        },
        {
          source: '/health',
          destination: '/_api/health',
        },
      ];
    }

    const targetUrl = backendUrl || 'http://localhost:4000';
    return [
      {
        source: '/api/:path*',
        destination: `${targetUrl}/api/:path*`,
      },
      {
        source: '/health',
        destination: `${targetUrl}/health`,
      },
    ];
  },
};

export default nextConfig;
