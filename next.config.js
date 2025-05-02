/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  // Comment out the redirects
  // async redirects() {
  //   return [
  //     // Redirect from www to non-www (or vice versa, depending on preference)
  //     {
  //       source: '/:path*',
  //       has: [
  //         {
  //           type: 'host',
  //           value: 'www.rampa.cash',
  //         },
  //       ],
  //       destination: 'https://rampa.cash/:path*',
  //       permanent: true,
  //     },
  //     {
  //       source: '/:path*',
  //       has: [
  //         {
  //           type: 'host',
  //           value: 'www.rampacash.com',
  //         },
  //       ],
  //       destination: 'https://rampa.cash/:path*',
  //       permanent: true,
  //     },
  //     {
  //       source: '/:path*',
  //       has: [
  //         {
  //           type: 'host',
  //           value: 'rampacash.com',
  //         },
  //       ],
  //       destination: 'https://rampa.cash/:path*',
  //       permanent: true,
  //     },
  //   ];
  // },
}

module.exports = nextConfig