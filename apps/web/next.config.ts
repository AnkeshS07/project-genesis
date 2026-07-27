import type { NextConfig } from 'next';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const monorepoRoot = path.join(path.dirname(fileURLToPath(import.meta.url)), '../..');

/**
 * `output: 'standalone'` is required for small Docker images (M10).
 * Enable it when DOCKER_BUILD=1 (Dockerfiles set this).
 * On Windows hosts, unconditional standalone can fail with EPERM on pnpm symlinks.
 */
const useStandalone = process.env.DOCKER_BUILD === '1';

const apiProxyTarget = process.env.API_PROXY_TARGET ?? 'http://localhost:3001';

const nextConfig: NextConfig = {
  reactStrictMode: true,
  transpilePackages: ['@project-genesis/sdk', '@project-genesis/types', '@project-genesis/shared'],
  async rewrites() {
    return [
      {
        source: '/api/v1/:path*',
        destination: `${apiProxyTarget}/api/v1/:path*`,
      },
    ];
  },
  ...(useStandalone
    ? {
        output: 'standalone' as const,
        outputFileTracingRoot: monorepoRoot,
      }
    : {}),
};

export default nextConfig;
