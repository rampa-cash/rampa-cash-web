import { useRouter } from 'next/router'
import { useState } from 'react'

const LanguageSwitcher = (): JSX.Element => {
    const router = useRouter()
    const [isOpen, setIsOpen] = useState(false)

    const languages = [
        { code: 'en', name: 'English', flag: '🇺🇸' },
        { code: 'es', name: 'Español', flag: '🇪🇸' }
    ]

    const currentLanguage = languages.find(lang => lang.code === router.locale) ?? languages[0]

    const handleLanguageChange = (locale: string): void => {
        router.push(router.asPath, router.asPath, { locale })
        setIsOpen(false)
    }

    return (
        <div className="relative inline-block text-left">
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="inline-flex items-center justify-center space-x-2 px-4 py-2 bg-white/10 dark:bg-gray-800/90 backdrop-blur-md border border-white/20 dark:border-gray-700/50 rounded-full hover:bg-white/20 dark:hover:bg-gray-700/90 transition-all duration-300 hover:scale-105"
            >
                <span className="text-lg">{currentLanguage.flag}</span>
                <span className="text-sm font-medium text-white dark:text-gray-200">{currentLanguage.code.toUpperCase()}</span>
                <svg
                    className={`w-4 h-4 text-white dark:text-gray-200 transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`}
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
            </button>

            {isOpen && (
                <>
                    <div
                        className="fixed inset-0 z-10"
                        onClick={() => setIsOpen(false)}
                    />
                    <div className="absolute right-0 z-20 mt-2 w-48 origin-top-right rounded-2xl bg-white/95 dark:bg-gray-800/95 backdrop-blur-md shadow-2xl border border-white/30 dark:border-gray-700/50">
                        <div className="py-2">
                            {languages.map((language) => (
                                <button
                                    key={language.code}
                                    onClick={() => handleLanguageChange(language.code)}
                                    className={`flex items-center space-x-3 w-full px-4 py-3 text-left hover:bg-gradient-to-r hover:from-indigo-50 hover:to-purple-50 dark:hover:from-indigo-900/50 dark:hover:to-purple-900/50 transition-all duration-200 group ${router.locale === language.code ? 'bg-gradient-to-r from-indigo-50 to-purple-50 dark:from-indigo-900/50 dark:to-purple-900/50' : ''
                                        }`}
                                >
                                    <span className="text-xl group-hover:scale-110 transition-transform duration-200">
                                        {language.flag}
                                    </span>
                                    <span className={`text-sm font-medium ${router.locale === language.code ? 'text-indigo-700 dark:text-indigo-300' : 'text-gray-700 dark:text-gray-300'
                                        } group-hover:text-indigo-700 dark:group-hover:text-indigo-300 transition-colors duration-200`}>
                                        {language.name}
                                    </span>
                                    {router.locale === language.code && (
                                        <svg className="w-4 h-4 text-indigo-600 dark:text-indigo-400 ml-auto" fill="currentColor" viewBox="0 0 20 20">
                                            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                        </svg>
                                    )}
                                </button>
                            ))}
                        </div>
                    </div>
                </>
            )}
        </div>
    )
}

export default LanguageSwitcher
