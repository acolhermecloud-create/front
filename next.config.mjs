/** @type {import('next').NextConfig} */
const nextConfig = {
  webpack: (config) => {
    config.resolve.extensions.push('.mjs'); // Adicionar suporte para .mjs
    return config;
  },
  images: {
    domains: ['picsum.photos']
  },
};

export default nextConfig;
