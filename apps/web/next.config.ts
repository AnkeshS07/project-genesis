import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  reactStrictMode: true,
  transpilePackages: ['@project-genesis/sdk', '@project-genesis/types'],
};

export default nextConfig;
