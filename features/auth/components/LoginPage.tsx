import { useState } from 'react'
import { useTranslation } from 'next-i18next'
import { useRouter } from 'next/router'
import Link from 'next/link'
import { LoginHeader } from './LoginHeader'
import { LoginForm } from './LoginForm'
import LanguageSwitcher from '@/components/LanguageSwitcher'

export const LoginPage = (): JSX.Element => {
    const { t } = useTranslation('common')
    const router = useRouter()
    const [isLoading, setIsLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)

    const handleLogin = async (formData: { email: string; password: string }) => {
        setIsLoading(true)
        setError(null)
        
        try {
            // TODO: Implement actual login logic here
            console.log('Login attempt:', formData)
            
            // Simulate API call
            await new Promise(resolve => setTimeout(resolve, 1000))
            
            // For now, just redirect to dashboard (replace with actual auth logic)
            router.push('/dashboard')
        } catch (error) {
            console.error('Login error:', error)
            setError(t('login.form.error.general'))
            throw error // Re-throw to let LoginForm handle the error display
        } finally {
            setIsLoading(false)
        }
    }

    const handleWeb3AuthLogin = async () => {
        setIsLoading(true)
        setError(null)
        
        try {
            // TODO: Implement Web3Auth login logic here
            console.log('Web3Auth login attempt')
            
            // Simulate Web3Auth call
            await new Promise(resolve => setTimeout(resolve, 1000))
            
            // For now, just redirect to dashboard (replace with actual Web3Auth logic)
            router.push('/dashboard')
        } catch (error) {
            console.error('Web3Auth login error:', error)
            setError(t('login.form.error.walletConnection'))
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 flex items-center justify-center py-4 px-4 sm:px-6 lg:px-8">
            <div className="max-w-md w-full space-y-8">
                {/* Language Switcher */}
                <div className="flex justify-end">
                    <LanguageSwitcher />
                </div>
                
                <LoginHeader />
                <LoginForm onSubmit={handleLogin} isLoading={isLoading} />
                
                {/* Web3Auth Login */}
                <div className="bg-white/90 backdrop-blur-md py-6 px-6 shadow-2xl rounded-3xl border border-white/60">
                    <div className="text-center">
                        <div className="text-sm text-gray-600 mb-4">
                            {t('login.or')}
                        </div>
                        <button
                            onClick={handleWeb3AuthLogin}
                            disabled={isLoading}
                            className="w-full flex justify-center items-center py-3 px-4 border border-gray-300 rounded-xl shadow-lg text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
                        >
                            {isLoading ? (
                                <div className="flex items-center">
                                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-gray-700" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                    </svg>
                                    {t('login.connectingWallet')}
                                </div>
                            ) : (
                                <>
                                    <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                                        <path fillRule="evenodd" d="M17.778 8.222c-4.296-4.296-11.26-4.296-15.556 0A1 1 0 01.808 6.808c5.076-5.076 13.308-5.076 18.384 0a1 1 0 01-1.414 1.414zM14.95 11.05c-3.124-3.124-8.186-3.124-11.31 0a1 1 0 01-1.414-1.414c3.89-3.89 10.24-3.89 14.13 0a1 1 0 01-1.414 1.414zM12.12 13.88c-1.171-1.171-3.073-1.171-4.244 0a1 1 0 01-1.415-1.415c2.051-2.051 5.378-2.051 7.429 0a1 1 0 01-1.415 1.415zM9 16a1 1 0 112 0 1 1 0 01-2 0z" clipRule="evenodd" />
                                    </svg>
                                    {t('login.connectWallet')}
                                </>
                            )}
                        </button>
                    </div>
                </div>
                
                {/* Error Display */}
                {error && (
                    <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-xl text-sm text-center">
                        {error}
                    </div>
                )}
                
                {/* Back to Home */}
                <div className="text-center">
                    <Link href="/" className="text-sm text-gray-600 hover:text-indigo-600 transition-colors duration-200">
                        ← {t('login.backToHome')}
                    </Link>
                </div>
            </div>
        </div>
    )
}
