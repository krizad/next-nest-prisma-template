import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  output: 'standalone',

  // Proxy API requests to backend server
  async rewrites() {
    const backendUrl =
      process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:8080';

    return [
      {
        source: '/api/:path*',
        destination: `${backendUrl}/api/v1/:path*`,
      },
    ];
  },
};

export default nextConfig;
