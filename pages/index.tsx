import type { NextPage } from 'next'
import { useTranslation } from 'next-i18next'
import { serverSideTranslations } from 'next-i18next/serverSideTranslations'
import { GetStaticProps } from 'next'
import { WaitlistSignup } from '../features/waitlist'
import SecuritySection from '../components/SecuritySection'

const Home: NextPage = () => {
    const { t } = useTranslation('common')

    return (
        <>
            <section id="home" className="relative py-20 md:py-32 text-center px-4 bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 dark:from-gray-900 dark:via-indigo-900 dark:to-purple-900 overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-r from-indigo-500/8 to-purple-600/8"></div>
                <div className="absolute top-0 left-1/4 w-96 h-96 bg-gradient-to-r from-indigo-400/25 to-purple-500/25 rounded-full blur-3xl animate-pulse"></div>
                <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-gradient-to-r from-purple-400/25 to-pink-500/25 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '2s' }}></div>
                <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-72 h-72 bg-gradient-to-r from-blue-400/15 to-indigo-500/15 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '4s' }}></div>

                <div className="relative max-w-6xl mx-auto">
                    <div className="mb-8">
                        <span className="inline-flex items-center px-6 py-3 rounded-full bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 text-white text-sm font-bold shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-105">
                            {t('hero.badge')}
                        </span>
                    </div>

                    <h1 className="text-4xl sm:text-5xl md:text-7xl font-extrabold mb-8 md:mb-10 leading-[1.1] tracking-tight">
                        <span className="text-gray-900 dark:text-white">{t('hero.title.part1')}</span>
                        <br className="hidden sm:block" />
                        <span className="bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 bg-clip-text text-transparent drop-shadow-sm"> {t('hero.title.part2')}</span>
                        <br className="hidden sm:block" />
                        <span className="block mt-4 text-3xl sm:text-4xl md:text-6xl font-bold bg-gradient-to-r from-gray-700 via-gray-800 to-gray-900 dark:from-gray-300 dark:via-gray-200 dark:to-white bg-clip-text text-transparent">{t('hero.title.part3')}</span>
                    </h1>

                    <p className="text-xl md:text-2xl text-gray-600 dark:text-gray-300 mb-12 max-w-4xl mx-auto leading-relaxed">
                        {t('hero.description')}
                    </p>

                    <div className="mt-16">
                        <div className="bg-white/90 dark:bg-gray-800/90 backdrop-blur-md p-8 md:p-10 rounded-3xl shadow-2xl border border-white/60 dark:border-gray-700/60 max-w-2xl mx-auto hover:shadow-3xl transition-all duration-500 hover:-translate-y-1">
                            <WaitlistSignup
                                title={t('hero.cta.title')}
                                description={t('hero.cta.description')}
                                className="max-w-lg mx-auto"
                            />
                        </div>

                        {/* Enhanced social proof with micro-interactions */}
                        <div className="mt-12 flex flex-col sm:flex-row items-center justify-center gap-8 text-gray-600 dark:text-gray-300">
                            <div className="flex items-center space-x-2 group cursor-pointer hover:scale-105 transition-all duration-300">
                                <div className="flex -space-x-2">
                                    <div className="w-8 h-8 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full border-2 border-white hover:scale-110 transition-transform duration-300"></div>
                                    <div className="w-8 h-8 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full border-2 border-white hover:scale-110 transition-transform duration-300" style={{ transitionDelay: '50ms' }}></div>
                                    <div className="w-8 h-8 bg-gradient-to-r from-pink-500 to-red-500 rounded-full border-2 border-white hover:scale-110 transition-transform duration-300" style={{ transitionDelay: '100ms' }}></div>
                                    <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-full border-2 border-white flex items-center justify-center text-white text-xs font-bold hover:scale-110 transition-transform duration-300" style={{ transitionDelay: '150ms' }}>
                                        β
                                    </div>
                                </div>
                                <span className="text-sm font-medium group-hover:text-indigo-600 transition-colors duration-300">{t('hero.socialProof.betaTesters')}</span>
                            </div>
                            <div className="flex items-center space-x-2 group cursor-pointer hover:scale-105 transition-all duration-300">
                                <svg className="w-5 h-5 text-yellow-500 group-hover:text-yellow-400 group-hover:rotate-12 transition-all duration-300" fill="currentColor" viewBox="0 0 20 20">
                                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                                </svg>
                                <span className="text-sm font-medium group-hover:text-indigo-600 transition-colors duration-300">{t('hero.socialProof.trustedBy')}</span>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
            <section id="how-it-works" className="py-20 md:py-32 bg-gradient-to-br from-white to-gray-50 dark:from-gray-900 dark:to-gray-800">
                <div className="container mx-auto px-4 md:px-8">
                    <div className="text-center mb-16">
                        <h2 className="text-3xl md:text-4xl lg:text-5xl font-extrabold text-center mb-6 bg-gradient-to-r from-gray-900 via-indigo-900 to-purple-900 dark:from-white dark:via-indigo-200 dark:to-purple-200 bg-clip-text text-transparent tracking-tight">{t('howItWorks.title')}</h2>
                        <p className="text-lg md:text-xl text-gray-600 dark:text-gray-300 text-center mb-4 max-w-3xl mx-auto leading-relaxed">
                            {t('howItWorks.description')}
                        </p>
                        <div className="w-32 h-1.5 bg-gradient-to-r from-indigo-500 via-purple-600 to-pink-600 mx-auto rounded-full shadow-lg"></div>
                    </div>

                    <div className="grid gap-8 md:gap-10 sm:grid-cols-2 lg:grid-cols-4">
                        <div className="bg-white dark:bg-gray-800 p-8 md:p-10 rounded-2xl shadow-xl border border-indigo-100/50 dark:border-gray-700/50 hover:shadow-2xl hover:border-indigo-200 dark:hover:border-indigo-400 transition-all duration-300 hover:-translate-y-2 group cursor-pointer">
                            <div className="w-14 h-14 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-2xl flex items-center justify-center font-bold mb-6 text-xl group-hover:scale-110 group-hover:rotate-3 transition-all duration-300 shadow-lg">
                                1
                            </div>
                            <h3 className="text-xl md:text-2xl font-bold mb-4 text-gray-900 dark:text-white leading-tight group-hover:text-indigo-700 dark:group-hover:text-indigo-400 transition-colors duration-300">{t('howItWorks.steps.step1.title')}</h3>
                            <p className="text-gray-600 dark:text-gray-300 leading-relaxed group-hover:text-gray-700 dark:group-hover:text-gray-200 transition-colors duration-300">{t('howItWorks.steps.step1.description')}</p>
                        </div>

                        <div className="bg-white dark:bg-gray-800 p-8 md:p-10 rounded-2xl shadow-xl border border-indigo-100/50 dark:border-gray-700/50 hover:shadow-2xl hover:border-indigo-200 dark:hover:border-indigo-400 transition-all duration-300 hover:-translate-y-2 group cursor-pointer">
                            <div className="w-14 h-14 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-2xl flex items-center justify-center font-bold mb-6 text-xl group-hover:scale-110 group-hover:rotate-3 transition-all duration-300 shadow-lg">
                                2
                            </div>
                            <h3 className="text-xl md:text-2xl font-bold mb-4 text-gray-900 dark:text-white leading-tight group-hover:text-indigo-700 dark:group-hover:text-indigo-400 transition-colors duration-300">{t('howItWorks.steps.step2.title')}</h3>
                            <p className="text-gray-600 dark:text-gray-300 leading-relaxed group-hover:text-gray-700 dark:group-hover:text-gray-200 transition-colors duration-300">{t('howItWorks.steps.step2.description')}</p>
                        </div>

                        <div className="bg-white dark:bg-gray-800 p-8 md:p-10 rounded-2xl shadow-xl border border-indigo-100/50 dark:border-gray-700/50 hover:shadow-2xl hover:border-indigo-200 dark:hover:border-indigo-400 transition-all duration-300 hover:-translate-y-2 group cursor-pointer">
                            <div className="w-14 h-14 bg-gradient-to-r from-pink-600 to-red-500 text-white rounded-2xl flex items-center justify-center font-bold mb-6 text-xl group-hover:scale-110 group-hover:rotate-3 transition-all duration-300 shadow-lg">
                                3
                            </div>
                            <h3 className="text-xl md:text-2xl font-bold mb-4 text-gray-900 dark:text-white leading-tight group-hover:text-indigo-700 dark:group-hover:text-indigo-400 transition-colors duration-300">{t('howItWorks.steps.step3.title')}</h3>
                            <p className="text-gray-600 dark:text-gray-300 leading-relaxed group-hover:text-gray-700 dark:group-hover:text-gray-200 transition-colors duration-300">{t('howItWorks.steps.step3.description')}</p>
                        </div>

                        <div className="bg-white dark:bg-gray-800 p-8 md:p-10 rounded-2xl shadow-xl border border-indigo-100/50 dark:border-gray-700/50 hover:shadow-2xl hover:border-indigo-200 dark:hover:border-indigo-400 transition-all duration-300 hover:-translate-y-2 group cursor-pointer">
                            <div className="w-14 h-14 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-2xl flex items-center justify-center font-bold mb-6 text-xl group-hover:scale-110 group-hover:rotate-3 transition-all duration-300 shadow-lg">
                                4
                            </div>
                            <h3 className="text-xl md:text-2xl font-bold mb-4 text-gray-900 dark:text-white leading-tight group-hover:text-indigo-700 dark:group-hover:text-indigo-400 transition-colors duration-300">{t('howItWorks.steps.step4.title')}</h3>
                            <p className="text-gray-600 dark:text-gray-300 leading-relaxed group-hover:text-gray-700 dark:group-hover:text-gray-200 transition-colors duration-300">{t('howItWorks.steps.step4.description')}</p>
                        </div>
                    </div>
                </div>
            </section>
            <section id="pricing" className="py-20 md:py-32 bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 dark:from-gray-800 dark:via-indigo-900 dark:to-purple-900">
                <div className="container mx-auto px-4 md:px-8 text-center">
                    <div className="mb-16">
                        <h2 className="text-3xl md:text-4xl lg:text-5xl font-extrabold mb-6 bg-gradient-to-r from-gray-900 via-indigo-900 to-purple-900 dark:from-white dark:via-indigo-200 dark:to-purple-200 bg-clip-text text-transparent tracking-tight">{t('pricing.title')}</h2>
                        <div className="w-32 h-1.5 bg-gradient-to-r from-indigo-500 via-purple-600 to-pink-600 mx-auto rounded-full shadow-lg mb-8"></div>
                        <p className="text-lg md:text-xl mb-4 max-w-3xl mx-auto text-gray-600 dark:text-gray-300 leading-relaxed">
                            {t('pricing.description')}
                        </p>
                    </div>

                    <div className="grid gap-8 md:gap-10 sm:grid-cols-2 lg:grid-cols-3 max-w-6xl mx-auto">
                        <div className="bg-white dark:bg-gray-800 p-10 md:p-12 rounded-3xl shadow-2xl border border-gray-100/50 dark:border-gray-700/50 hover:shadow-3xl transition-all duration-500 hover:-translate-y-2 group relative overflow-hidden cursor-pointer">
                            <div className="absolute inset-0 bg-gradient-to-br from-green-50/50 to-emerald-50/50 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                            <div className="relative">
                                <div className="w-20 h-20 bg-gradient-to-r from-green-500 to-emerald-600 rounded-3xl flex items-center justify-center mx-auto mb-8 group-hover:scale-110 group-hover:rotate-6 transition-all duration-300">
                                    <svg className="w-10 h-10 text-white group-hover:scale-110 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                                    </svg>
                                </div>
                                <div className="text-3xl md:text-4xl font-bold text-green-600 mb-6 group-hover:text-green-500 transition-colors duration-300">{t('pricing.features.realTimeRates.title')}</div>
                                <p className="text-gray-600 dark:text-gray-300 leading-relaxed text-lg group-hover:text-gray-700 dark:group-hover:text-gray-200 transition-colors duration-300">{t('pricing.features.realTimeRates.description')}</p>
                                <div className="mt-8 pt-6 border-t border-gray-100 group-hover:border-green-100 transition-colors duration-300">
                                    <div className="flex items-center justify-center text-green-600 font-semibold group-hover:text-green-500 transition-colors duration-300">
                                        <svg className="w-5 h-5 mr-2 group-hover:scale-110 transition-transform duration-300" fill="currentColor" viewBox="0 0 20 20">
                                            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                        </svg>
                                        {t('pricing.features.realTimeRates.badge')}
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="bg-white dark:bg-gray-800 p-10 md:p-12 rounded-3xl shadow-2xl border border-gray-100/50 dark:border-gray-700/50 hover:shadow-3xl transition-all duration-500 hover:-translate-y-2 group relative overflow-hidden lg:scale-105 cursor-pointer">
                            <div className="absolute inset-0 bg-gradient-to-br from-blue-50/50 to-indigo-50/50 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                            <div className="relative">
                                <div className="w-20 h-20 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-3xl flex items-center justify-center mx-auto mb-8 group-hover:scale-110 group-hover:rotate-6 transition-all duration-300">
                                    <svg className="w-10 h-10 text-white group-hover:scale-110 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                                    </svg>
                                </div>
                                <div className="text-3xl md:text-4xl font-bold text-blue-600 mb-6 group-hover:text-blue-500 transition-colors duration-300">{t('pricing.features.noHiddenFees.title')}</div>
                                <p className="text-gray-600 dark:text-gray-300 leading-relaxed text-lg group-hover:text-gray-700 dark:group-hover:text-gray-200 transition-colors duration-300">{t('pricing.features.noHiddenFees.description')}</p>
                                <div className="mt-8 pt-6 border-t border-gray-100 group-hover:border-blue-100 transition-colors duration-300">
                                    <div className="flex items-center justify-center text-blue-600 font-semibold group-hover:text-blue-500 transition-colors duration-300">
                                        <svg className="w-5 h-5 mr-2 group-hover:scale-110 transition-transform duration-300" fill="currentColor" viewBox="0 0 20 20">
                                            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                        </svg>
                                        {t('pricing.features.noHiddenFees.badge')}
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="bg-white dark:bg-gray-800 p-10 md:p-12 rounded-3xl shadow-2xl border border-gray-100/50 dark:border-gray-700/50 hover:shadow-3xl transition-all duration-500 hover:-translate-y-2 group relative overflow-hidden cursor-pointer">
                            <div className="absolute inset-0 bg-gradient-to-br from-purple-50/50 to-pink-50/50 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                            <div className="relative">
                                <div className="w-20 h-20 bg-gradient-to-r from-purple-500 to-pink-600 rounded-3xl flex items-center justify-center mx-auto mb-8 group-hover:scale-110 group-hover:rotate-6 transition-all duration-300">
                                    <svg className="w-10 h-10 text-white group-hover:scale-110 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                                    </svg>
                                </div>
                                <div className="text-3xl md:text-4xl font-bold text-purple-600 mb-6 group-hover:text-purple-500 transition-colors duration-300">{t('pricing.features.lowCommission.title')}</div>
                                <p className="text-gray-600 dark:text-gray-300 leading-relaxed text-lg group-hover:text-gray-700 dark:group-hover:text-gray-200 transition-colors duration-300">{t('pricing.features.lowCommission.description')}</p>
                                <div className="mt-8 pt-6 border-t border-gray-100 group-hover:border-purple-100 transition-colors duration-300">
                                    <div className="flex items-center justify-center text-purple-600 font-semibold group-hover:text-purple-500 transition-colors duration-300">
                                        <svg className="w-5 h-5 mr-2 group-hover:scale-110 transition-transform duration-300" fill="currentColor" viewBox="0 0 20 20">
                                            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                        </svg>
                                        {t('pricing.features.lowCommission.badge')}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Enhanced trust indicators with micro-interactions */}
                    <div className="mt-16 grid gap-6 sm:grid-cols-2 lg:grid-cols-4 max-w-4xl mx-auto">
                        <div className="text-center group cursor-pointer hover:scale-105 transition-all duration-300 p-4 rounded-2xl hover:bg-white/50">
                            <div className="text-3xl font-bold text-gray-900 dark:text-white group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors duration-300">0.5%</div>
                            <div className="text-gray-600 dark:text-gray-300 group-hover:text-gray-700 dark:group-hover:text-gray-200 transition-colors duration-300">{t('pricing.stats.commission')}</div>
                        </div>
                        <div className="text-center group cursor-pointer hover:scale-105 transition-all duration-300 p-4 rounded-2xl hover:bg-white/50">
                            <div className="text-3xl font-bold text-gray-900 dark:text-white group-hover:text-purple-600 dark:group-hover:text-purple-400 transition-colors duration-300">~30s</div>
                            <div className="text-gray-600 dark:text-gray-300 group-hover:text-gray-700 dark:group-hover:text-gray-200 transition-colors duration-300">{t('pricing.stats.transferTime')}</div>
                        </div>
                        <div className="text-center group cursor-pointer hover:scale-105 transition-all duration-300 p-4 rounded-2xl hover:bg-white/50">
                            <div className="text-3xl font-bold text-gray-900 dark:text-white group-hover:text-pink-600 dark:group-hover:text-pink-400 transition-colors duration-300">180+</div>
                            <div className="text-gray-600 dark:text-gray-300 group-hover:text-gray-700 dark:group-hover:text-gray-200 transition-colors duration-300">{t('pricing.stats.countries')}</div>
                        </div>
                        <div className="text-center group cursor-pointer hover:scale-105 transition-all duration-300 p-4 rounded-2xl hover:bg-white/50">
                            <div className="text-3xl font-bold text-gray-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors duration-300">24/7</div>
                            <div className="text-gray-600 dark:text-gray-300 group-hover:text-gray-700 dark:group-hover:text-gray-200 transition-colors duration-300">{t('pricing.stats.support')}</div>
                        </div>
                    </div>
                </div>
            </section>
            <SecuritySection />
            <section id="about-us" className="py-20 md:py-32 bg-gradient-to-br from-gray-50 via-blue-50 to-indigo-50 dark:from-gray-800 dark:via-blue-900 dark:to-indigo-900">
                <div className="container mx-auto px-4 md:px-8 text-center">
                    <div className="mb-16">
                        <h2 className="text-3xl md:text-4xl lg:text-5xl font-extrabold mb-6 bg-gradient-to-r from-gray-900 via-indigo-900 to-purple-900 dark:from-white dark:via-indigo-200 dark:to-purple-200 bg-clip-text text-transparent tracking-tight">{t('aboutUs.title')}</h2>
                        <div className="w-32 h-1.5 bg-gradient-to-r from-indigo-500 via-purple-600 to-pink-600 mx-auto rounded-full shadow-lg mb-8"></div>
                        <p className="text-lg md:text-xl mb-4 max-w-4xl mx-auto text-gray-600 dark:text-gray-300 leading-relaxed">
                            {t('aboutUs.description')}
                        </p>
                    </div>

                    <div className="grid gap-10 md:gap-12 sm:grid-cols-2 lg:grid-cols-3 max-w-6xl mx-auto">
                        <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm p-10 md:p-12 rounded-3xl shadow-2xl border border-white/50 dark:border-gray-700/50 hover:shadow-3xl transition-all duration-500 hover:-translate-y-3 group relative overflow-hidden cursor-pointer">
                            <div className="absolute inset-0 bg-gradient-to-br from-purple-50/30 to-blue-50/30 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                            <div className="relative">
                                <div className="w-20 h-20 bg-gradient-to-r from-purple-500 to-blue-500 rounded-3xl flex items-center justify-center mx-auto mb-8 group-hover:scale-110 group-hover:rotate-3 transition-all duration-300">
                                    <svg className="w-10 h-10 text-white group-hover:scale-110 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
                                    </svg>
                                </div>
                                <h3 className="text-2xl md:text-3xl font-bold mb-6 text-gray-900 dark:text-white group-hover:text-purple-700 dark:group-hover:text-purple-400 transition-colors duration-300">{t('aboutUs.features.web3Simplified.title')}</h3>
                                <p className="text-gray-600 dark:text-gray-300 leading-relaxed text-lg mb-6 group-hover:text-gray-700 dark:group-hover:text-gray-200 transition-colors duration-300">{t('aboutUs.features.web3Simplified.description')}</p>
                                <div className="flex items-center justify-center">
                                    <div className="px-4 py-2 bg-gradient-to-r from-purple-100 to-blue-100 rounded-full group-hover:from-purple-200 group-hover:to-blue-200 transition-all duration-300 group-hover:scale-105">
                                        <span className="text-purple-700 font-semibold text-sm">{t('aboutUs.features.web3Simplified.badge')}</span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm p-10 md:p-12 pt-16 md:pt-18 rounded-3xl shadow-2xl border border-white/50 dark:border-gray-700/50 hover:shadow-3xl transition-all duration-500 hover:-translate-y-3 group relative overflow-hidden lg:scale-105 cursor-pointer">
                            <div className="absolute inset-0 bg-gradient-to-br from-green-50/30 to-teal-50/30 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                            <div className="absolute -top-1 -right-1 bg-gradient-to-r from-green-500 to-teal-600 text-white px-6 py-2 rounded-full text-sm font-bold shadow-lg group-hover:scale-110 transition-transform duration-300">
                                {t('aboutUs.features.forRealPeople.highlight')}
                            </div>
                            <div className="relative">
                                <div className="w-20 h-20 bg-gradient-to-r from-green-500 to-teal-500 rounded-3xl flex items-center justify-center mx-auto mb-8 group-hover:scale-110 group-hover:rotate-3 transition-all duration-300">
                                    <svg className="w-10 h-10 text-white group-hover:scale-110 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                                    </svg>
                                </div>
                                <h3 className="text-2xl md:text-3xl font-bold mb-6 text-gray-900 dark:text-white group-hover:text-green-700 dark:group-hover:text-green-400 transition-colors duration-300">{t('aboutUs.features.forRealPeople.title')}</h3>
                                <p className="text-gray-800 dark:text-gray-300 leading-relaxed text-lg mb-6 group-hover:text-gray-900 dark:group-hover:text-gray-200 transition-colors duration-300">{t('aboutUs.features.forRealPeople.description')}</p>
                                <div className="flex items-center justify-center">
                                    <div className="px-4 py-2 bg-gradient-to-r from-green-100 to-teal-100 rounded-full group-hover:from-green-200 group-hover:to-teal-200 transition-all duration-300 group-hover:scale-105">
                                        <span className="text-green-700 font-semibold text-sm">{t('aboutUs.features.forRealPeople.badge')}</span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm p-10 md:p-12 rounded-3xl shadow-2xl border border-white/50 dark:border-gray-700/50 hover:shadow-3xl transition-all duration-500 hover:-translate-y-3 group relative overflow-hidden cursor-pointer">
                            <div className="absolute inset-0 bg-gradient-to-br from-orange-50/30 to-red-50/30 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                            <div className="relative">
                                <div className="w-20 h-20 bg-gradient-to-r from-orange-500 to-red-500 rounded-3xl flex items-center justify-center mx-auto mb-8 group-hover:scale-110 group-hover:rotate-3 transition-all duration-300">
                                    <svg className="w-10 h-10 text-white group-hover:scale-110 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" />
                                    </svg>
                                </div>
                                <h3 className="text-2xl md:text-3xl font-bold mb-6 text-gray-900 dark:text-white group-hover:text-orange-700 dark:group-hover:text-orange-400 transition-colors duration-300">{t('aboutUs.features.invisibleInnovation.title')}</h3>
                                <p className="text-gray-600 dark:text-gray-300 leading-relaxed text-lg mb-6 group-hover:text-gray-700 dark:group-hover:text-gray-200 transition-colors duration-300">{t('aboutUs.features.invisibleInnovation.description')}</p>
                                <div className="flex items-center justify-center">
                                    <div className="px-4 py-2 bg-gradient-to-r from-orange-100 to-red-100 rounded-full group-hover:from-orange-200 group-hover:to-red-200 transition-all duration-300 group-hover:scale-105">
                                        <span className="text-orange-700 font-semibold text-sm">{t('aboutUs.features.invisibleInnovation.badge')}</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
            <section id="waitlist" className="py-20 md:py-32 bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-900 text-white relative overflow-hidden">
                {/* Enhanced background decorative elements */}
                <div className="absolute inset-0 bg-gradient-to-r from-indigo-600/30 to-purple-600/30"></div>
                <div className="absolute top-0 right-1/4 w-96 h-96 bg-gradient-to-r from-purple-400/40 to-pink-500/40 rounded-full blur-3xl animate-pulse"></div>
                <div className="absolute bottom-0 left-1/4 w-96 h-96 bg-gradient-to-r from-indigo-400/40 to-purple-500/40 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '3s' }}></div>
                <div className="absolute top-1/2 right-1/3 w-64 h-64 bg-gradient-to-r from-pink-400/30 to-red-500/30 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1.5s' }}></div>

                <div className="relative container mx-auto px-4 md:px-8 text-center">
                    <div className="mb-8">
                        <span className="inline-flex items-center px-6 py-3 rounded-full bg-white/25 backdrop-blur-md text-white text-sm font-bold border border-white/30 hover:bg-white/30 transition-all duration-300 hover:scale-105 shadow-xl">
                            {t('waitlist.badge')}
                        </span>
                    </div>

                    <h2 className="text-3xl md:text-4xl lg:text-5xl font-extrabold mb-6 tracking-tight">{t('waitlist.title')}</h2>
                    <p className="text-lg md:text-xl mb-12 max-w-4xl mx-auto leading-relaxed text-white/90">
                        {t('waitlist.description')}
                    </p>

                    <div className="bg-white/15 backdrop-blur-md p-8 md:p-10 rounded-3xl border border-white/25 max-w-2xl mx-auto mb-12 hover:bg-white/20 transition-all duration-500 hover:-translate-y-1 shadow-2xl">
                        <WaitlistSignup
                            title={t('waitlist.cta.title')}
                            description={t('waitlist.cta.description')}
                        />
                    </div>

                    <div className="grid gap-6 sm:grid-cols-3 max-w-3xl mx-auto text-base text-white/80">
                        <div className="flex items-center justify-center space-x-3 bg-white/15 backdrop-blur-md p-4 rounded-2xl border border-white/25 hover:bg-white/20 transition-all duration-300 hover:scale-105 cursor-pointer group">
                            <svg className="w-5 h-5 text-green-400 flex-shrink-0 group-hover:scale-110 group-hover:rotate-12 transition-all duration-300" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                            </svg>
                            <span className="font-medium text-white group-hover:text-green-200 transition-colors duration-300">{t('waitlist.benefits.earlyAccess')}</span>
                        </div>
                        <div className="flex items-center justify-center space-x-3 bg-white/15 backdrop-blur-md p-4 rounded-2xl border border-white/25 hover:bg-white/20 transition-all duration-300 hover:scale-105 cursor-pointer group">
                            <svg className="w-5 h-5 text-green-400 flex-shrink-0 group-hover:scale-110 group-hover:rotate-12 transition-all duration-300" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                            </svg>
                            <span className="font-medium text-white group-hover:text-green-200 transition-colors duration-300">{t('waitlist.benefits.launchBonuses')}</span>
                        </div>
                        <div className="flex items-center justify-center space-x-3 bg-white/15 backdrop-blur-md p-4 rounded-2xl border border-white/25 hover:bg-white/20 transition-all duration-300 hover:scale-105 cursor-pointer group">
                            <svg className="w-5 h-5 text-green-400 flex-shrink-0 group-hover:scale-110 group-hover:rotate-12 transition-all duration-300" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                            </svg>
                            <span className="font-medium text-white group-hover:text-green-200 transition-colors duration-300">{t('waitlist.benefits.noSpam')}</span>
                        </div>
                    </div>
                </div>
            </section>
        </>
    )
}

export default Home

export const getStaticProps: GetStaticProps = async ({ locale }) => {
    return {
        props: {
            ...(await serverSideTranslations(locale ?? 'en', ['common'])),
        },
    }
}