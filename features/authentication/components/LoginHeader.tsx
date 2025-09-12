import { useTranslation } from 'next-i18next'

export const LoginHeader = (): JSX.Element => {
    const { t } = useTranslation('common')

    return (
        <div className="text-center">
            <div className="mx-auto h-16 w-16 bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 rounded-2xl flex items-center justify-center mb-6 shadow-xl">
                <svg className="h-8 w-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
            </div>
            <h2 className="text-3xl font-extrabold text-gray-900 mb-2">
                {t('login.title')}
            </h2>
            <p className="text-gray-600">
                {t('login.subtitle')}
            </p>
        </div>
    )
}
