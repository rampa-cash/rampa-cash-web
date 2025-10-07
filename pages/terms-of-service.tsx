import Head from 'next/head';
import type { NextPage, GetStaticProps } from 'next';
import { useTranslation } from 'next-i18next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';

const TermsOfService: NextPage = () => {
    const { t } = useTranslation('common');

    return (
        <>
            <Head>
                <title>{t('termsOfService.title')} - RAMPA</title>
                <meta
                    name="description"
                    content={t('termsOfService.metaDescription')}
                />
            </Head>
            <div className="min-h-screen bg-gray-50 py-16">
                <div className="container mx-auto px-4 md:px-8">
                    <div className="max-w-4xl mx-auto">
                        <h1 className="text-3xl md:text-4xl font-bold text-center mb-8">
                            {t('termsOfService.title')}
                        </h1>
                        <div className="bg-white rounded-lg shadow-sm p-6 md:p-8 space-y-8">
                            <div className="border-b pb-6 space-y-2 text-sm text-gray-600">
                                <p>
                                    <strong>
                                        {t('termsOfService.version')}
                                    </strong>{' '}
                                    1.0
                                </p>
                                <p>
                                    <strong>
                                        {t('termsOfService.effectiveDate')}
                                    </strong>{' '}
                                    {t('termsOfService.date')}
                                </p>
                                <p>
                                    <strong>
                                        {t('termsOfService.company')}
                                    </strong>{' '}
                                    {t('termsOfService.companyInfo')}
                                </p>
                                <p>
                                    <strong>
                                        {t('termsOfService.contact')}
                                    </strong>{' '}
                                    team@rampa.cash
                                </p>
                                <p>
                                    <strong>
                                        {t('termsOfService.registeredAddress')}
                                    </strong>{' '}
                                    Arnulfstr. 171, 80634 Munich, Germany
                                </p>
                                <p>
                                    <strong>
                                        {t('termsOfService.handelsregister')}
                                    </strong>{' '}
                                    HRB 305485, Amtsgericht Munich
                                </p>
                            </div>

                            {/* Section 1 - What we are */}
                            <section>
                                <h2 className="text-xl font-bold mb-4 text-gray-800">
                                    1){' '}
                                    {t(
                                        'termsOfService.sections.whatWeAre.title'
                                    )}
                                </h2>
                                <p className="text-gray-700">
                                    {t(
                                        'termsOfService.sections.whatWeAre.content'
                                    )}
                                </p>
                            </section>

                            {/* Section 2 - Third-party services */}
                            <section>
                                <h2 className="text-xl font-bold mb-4 text-gray-800">
                                    2){' '}
                                    {t(
                                        'termsOfService.sections.thirdPartyServices.title'
                                    )}
                                </h2>
                                <p className="text-gray-700 mb-4">
                                    {t(
                                        'termsOfService.sections.thirdPartyServices.intro'
                                    )}
                                </p>
                                <div className="space-y-3 text-gray-700">
                                    <p>
                                        <strong>
                                            {t(
                                                'termsOfService.sections.thirdPartyServices.fiatTitle'
                                            )}
                                        </strong>{' '}
                                        {t(
                                            'termsOfService.sections.thirdPartyServices.fiatContent'
                                        )}
                                    </p>
                                    <p>
                                        <strong>
                                            {t(
                                                'termsOfService.sections.thirdPartyServices.cardTitle'
                                            )}
                                        </strong>{' '}
                                        {t(
                                            'termsOfService.sections.thirdPartyServices.cardContent'
                                        )}
                                    </p>
                                    <p>
                                        <strong>
                                            {t(
                                                'termsOfService.sections.thirdPartyServices.dexTitle'
                                            )}
                                        </strong>{' '}
                                        {t(
                                            'termsOfService.sections.thirdPartyServices.dexContent'
                                        )}
                                    </p>
                                    <p>
                                        <strong>
                                            {t(
                                                'termsOfService.sections.thirdPartyServices.mpcTitle'
                                            )}
                                        </strong>{' '}
                                        {t(
                                            'termsOfService.sections.thirdPartyServices.mpcContent'
                                        )}
                                    </p>
                                    <p>
                                        <strong>
                                            {t(
                                                'termsOfService.sections.thirdPartyServices.analyticsTitle'
                                            )}
                                        </strong>{' '}
                                        {t(
                                            'termsOfService.sections.thirdPartyServices.analyticsContent'
                                        )}
                                    </p>
                                </div>
                                <p className="text-gray-700 mt-4 font-medium">
                                    {t(
                                        'termsOfService.sections.thirdPartyServices.disclaimer'
                                    )}
                                </p>
                            </section>

                            {/* Section 3 - Eligibility & compliance */}
                            <section>
                                <h2 className="text-xl font-bold mb-4 text-gray-800">
                                    3){' '}
                                    {t(
                                        'termsOfService.sections.eligibility.title'
                                    )}
                                </h2>
                                <p className="text-gray-700 mb-4">
                                    {t(
                                        'termsOfService.sections.eligibility.intro'
                                    )}
                                </p>
                                <ul className="list-disc pl-6 space-y-2 text-gray-700">
                                    <li>
                                        {t(
                                            'termsOfService.sections.eligibility.age'
                                        )}
                                    </li>
                                    <li>
                                        {t(
                                            'termsOfService.sections.eligibility.sanctions'
                                        )}
                                    </li>
                                    <li>
                                        {t(
                                            'termsOfService.sections.eligibility.jurisdiction'
                                        )}
                                    </li>
                                </ul>
                            </section>

                            {/* Section 4 - Your responsibilities */}
                            <section>
                                <h2 className="text-xl font-bold mb-4 text-gray-800">
                                    4){' '}
                                    {t(
                                        'termsOfService.sections.responsibilities.title'
                                    )}
                                </h2>
                                <ul className="list-disc pl-6 space-y-2 text-gray-700">
                                    <li>
                                        {t(
                                            'termsOfService.sections.responsibilities.security'
                                        )}
                                    </li>
                                    <li>
                                        {t(
                                            'termsOfService.sections.responsibilities.transactions'
                                        )}
                                    </li>
                                    <li>
                                        {t(
                                            'termsOfService.sections.responsibilities.legal'
                                        )}
                                    </li>
                                </ul>
                            </section>

                            {/* Section 5 - Fees and pricing */}
                            <section>
                                <h2 className="text-xl font-bold mb-4 text-gray-800">
                                    5) {t('termsOfService.sections.fees.title')}
                                </h2>
                                <p className="text-gray-700 mb-4">
                                    {t('termsOfService.sections.fees.intro')}
                                </p>
                                <div className="space-y-3 text-gray-700">
                                    <p>
                                        <strong>
                                            {t(
                                                'termsOfService.sections.fees.transakTitle'
                                            )}
                                        </strong>{' '}
                                        {t(
                                            'termsOfService.sections.fees.transakContent'
                                        )}
                                    </p>
                                    <p>
                                        <strong>
                                            {t(
                                                'termsOfService.sections.fees.dexFeeTitle'
                                            )}
                                        </strong>{' '}
                                        {t(
                                            'termsOfService.sections.fees.dexFeeContent'
                                        )}
                                    </p>
                                    <p>
                                        <strong>
                                            {t(
                                                'termsOfService.sections.fees.serviceFeesTitle'
                                            )}
                                        </strong>{' '}
                                        {t(
                                            'termsOfService.sections.fees.serviceFeesContent'
                                        )}
                                    </p>
                                    <p>
                                        <strong>
                                            {t(
                                                'termsOfService.sections.fees.cardFeesTitle'
                                            )}
                                        </strong>{' '}
                                        {t(
                                            'termsOfService.sections.fees.cardFeesContent'
                                        )}
                                    </p>
                                </div>
                                <p className="text-gray-700 mt-4">
                                    {t(
                                        'termsOfService.sections.fees.additionalFees'
                                    )}
                                </p>
                            </section>

                            {/* Section 6 - No custody */}
                            <section>
                                <h2 className="text-xl font-bold mb-4 text-gray-800">
                                    6){' '}
                                    {t(
                                        'termsOfService.sections.noCustody.title'
                                    )}
                                </h2>
                                <p className="text-gray-700">
                                    {t(
                                        'termsOfService.sections.noCustody.content'
                                    )}
                                </p>
                            </section>

                            {/* Section 7 - Risk notice */}
                            <section>
                                <h2 className="text-xl font-bold mb-4 text-gray-800">
                                    7){' '}
                                    {t(
                                        'termsOfService.sections.riskNotice.title'
                                    )}
                                </h2>
                                <p className="text-gray-700">
                                    {t(
                                        'termsOfService.sections.riskNotice.content'
                                    )}
                                </p>
                            </section>

                            {/* Section 8 - Prohibited conduct */}
                            <section>
                                <h2 className="text-xl font-bold mb-4 text-gray-800">
                                    8){' '}
                                    {t(
                                        'termsOfService.sections.prohibitedConduct.title'
                                    )}
                                </h2>
                                <p className="text-gray-700 mb-4">
                                    {t(
                                        'termsOfService.sections.prohibitedConduct.intro'
                                    )}
                                </p>
                                <ul className="list-disc pl-6 space-y-2 text-gray-700">
                                    <li>
                                        {t(
                                            'termsOfService.sections.prohibitedConduct.violate'
                                        )}
                                    </li>
                                    <li>
                                        {t(
                                            'termsOfService.sections.prohibitedConduct.interfere'
                                        )}
                                    </li>
                                    <li>
                                        {t(
                                            'termsOfService.sections.prohibitedConduct.infringe'
                                        )}
                                    </li>
                                    <li>
                                        {t(
                                            'termsOfService.sections.prohibitedConduct.bypass'
                                        )}
                                    </li>
                                </ul>
                                <p className="text-gray-700 mt-4">
                                    {t(
                                        'termsOfService.sections.prohibitedConduct.consequence'
                                    )}
                                </p>
                            </section>

                            {/* Section 9 - Intellectual property */}
                            <section>
                                <h2 className="text-xl font-bold mb-4 text-gray-800">
                                    9){' '}
                                    {t(
                                        'termsOfService.sections.intellectualProperty.title'
                                    )}
                                </h2>
                                <p className="text-gray-700">
                                    {t(
                                        'termsOfService.sections.intellectualProperty.content'
                                    )}
                                </p>
                            </section>

                            {/* Section 10 - Liability */}
                            <section>
                                <h2 className="text-xl font-bold mb-4 text-gray-800">
                                    10){' '}
                                    {t(
                                        'termsOfService.sections.liability.title'
                                    )}
                                </h2>
                                <p className="text-gray-700">
                                    {t(
                                        'termsOfService.sections.liability.content'
                                    )}
                                </p>
                            </section>

                            {/* Section 11 - Changes */}
                            <section>
                                <h2 className="text-xl font-bold mb-4 text-gray-800">
                                    11){' '}
                                    {t('termsOfService.sections.changes.title')}
                                </h2>
                                <p className="text-gray-700">
                                    {t(
                                        'termsOfService.sections.changes.content'
                                    )}
                                </p>
                            </section>

                            {/* Section 12 - Governing law */}
                            <section>
                                <h2 className="text-xl font-bold mb-4 text-gray-800">
                                    12){' '}
                                    {t(
                                        'termsOfService.sections.governingLaw.title'
                                    )}
                                </h2>
                                <p className="text-gray-700">
                                    {t(
                                        'termsOfService.sections.governingLaw.content'
                                    )}
                                </p>
                            </section>

                            {/* Section 13 - Contact */}
                            <section>
                                <h2 className="text-xl font-bold mb-4 text-gray-800">
                                    13){' '}
                                    {t(
                                        'termsOfService.sections.contactSection.title'
                                    )}
                                </h2>
                                <p className="text-gray-700">
                                    {t(
                                        'termsOfService.sections.contactSection.content'
                                    )}
                                    <a
                                        href="mailto:team@rampa.cash"
                                        className="text-indigo-600 hover:text-indigo-800 underline ml-1"
                                    >
                                        team@rampa.cash
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

export default TermsOfService;
