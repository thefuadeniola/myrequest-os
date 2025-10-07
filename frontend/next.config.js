// next.config.js
/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "**",   // allow all domains
      },
      {
        protocol: "http",
        hostname: "**",   // allow http too (not recommended for prod)
      },
    ],
  },
};

module.exports = nextConfig;
