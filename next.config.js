/** @type {import('next').NextConfig} */
const nextConfig = {
    reactStrictMode: true,
    swcMinify: true,
    i18n: {
        locales: ['en', 'es'],
        defaultLocale: 'en',
    },
    webpack: (config, { isServer }) => {
        // Fix for Web3Auth/MetaMask SDK React Native dependencies
        if (!isServer) {
            config.resolve.fallback = {
                ...config.resolve.fallback,
                '@react-native-async-storage/async-storage': false,
                'react-native': false,
            };
        }
        return config;
    },
};

module.exports = nextConfig;
