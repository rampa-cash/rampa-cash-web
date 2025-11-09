'use client';

import { useTranslation } from 'next-i18next';

const SecuritySection = (): JSX.Element => {
    const { t } = useTranslation('common');

    return (
        <section
            id="security"
            className="py-20 md:py-32 bg-gradient-to-br from-white via-indigo-50 to-purple-50 dark:from-gray-900 dark:via-indigo-950 dark:to-purple-950 overflow-hidden relative"
        >
            <div className="absolute top-0 right-1/4 w-96 h-96 bg-gradient-to-r from-indigo-400/10 to-purple-500/10 rounded-full blur-3xl animate-pulse"></div>
            <div
                className="absolute bottom-0 left-1/4 w-96 h-96 bg-gradient-to-r from-purple-400/10 to-pink-500/10 rounded-full blur-3xl animate-pulse"
                style={{ animationDelay: '2s' }}
            ></div>

            <div className="container mx-auto px-4 md:px-8 relative">
                <div className="text-center mb-16">
                    <h2 className="text-3xl md:text-4xl lg:text-5xl font-extrabold mb-6 bg-gradient-to-r from-gray-900 via-indigo-900 to-purple-900 dark:from-white dark:via-indigo-200 dark:to-purple-200 bg-clip-text text-transparent tracking-tight">
                        {t('security.title')}
                    </h2>
                    <div className="w-32 h-1.5 bg-gradient-to-r from-indigo-500 via-purple-600 to-pink-600 mx-auto rounded-full shadow-lg mb-8"></div>
                    <p className="text-lg md:text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto leading-relaxed">
                        {t('security.subtitle')}
                    </p>
                </div>

                <div className="grid gap-6 md:gap-8 sm:grid-cols-2 lg:grid-cols-3 max-w-7xl mx-auto mb-16">
                    {/* Self Custody */}
                    <div
                        className="bg-white dark:bg-gray-800 p-6 md:p-8 rounded-2xl shadow-xl border border-indigo-100/50 dark:border-gray-700/50 hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 group cursor-pointer animate-fade-in-up"
                        style={{ animationDelay: '0ms' }}
                    >
                        <div className="w-12 h-12 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 group-hover:rotate-6 transition-all duration-300 shadow-lg">
                            <svg
                                className="w-6 h-6 text-white"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth="2"
                                    d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z"
                                />
                            </svg>
                        </div>
                        <h3 className="text-lg font-bold mb-2 text-gray-900 dark:text-white group-hover:text-indigo-700 dark:group-hover:text-indigo-400 transition-colors duration-300">
                            {t('security.features.selfCustody.title')}
                        </h3>
                        <p className="text-gray-600 dark:text-gray-300 text-sm leading-relaxed">
                            {t('security.features.selfCustody.description')}
                        </p>
                    </div>

                    {/* No Seed Phrase */}
                    <div
                        className="bg-white dark:bg-gray-800 p-6 md:p-8 rounded-2xl shadow-xl border border-indigo-100/50 dark:border-gray-700/50 hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 group cursor-pointer animate-fade-in-up"
                        style={{ animationDelay: '100ms' }}
                    >
                        <div className="w-12 h-12 bg-gradient-to-r from-purple-600 to-pink-600 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 group-hover:rotate-6 transition-all duration-300 shadow-lg">
                            <svg
                                className="w-6 h-6 text-white"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth="2"
                                    d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                                />
                            </svg>
                        </div>
                        <h3 className="text-lg font-bold mb-2 text-gray-900 dark:text-white group-hover:text-purple-700 dark:group-hover:text-purple-400 transition-colors duration-300">
                            {t('security.features.noSeedPhrase.title')}
                        </h3>
                        <p className="text-gray-600 dark:text-gray-300 text-sm leading-relaxed">
                            {t('security.features.noSeedPhrase.description')}
                        </p>
                    </div>

                    {/* Only You */}
                    <div
                        className="bg-white dark:bg-gray-800 p-6 md:p-8 rounded-2xl shadow-xl border border-indigo-100/50 dark:border-gray-700/50 hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 group cursor-pointer animate-fade-in-up"
                        style={{ animationDelay: '200ms' }}
                    >
                        <div className="w-12 h-12 bg-gradient-to-r from-pink-600 to-red-500 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 group-hover:rotate-6 transition-all duration-300 shadow-lg">
                            <svg
                                className="w-6 h-6 text-white"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth="2"
                                    d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                                />
                            </svg>
                        </div>
                        <h3 className="text-lg font-bold mb-2 text-gray-900 dark:text-white group-hover:text-pink-700 dark:group-hover:text-pink-400 transition-colors duration-300">
                            {t('security.features.onlyYou.title')}
                        </h3>
                        <p className="text-gray-600 dark:text-gray-300 text-sm leading-relaxed">
                            {t('security.features.onlyYou.description')}
                        </p>
                    </div>

                    {/* Easy Recovery */}
                    <div
                        className="bg-white dark:bg-gray-800 p-6 md:p-8 rounded-2xl shadow-xl border border-indigo-100/50 dark:border-gray-700/50 hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 group cursor-pointer animate-fade-in-up"
                        style={{ animationDelay: '300ms' }}
                    >
                        <div className="w-12 h-12 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 group-hover:rotate-6 transition-all duration-300 shadow-lg">
                            <svg
                                className="w-6 h-6 text-white"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth="2"
                                    d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                                />
                            </svg>
                        </div>
                        <h3 className="text-lg font-bold mb-2 text-gray-900 dark:text-white group-hover:text-blue-700 dark:group-hover:text-blue-400 transition-colors duration-300">
                            {t('security.features.easyRecovery.title')}
                        </h3>
                        <p className="text-gray-600 dark:text-gray-300 text-sm leading-relaxed">
                            {t('security.features.easyRecovery.description')}
                        </p>
                    </div>

                    {/* Always On */}
                    <div
                        className="bg-white dark:bg-gray-800 p-6 md:p-8 rounded-2xl shadow-xl border border-indigo-100/50 dark:border-gray-700/50 hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 group cursor-pointer animate-fade-in-up"
                        style={{ animationDelay: '400ms' }}
                    >
                        <div className="w-12 h-12 bg-gradient-to-r from-green-600 to-emerald-600 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 group-hover:rotate-6 transition-all duration-300 shadow-lg">
                            <svg
                                className="w-6 h-6 text-white"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth="2"
                                    d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
                                />
                            </svg>
                        </div>
                        <h3 className="text-lg font-bold mb-2 text-gray-900 dark:text-white group-hover:text-green-700 dark:group-hover:text-green-400 transition-colors duration-300">
                            {t('security.features.alwaysOn.title')}
                        </h3>
                        <p className="text-gray-600 dark:text-gray-300 text-sm leading-relaxed">
                            {t('security.features.alwaysOn.description')}
                        </p>
                    </div>

                    {/* Private by Default */}
                    <div
                        className="bg-white dark:bg-gray-800 p-6 md:p-8 rounded-2xl shadow-xl border border-indigo-100/50 dark:border-gray-700/50 hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 group cursor-pointer animate-fade-in-up"
                        style={{ animationDelay: '500ms' }}
                    >
                        <div className="w-12 h-12 bg-gradient-to-r from-violet-600 to-purple-600 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 group-hover:rotate-6 transition-all duration-300 shadow-lg">
                            <svg
                                className="w-6 h-6 text-white"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth="2"
                                    d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                                />
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth="2"
                                    d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                                />
                            </svg>
                        </div>
                        <h3 className="text-lg font-bold mb-2 text-gray-900 dark:text-white group-hover:text-violet-700 dark:group-hover:text-violet-400 transition-colors duration-300">
                            {t('security.features.privateByDefault.title')}
                        </h3>
                        <p className="text-gray-600 dark:text-gray-300 text-sm leading-relaxed">
                            {t(
                                'security.features.privateByDefault.description'
                            )}
                        </p>
                    </div>
                </div>

                {/* ID Check Info Box */}
                <div className="bg-gradient-to-br from-indigo-600/10 to-purple-600/10 dark:from-indigo-600/20 dark:to-purple-600/20 backdrop-blur-sm rounded-3xl p-8 md:p-10 mb-12 max-w-4xl mx-auto border border-indigo-200/50 dark:border-indigo-500/30 animate-fade-in">
                    <div className="flex items-start space-x-4">
                        <div className="flex-shrink-0">
                            <svg
                                className="w-6 h-6 text-indigo-600 dark:text-indigo-400"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth="2"
                                    d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                                />
                            </svg>
                        </div>
                        <div>
                            <h3 className="text-lg font-bold mb-2 text-gray-900 dark:text-white">
                                {t('security.idCheck.title')}
                            </h3>
                            <p className="text-gray-600 dark:text-gray-300 text-sm leading-relaxed mb-4">
                                {t('security.idCheck.description')}
                            </p>
                            <p className="text-gray-500 dark:text-gray-400 text-xs leading-relaxed italic">
                                {t('security.idCheck.technical')}
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default SecuritySection;
