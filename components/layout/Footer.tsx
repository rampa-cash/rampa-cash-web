import Link from 'next/link';
import { useTranslation } from 'next-i18next';

const Footer = (): JSX.Element => {
    const { t } = useTranslation('common');

    return (
        <footer className="py-6 md:py-8 border-t border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900">
            <div className="container mx-auto px-4 text-center text-gray-600 dark:text-gray-300">
                <div className="flex flex-col items-center justify-center">
                    <p className="mb-3 md:mb-4 text-sm md:text-base">
                        © {new Date().getFullYear()} Rampa.cash
                    </p>
                    <div className="flex flex-wrap items-center justify-center mb-4 space-x-4">
                        <span className="text-sm md:text-base">
                            {t('footer.followUs')}
                        </span>
                        <div className="flex items-center space-x-4">
                            {/* Twitter/X Link */}
                            <a
                                href="https://x.com/rampa_cash"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex items-center text-gray-700 dark:text-gray-300 hover:text-indigo-600 transition-colors"
                                aria-label="Follow us on X (Twitter)"
                            >
                                <svg
                                    className="w-4 h-4 md:w-5 md:h-5"
                                    viewBox="0 0 24 24"
                                    fill="currentColor"
                                >
                                    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                                </svg>
                                <span className="ml-1 text-sm md:text-base">
                                    @rampa_cash
                                </span>
                            </a>

                            {/* LinkedIn Link */}
                            <a
                                href="https://www.linkedin.com/company/rampa-cash/"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex items-center text-gray-700 dark:text-gray-300 hover:text-indigo-600 transition-colors"
                                aria-label="Follow us on LinkedIn"
                            >
                                <svg
                                    className="w-4 h-4 md:w-5 md:h-5"
                                    viewBox="0 0 24 24"
                                    fill="currentColor"
                                >
                                    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
                                </svg>
                                <span className="ml-1 text-sm md:text-base">
                                    LinkedIn
                                </span>
                            </a>
                        </div>
                    </div>
                    <div className="flex flex-wrap items-center justify-center space-x-2 md:space-x-4 text-xs md:text-sm">
                        <Link
                            href="/terms-of-service"
                            className="text-gray-600 dark:text-gray-300 hover:text-indigo-600 transition-colors"
                        >
                            {t('footer.termsOfService')}
                        </Link>
                        <span className="text-gray-400 dark:text-gray-500">
                            •
                        </span>
                        <Link
                            href="/privacy-policy"
                            className="text-gray-600 dark:text-gray-300 hover:text-indigo-600 transition-colors"
                        >
                            {t('footer.privacyPolicy')}
                        </Link>
                        <span className="text-gray-400 dark:text-gray-500">
                            •
                        </span>
                        <Link
                            href="/imprint"
                            className="text-gray-600 dark:text-gray-300 hover:text-indigo-600 transition-colors"
                        >
                            {t('footer.imprint')}
                        </Link>
                        <span className="text-gray-400 dark:text-gray-500">
                            •
                        </span>
                        <Link
                            href="/cookie-policy"
                            className="text-gray-600 dark:text-gray-300 hover:text-indigo-600 transition-colors"
                        >
                            {t('footer.cookiePolicy')}
                        </Link>
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
