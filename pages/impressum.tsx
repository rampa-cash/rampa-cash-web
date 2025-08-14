import Head from 'next/head'
import type { NextPage, GetStaticProps } from 'next'
import { useTranslation } from 'next-i18next'
import { serverSideTranslations } from 'next-i18next/serverSideTranslations'

const Impressum: NextPage = () => {
	const { t } = useTranslation('common')
	return (
		<>
			<Head>
				<title>{t('impressum.title')} - RAMPA</title>
				<meta name="description" content={t('impressum.metaDescription')} />
			</Head>
			<div className="min-h-screen bg-gray-50 py-16">
				<div className="container mx-auto px-4 md:px-8">
					<div className="max-w-4xl mx-auto">
						<h1 className="text-3xl md:text-4xl font-bold text-center mb-8">{t('impressum.title')}</h1>
						<div className="bg-white rounded-lg shadow-sm p-6 md:p-8 space-y-8">
						{/* Company Information */}
						<section>
							<h2 className="text-xl font-bold mb-4 text-gray-800">{t('impressum.sections.companyInfo.title')}</h2>
							<div className="space-y-2 text-gray-700">
							<p><strong>{t('impressum.sections.companyInfo.name')}</strong></p>
							<p>{t('impressum.sections.companyInfo.address')}</p>
							<p>{t('impressum.sections.companyInfo.city')}</p>
							<p>{t('impressum.sections.companyInfo.country')}</p>
							</div>
						</section>
						{/* Contact Information */}
						<section>
							<h2 className="text-xl font-bold mb-4 text-gray-800">{t('impressum.sections.contact.title')}</h2>
							<div className="space-y-2 text-gray-700">
							<p><strong>{t('impressum.sections.contact.phone')}</strong> +49 176 71763207</p>
							<p><strong>{t('impressum.sections.contact.email')}</strong> team@rampa.cash</p>
							<p><strong>{t('impressum.sections.contact.website')}</strong> www.rampa.cash</p>
							</div>
						</section>
						{/* Editorial Responsibility */}
						<section>
							<h2 className="text-xl font-bold mb-4 text-gray-800">{t('impressum.sections.editoriallyResponsible.title')}</h2>
							<div className="space-y-2 text-gray-700">
							<p><strong>{t('impressum.sections.editoriallyResponsible.name')}</strong></p>
							<p>{t('impressum.sections.editoriallyResponsible.address')}</p>
							<p>{t('impressum.sections.editoriallyResponsible.city')}</p>
							</div>
						</section>
						{/* EU Dispute Resolution */}
						<section>
							<h2 className="text-xl font-bold mb-4 text-gray-800">{t('impressum.sections.euDispute.title')}</h2>
							<div className="space-y-2 text-gray-700">
							<p>{t('impressum.sections.euDispute.text')} 
							<a href={t('impressum.sections.euDispute.link')} className="text-indigo-600 hover:text-indigo-800 underline ml-1">
								{t('impressum.sections.euDispute.link')}
							</a></p>
							<p>{t('impressum.sections.euDispute.emailNote')}</p>
							</div>
						</section>
						{/* Consumer Dispute Resolution */}
						<section>
							<h2 className="text-xl font-bold mb-4 text-gray-800">{t('impressum.sections.consumerDispute.title')}</h2>
							<div className="space-y-2 text-gray-700">
							<p>{t('impressum.sections.consumerDispute.text')}</p>
							</div>
						</section>
						{/* Liability for Content */}
						<section>
							<h2 className="text-xl font-bold mb-4 text-gray-800">{t('impressum.sections.contentLiability.title')}</h2>
							<div className="space-y-2 text-gray-700">
							<p>{t('impressum.sections.contentLiability.paragraph1')}</p>
							<p>{t('impressum.sections.contentLiability.paragraph2')}</p>
							</div>
						</section>
						{/* Liability for Links */}
						<section>
							<h2 className="text-xl font-bold mb-4 text-gray-800">{t('impressum.sections.linkLiability.title')}</h2>
							<div className="space-y-2 text-gray-700">
							<p>{t('impressum.sections.linkLiability.paragraph1')}</p>
							<p>{t('impressum.sections.linkLiability.paragraph2')}</p>
							</div>
						</section>
						{/* Copyright */}
						<section>
							<h2 className="text-xl font-bold mb-4 text-gray-800">{t('impressum.sections.copyright.title')}</h2>
							<div className="space-y-2 text-gray-700">
							<p>{t('impressum.sections.copyright.paragraph1')}</p>
							<p>{t('impressum.sections.copyright.paragraph2')}</p>
							</div>
						</section>
						</div>
					</div>
				</div>
			</div>
		</>
	)
}

export const getStaticProps: GetStaticProps = async ({ locale }) => {
	return {
		props: {
			...(await serverSideTranslations(locale ?? 'en', ['common'])),
		},
	}
}

export default Impressum
