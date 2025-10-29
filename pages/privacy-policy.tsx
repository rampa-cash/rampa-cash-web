import Head from 'next/head';
import type { NextPage, GetStaticProps } from 'next';
import { useTranslation } from 'next-i18next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';

const PrivacyPolicy: NextPage = () => {
    const { t } = useTranslation('common');

    return (
        <>
            <Head>
                <title>{t('privacyPolicy.title')} - RAMPA</title>
                <meta
                    name="description"
                    content={t('privacyPolicy.metaDescription')}
                />
            </Head>
            <div className="min-h-screen bg-gray-50 py-16">
                <div className="container mx-auto px-4 md:px-8">
                    <div className="max-w-4xl mx-auto">
                        <h1 className="text-3xl md:text-4xl font-bold text-center mb-8">
                            {t('privacyPolicy.title')}
                        </h1>
                        <div className="bg-white rounded-lg shadow-sm p-6 md:p-8 space-y-8">
                            <div className="border-b pb-6 space-y-2 text-sm text-gray-600">
                                <p>
                                    <strong>
                                        {t('privacyPolicy.version')}
                                    </strong>{' '}
                                    1.0
                                </p>
                                <p>
                                    <strong>
                                        {t('privacyPolicy.effectiveDate')}
                                    </strong>{' '}
                                    {t('privacyPolicy.date')}
                                </p>
                                <p>
                                    <strong>
                                        {t('privacyPolicy.controller')}
                                    </strong>{' '}
                                    Lafitech UG (Rampa)
                                </p>
                                <p>
                                    <strong>
                                        {t('privacyPolicy.contact')}
                                    </strong>{' '}
                                    hello@rampa.cash
                                </p>
                                <p>
                                    <strong>
                                        {t('privacyPolicy.registeredAddress')}
                                    </strong>{' '}
                                    Arnulfstr. 171, 80634 Munich, Germany
                                </p>
                                <p>
                                    <strong>
                                        {t(
                                            'privacyPolicy.supervisoryAuthority'
                                        )}
                                    </strong>{' '}
                                    {t(
                                        'privacyPolicy.supervisoryAuthorityText'
                                    )}
                                </p>
                            </div>

                            {/* Section 1 - Scope */}
                            <section>
                                <h2 className="text-xl font-bold mb-4 text-gray-800">
                                    1) {t('privacyPolicy.sections.scope.title')}
                                </h2>
                                <p className="text-gray-700">
                                    {t('privacyPolicy.sections.scope.content')}
                                </p>
                            </section>

                            {/* Section 2 - What data we process */}
                            <section>
                                <h2 className="text-xl font-bold mb-4 text-gray-800">
                                    2){' '}
                                    {t(
                                        'privacyPolicy.sections.dataProcessing.title'
                                    )}
                                </h2>
                                <p className="text-gray-700 mb-4">
                                    {t(
                                        'privacyPolicy.sections.dataProcessing.intro'
                                    )}
                                </p>
                                <div className="space-y-3 text-gray-700">
                                    <p>
                                        <strong>
                                            {t(
                                                'privacyPolicy.sections.dataProcessing.telemetryTitle'
                                            )}
                                        </strong>{' '}
                                        {t(
                                            'privacyPolicy.sections.dataProcessing.telemetryContent'
                                        )}
                                    </p>
                                    <p>
                                        <strong>
                                            {t(
                                                'privacyPolicy.sections.dataProcessing.walletTitle'
                                            )}
                                        </strong>{' '}
                                        {t(
                                            'privacyPolicy.sections.dataProcessing.walletContent'
                                        )}
                                    </p>
                                    <p>
                                        <strong>
                                            {t(
                                                'privacyPolicy.sections.dataProcessing.supportTitle'
                                            )}
                                        </strong>{' '}
                                        {t(
                                            'privacyPolicy.sections.dataProcessing.supportContent'
                                        )}
                                    </p>
                                    <p>
                                        <strong>
                                            {t(
                                                'privacyPolicy.sections.dataProcessing.analyticsTitle'
                                            )}
                                        </strong>{' '}
                                        {t(
                                            'privacyPolicy.sections.dataProcessing.analyticsContent'
                                        )}
                                    </p>
                                </div>
                                <p className="text-gray-700 mt-4 font-medium">
                                    {t(
                                        'privacyPolicy.sections.dataProcessing.disclaimer'
                                    )}
                                </p>
                            </section>

                            {/* Section 3 - Why we process data */}
                            <section>
                                <h2 className="text-xl font-bold mb-4 text-gray-800">
                                    3){' '}
                                    {t(
                                        'privacyPolicy.sections.processingBasis.title'
                                    )}
                                </h2>
                                <div className="space-y-3 text-gray-700">
                                    <p>
                                        <strong>
                                            {t(
                                                'privacyPolicy.sections.processingBasis.provideTitle'
                                            )}
                                        </strong>{' '}
                                        {t(
                                            'privacyPolicy.sections.processingBasis.provideContent'
                                        )}
                                    </p>
                                    <p>
                                        <strong>
                                            {t(
                                                'privacyPolicy.sections.processingBasis.complianceTitle'
                                            )}
                                        </strong>{' '}
                                        {t(
                                            'privacyPolicy.sections.processingBasis.complianceContent'
                                        )}
                                    </p>
                                    <p>
                                        <strong>
                                            {t(
                                                'privacyPolicy.sections.processingBasis.analyticsTitle'
                                            )}
                                        </strong>{' '}
                                        {t(
                                            'privacyPolicy.sections.processingBasis.analyticsContent'
                                        )}
                                    </p>
                                    <p>
                                        <strong>
                                            {t(
                                                'privacyPolicy.sections.processingBasis.communicationsTitle'
                                            )}
                                        </strong>{' '}
                                        {t(
                                            'privacyPolicy.sections.processingBasis.communicationsContent'
                                        )}
                                    </p>
                                </div>
                                <p className="text-gray-700 mt-4">
                                    {t(
                                        'privacyPolicy.sections.processingBasis.consentNote'
                                    )}
                                </p>
                            </section>

                            {/* Section 4 - Who receives data */}
                            <section>
                                <h2 className="text-xl font-bold mb-4 text-gray-800">
                                    4){' '}
                                    {t(
                                        'privacyPolicy.sections.dataRecipients.title'
                                    )}
                                </h2>
                                <div className="space-y-4 text-gray-700">
                                    <div>
                                        <p>
                                            <strong>
                                                {t(
                                                    'privacyPolicy.sections.dataRecipients.processorsTitle'
                                                )}
                                            </strong>{' '}
                                            {t(
                                                'privacyPolicy.sections.dataRecipients.processorsContent'
                                            )}
                                        </p>
                                    </div>
                                    <div>
                                        <p>
                                            <strong>
                                                {t(
                                                    'privacyPolicy.sections.dataRecipients.controllersTitle'
                                                )}
                                            </strong>
                                        </p>
                                        <ul className="list-disc pl-6 mt-2 space-y-1">
                                            <li>
                                                {t(
                                                    'privacyPolicy.sections.dataRecipients.transak'
                                                )}
                                            </li>
                                            <li>
                                                {t(
                                                    'privacyPolicy.sections.dataRecipients.issuer'
                                                )}
                                            </li>
                                            <li>
                                                {t(
                                                    'privacyPolicy.sections.dataRecipients.jupiter'
                                                )}
                                            </li>
                                            <li>
                                                {t(
                                                    'privacyPolicy.sections.dataRecipients.analytics'
                                                )}
                                            </li>
                                            <li>
                                                {t(
                                                    'privacyPolicy.sections.dataRecipients.lawEnforcement'
                                                )}
                                            </li>
                                        </ul>
                                    </div>
                                </div>
                            </section>

                            {/* Section 5 - International transfers */}
                            <section>
                                <h2 className="text-xl font-bold mb-4 text-gray-800">
                                    5){' '}
                                    {t(
                                        'privacyPolicy.sections.internationalTransfers.title'
                                    )}
                                </h2>
                                <p className="text-gray-700">
                                    {t(
                                        'privacyPolicy.sections.internationalTransfers.content'
                                    )}
                                </p>
                            </section>

                            {/* Section 6 - Retention */}
                            <section>
                                <h2 className="text-xl font-bold mb-4 text-gray-800">
                                    6){' '}
                                    {t(
                                        'privacyPolicy.sections.retention.title'
                                    )}
                                </h2>
                                <div className="space-y-2 text-gray-700">
                                    <p>
                                        <strong>
                                            {t(
                                                'privacyPolicy.sections.retention.operationalTitle'
                                            )}
                                        </strong>{' '}
                                        {t(
                                            'privacyPolicy.sections.retention.operationalContent'
                                        )}
                                    </p>
                                    <p>
                                        <strong>
                                            {t(
                                                'privacyPolicy.sections.retention.riskTitle'
                                            )}
                                        </strong>{' '}
                                        {t(
                                            'privacyPolicy.sections.retention.riskContent'
                                        )}
                                    </p>
                                    <p>
                                        <strong>
                                            {t(
                                                'privacyPolicy.sections.retention.supportTitle'
                                            )}
                                        </strong>{' '}
                                        {t(
                                            'privacyPolicy.sections.retention.supportContent'
                                        )}
                                    </p>
                                </div>
                            </section>

                            {/* Section 7 - Your rights */}
                            <section>
                                <h2 className="text-xl font-bold mb-4 text-gray-800">
                                    7){' '}
                                    {t(
                                        'privacyPolicy.sections.userRights.title'
                                    )}
                                </h2>
                                <p className="text-gray-700 mb-3">
                                    {t(
                                        'privacyPolicy.sections.userRights.intro'
                                    )}
                                </p>
                                <p className="text-gray-700">
                                    {t(
                                        'privacyPolicy.sections.userRights.contactInfo'
                                    )}{' '}
                                    <a
                                        href="mailto:hello@rampa.cash"
                                        className="text-indigo-600 hover:text-indigo-800 underline ml-1"
                                    >
                                        hello@rampa.cash
                                    </a>
                                    .{' '}
                                    {t(
                                        'privacyPolicy.sections.userRights.complaint'
                                    )}
                                </p>
                            </section>

                            {/* Section 8 - Cookies & tracking */}
                            <section>
                                <h2 className="text-xl font-bold mb-4 text-gray-800">
                                    8){' '}
                                    {t('privacyPolicy.sections.cookies.title')}
                                </h2>
                                <p className="text-gray-700">
                                    {t(
                                        'privacyPolicy.sections.cookies.content'
                                    )}
                                </p>
                            </section>

                            {/* Section 9 - Security */}
                            <section>
                                <h2 className="text-xl font-bold mb-4 text-gray-800">
                                    9){' '}
                                    {t('privacyPolicy.sections.security.title')}
                                </h2>
                                <p className="text-gray-700">
                                    {t(
                                        'privacyPolicy.sections.security.content'
                                    )}
                                </p>
                            </section>

                            {/* Section 10 - Children */}
                            <section>
                                <h2 className="text-xl font-bold mb-4 text-gray-800">
                                    10){' '}
                                    {t('privacyPolicy.sections.children.title')}
                                </h2>
                                <p className="text-gray-700">
                                    {t(
                                        'privacyPolicy.sections.children.content'
                                    )}
                                </p>
                            </section>

                            {/* Section 11 - Changes */}
                            <section>
                                <h2 className="text-xl font-bold mb-4 text-gray-800">
                                    11){' '}
                                    {t('privacyPolicy.sections.changes.title')}
                                </h2>
                                <p className="text-gray-700">
                                    {t(
                                        'privacyPolicy.sections.changes.content'
                                    )}
                                </p>
                            </section>

                            {/* Section 12 - Contact */}
                            <section>
                                <h2 className="text-xl font-bold mb-4 text-gray-800">
                                    12){' '}
                                    {t(
                                        'privacyPolicy.sections.contactSection.title'
                                    )}
                                </h2>
                                <p className="text-gray-700">
                                    {t(
                                        'privacyPolicy.sections.contactSection.content'
                                    )}{' '}
                                    <a
                                        href="mailto:hello@rampa.cash"
                                        className="text-indigo-600 hover:text-indigo-800 underline ml-1"
                                    >
                                        hello@rampa.cash
                                    </a>
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

export default PrivacyPolicy;
