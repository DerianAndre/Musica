/** @type {import('next').NextConfig} */

const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  experimental: {
    appDir: true,
  },
  typescript: {
    //ignoreBuildErrors: true, // ! Temporal
  },
};

module.exports = nextConfig;
