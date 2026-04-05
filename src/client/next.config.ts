import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async rewrites() {
    return [
      // 1. Specific local routes we want to ensure stay local
      // (Actually Next.js app router routes usually handle themselves, 
      // but the catch-all below is very aggressive)
      
      // 2. Backend routes (only those not handled by frontend)
      {
        source: '/auth/:path*',
        destination: 'http://localhost:8000/auth/:path*',
      },
      {
        source: '/access/:path*',
        destination: 'http://localhost:8000/access/:path*',
      },
      {
        source: '/health',
        destination: 'http://localhost:8000/health',
      },
      {
        source: '/content/:path*',
        destination: 'http://localhost:8000/content/:path*',
      },
      {
        source: '/ai/:path*',
        destination: 'http://localhost:8000/ai/:path*',
      },
      {
        source: '/admin/:path*',
        destination: 'http://localhost:8000/admin/:path*',
      },
      {
        source: '/flashcards/:path*',
        destination: 'http://localhost:8000/flashcards/:path*',
      },
      {
        source: '/payments/:path*',
        destination: 'http://localhost:8000/payments/:path*',
      },
      {
        source: '/ingest',
        destination: 'http://localhost:8000/ingest',
      },
      // 3. Catch-all for other /api routes that aren't threats
      {
        source: '/api/((?!threats).*)',
        destination: 'http://localhost:8000/api/:path*',
      },
    ];
  },
};

export default nextConfig;
