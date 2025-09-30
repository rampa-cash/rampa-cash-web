module.exports = {
    i18n: {
        defaultLocale: 'en',
        locales: ['en', 'es'],
    },
    reloadOnPrerender: process.env.NODE_ENV === 'development',
    // Add this to fix the i18next instance warning
    react: {
        useSuspense: false,
    },
}