import type { NextConfig } from "next";

const nextConfig: NextConfig = {
    images: {
        remotePatterns: [
            {
                protocol: "https",
                hostname: "**",
            },
        ],
        formats: ['image/avif', 'image/webp'],
    },

    // Experimental optimizations (removed @prisma/client to prevent engine tree-shaking)
    experimental: {
        optimizePackageImports: ["openai"],
    },

    // Ensure Prisma engine files are included in serverless bundle
    outputFileTracingIncludes: {
        '/api/*': ['./node_modules/.prisma/**/*'],
        '/': ['./node_modules/.prisma/**/*'],
    },

    // Ignore ESLint during builds (for Vercel deployment)
    eslint: {
        ignoreDuringBuilds: true,
    },

    // Ignore TypeScript errors during builds (for Vercel deployment)
    typescript: {
        ignoreBuildErrors: true,
    },

    // Security headers
    async headers() {
        return [
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
                        key: 'Referrer-Policy',
                        value: 'origin-when-cross-origin',
                    },
                    {
                        key: 'X-XSS-Protection',
                        value: '1; mode=block',
                    },
                    {
                        key: 'Permissions-Policy',
                        value: 'camera=(), microphone=(), geolocation=()',
                    },
                ],
            },
        ];
    },

    // Compression
    compress: true,

    // Strict mode for better development
    reactStrictMode: true,

    // Power by header removal for security
    poweredByHeader: false,
};

const withPWA = require('next-pwa')({
    dest: 'public',
    disable: process.env.NODE_ENV === 'development',
    register: true,
    skipWaiting: true,
});

export default withPWA(nextConfig);
