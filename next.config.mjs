/** @type {import('next').NextConfig} */
const nextConfig = {
  output: "export",
  assetPrefix: "./",
  trailingSlash: false,
  images: { unoptimized: true },
};
export default nextConfig;
