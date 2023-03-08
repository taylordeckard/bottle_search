const isProd = process.env.NODE_ENV === "production";

/** @type {import('next').NextConfig} */
const nextConfig = {
  assetPrefix: isProd ? "/bourbon" : undefined,
  basePath: isProd ? "/bourbon" : undefined,
  experimental: {
    appDir: true,
  },
  output: 'standalone',
};

module.exports = nextConfig;
