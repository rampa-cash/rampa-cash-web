/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  async redirects() {
    return [
      // Redirect from www to non-www (or vice versa, depending on preference)
      {
        source: 'https://www.rampa.cash/:path*',
        destination: 'https://rampa.cash/:path*',
        permanent: true,
      },
      {
        source: 'https://www.rampacash.com/:path*',
        destination: 'https://rampa.cash/:path*',
        permanent: true,
      },
      {
        source: 'https://rampacash.com/:path*',
        destination: 'https://rampa.cash/:path*',
        permanent: true,
      },
    ];
  },
}

module.exports = nextConfig