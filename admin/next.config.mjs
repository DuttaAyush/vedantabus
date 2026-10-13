/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',
  images: {
    unoptimized: true,
  },
  trailingSlash: false,
  // Loaded from ALLOWED_DEV_ORIGINS in .env.local (gitignored) — never hardcode IPs here.
  allowedDevOrigins: process.env.ALLOWED_DEV_ORIGINS
    ? process.env.ALLOWED_DEV_ORIGINS.split(',').map((s) => s.trim())
    : [],
};

export default nextConfig;
