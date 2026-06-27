import createMDX from "@next/mdx";

/** @type {import('next').NextConfig} */
const nextConfig = {
  pageExtensions: ["ts", "tsx", "mdx"],
  images: {
    remotePatterns: [{ protocol: "https", hostname: "**" }],
  },
};

const withMDX = createMDX({});

export default withMDX(nextConfig);
