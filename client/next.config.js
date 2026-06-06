/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: ['imagedelivery.net', 'pub-55f84330b09847d4879adb5b76659861.r2.dev'],
    formats: ['image/avif', 'image/webp'],
  },
  async rewrites() {
    return [
      {
        source: '/api/:path*',
        destination: 'http://localhost:8000/api/:path*',
      },
    ];
  },
};

module.exports = nextConfig;