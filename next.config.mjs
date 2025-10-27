import withPWA from "next-pwa";

/** @type {import('next').NextConfig} */
const config = {
  /* config options here */
};

const nextConfig = withPWA({
  dest: "public",
  register: true,
  skipWaiting: true,
  disable: process.env.NODE_ENV === "development",
})(config);

export default nextConfig;