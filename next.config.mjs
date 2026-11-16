// /** @type {import('next').NextConfig} */
// const nextConfig = {};

// export default nextConfig;
import { withContentlayer } from 'next-contentlayer'
const nextConfig = {
  reactStrictMode: true,
  async redirects() {
    return [
      { source: "/reels", destination: "/", permanent: false },
      { source: "/nbs", destination: "/", permanent: false },
      { source: "/nbs/:path*", destination: "/", permanent: false },
      { source: "/blog", destination: "/", permanent: false },
      { source: "/blog/:path*", destination: "/", permanent: false },
      { source: "/courses", destination: "/", permanent: false },
      { source: "/courses/:path*", destination: "/", permanent: false },
    ];
  },
  images: {
    domains: ["img.youtube.com", "github-readme-stats.vercel.app", "res.cloudinary.com"],
    remotePatterns: [
      {
        protocol: "https",
        hostname: "github-readme-stats.vercel.app",
        pathname: "/**"
      },
      {
        protocol: "https",
        hostname: "img.youtube.com",
        pathname: "/**"
      },
      {
        protocol: "https",
        hostname: "res.cloudinary.com",
        pathname: "/**"
      }
    ]
  }
}
export default withContentlayer(nextConfig)
