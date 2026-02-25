/** @type {import('next').NextConfig} */
const nextConfig = {
  // 👇 mantém webpack custom
  webpack: (config) => {
    config.resolve.extensions.push(".mjs");
    return config;
  },

  // 👇 evita erro do Turbopack
  turbopack: {},

  // 👇 substitui images.domains (deprecated)
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "picsum.photos",
      },
    ],
  },
};

export default nextConfig;