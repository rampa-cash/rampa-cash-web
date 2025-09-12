import { useState } from 'react'
import { useTranslation } from 'next-i18next'
import Link from 'next/link'
import { LoginHeader } from './LoginHeader'
import { LoginForm } from './LoginForm'

export const LoginPage = (): JSX.Element => {
    const { t } = useTranslation('common')
    const [isLoading, setIsLoading] = useState(false)

    const handleLogin = async (formData: { email: string; password: string }) => {
        setIsLoading(true)
        
        try {
            // TODO: Implement actual login logic here
            console.log('Login attempt:', formData)
            
            // Simulate API call
            await new Promise(resolve => setTimeout(resolve, 1000))
            
            // For now, just show success (replace with actual redirect)
            alert(t('login.form.success'))
        } catch (error) {
            console.error('Login error:', error)
            throw error // Re-throw to let LoginForm handle the error display
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 flex items-center justify-center py-4 px-4 sm:px-6 lg:px-8">
            <div className="max-w-md w-full space-y-8">
                <LoginHeader />
                <LoginForm onSubmit={handleLogin} isLoading={isLoading} />
                
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
