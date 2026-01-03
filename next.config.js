/** @type {import('next').NextConfig} */
const nextConfig = {
  // Fix Firebase redirect on Vercel
  async rewrites() {
    return [
      {
        source: '/__/auth/:path*',
        has: [],
        destination: 'https://YOUR-PROJECT-ID.firebaseapp.com/__/auth/:path*'
      }
    ]
  }
}

module.exports = nextConfig;
