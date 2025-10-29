import { NextPage } from 'next';
import { useTranslation } from 'next-i18next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { GetStaticProps } from 'next';
import Head from 'next/head';

const CookiePolicy: NextPage = () => {
    const { t } = useTranslation('common');

    return (
        <>
            <Head>
                <title>Cookie Policy - RAMPA</title>
                <meta
                    name="description"
                    content="Learn about how RAMPA uses cookies and your privacy rights"
                />
                <meta name="robots" content="noindex, nofollow" />
            </Head>

            <div className="min-h-screen bg-gray-50 py-20">
                <div className="container mx-auto px-4 max-w-4xl">
                    <div className="bg-white rounded-lg shadow-lg p-8 md:p-12">
                        <h1 className="text-3xl md:text-4xl font-bold mb-8 text-gray-900">
                            {t('cookiePolicy.title')}
                        </h1>

                        <div className="prose prose-lg max-w-none">
                            <p className="text-gray-600 mb-6">
                                {t('cookiePolicy.lastUpdated')}:{' '}
                                {new Date().toLocaleDateString()}
                            </p>

                            <section className="mb-8">
                                <h2 className="text-2xl font-semibold mb-4 text-gray-900">
                                    {t('cookiePolicy.whatAreCookies.title')}
                                </h2>
                                <p className="text-gray-700 leading-relaxed mb-4">
                                    {t(
                                        'cookiePolicy.whatAreCookies.description'
                                    )}
                                </p>
                            </section>

                            <section className="mb-8">
                                <h2 className="text-2xl font-semibold mb-4 text-gray-900">
                                    {t('cookiePolicy.howWeUseCookies.title')}
                                </h2>
                                <p className="text-gray-700 leading-relaxed mb-4">
                                    {t(
                                        'cookiePolicy.howWeUseCookies.description'
                                    )}
                                </p>
                            </section>

                            <section className="mb-8">
                                <h2 className="text-2xl font-semibold mb-4 text-gray-900">
                                    {t('cookiePolicy.typesOfCookies.title')}
                                </h2>

                                <div className="bg-gray-50 p-6 rounded-lg mb-4">
                                    <h3 className="text-lg font-semibold mb-2 text-gray-900">
                                        {t(
                                            'cookiePolicy.typesOfCookies.essential.title'
                                        )}
                                    </h3>
                                    <p className="text-gray-700">
                                        {t(
                                            'cookiePolicy.typesOfCookies.essential.description'
                                        )}
                                    </p>
                                </div>

                                <div className="bg-gray-50 p-6 rounded-lg mb-4">
                                    <h3 className="text-lg font-semibold mb-2 text-gray-900">
                                        {t(
                                            'cookiePolicy.typesOfCookies.functional.title'
                                        )}
                                    </h3>
                                    <p className="text-gray-700">
                                        {t(
                                            'cookiePolicy.typesOfCookies.functional.description'
                                        )}
                                    </p>
                                </div>
                            </section>

                            <section className="mb-8">
                                <h2 className="text-2xl font-semibold mb-4 text-gray-900">
                                    {t('cookiePolicy.yourChoices.title')}
                                </h2>
                                <p className="text-gray-700 leading-relaxed mb-4">
                                    {t('cookiePolicy.yourChoices.description')}
                                </p>
                            </section>

                            <section className="mb-8">
                                <h2 className="text-2xl font-semibold mb-4 text-gray-900">
                                    {t('cookiePolicy.contact.title')}
                                </h2>
                                <p className="text-gray-700 leading-relaxed">
                                    {t('cookiePolicy.contact.description')}
                                </p>
                                <p className="text-indigo-600 font-medium mt-2">
                                    hello@rampa.cash
                                </p>
                            </section>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export const getStaticProps: GetStaticProps = async ({ locale }) => {
    return {
        props: {
            ...(await serverSideTranslations(locale ?? 'en', ['common'])),
        },
    };
};

export default CookiePolicy;
