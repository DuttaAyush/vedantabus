/** @type {import('next').NextConfig} */
const nextConfig = {
  // output: 'export',
  images: {
    unoptimized: true,
  },
  trailingSlash: false,
  // Only applies in development (`next dev`). Production builds do not use HMR.
  ...(process.env.NODE_ENV !== 'production' && {
    allowedDevOrigins: process.env.ALLOWED_DEV_ORIGINS
      ? process.env.ALLOWED_DEV_ORIGINS.split(',').map((s) => s.trim())
      : ['*'],
  }),
};

export default nextConfig;
