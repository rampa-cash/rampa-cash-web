import { useState } from 'react'
import { useTranslation } from 'next-i18next'
import { useRouter } from 'next/router'
import Link from 'next/link'
import LanguageSwitcher from '@/components/LanguageSwitcher'

interface SignupFormData {
    firstName: string
    lastName: string
    email: string
    password: string
    confirmPassword: string
    acceptTerms: boolean
}

export const SignupPage = (): JSX.Element => {
    const { t } = useTranslation('common')
    const router = useRouter()
    const [isLoading, setIsLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)
    const [formData, setFormData] = useState<SignupFormData>({
        firstName: '',
        lastName: '',
        email: '',
        password: '',
        confirmPassword: '',
        acceptTerms: false
    })
    const [errors, setErrors] = useState<{ [key: string]: string }>({})
    const [showEmailVerification, setShowEmailVerification] = useState(false)

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value, type, checked } = e.target
        setFormData(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value
        }))
        // Clear error when user starts typing
        if (errors[name]) {
            setErrors(prev => ({
                ...prev,
                [name]: ''
            }))
        }
    }

    const validateForm = () => {
        const newErrors: { [key: string]: string } = {}
        
        if (!formData.firstName) {
            newErrors.firstName = t('signup.form.validation.firstNameRequired')
        }
        
        if (!formData.lastName) {
            newErrors.lastName = t('signup.form.validation.lastNameRequired')
        }
        
        if (!formData.email) {
            newErrors.email = t('signup.form.validation.emailRequired')
        } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
            newErrors.email = t('signup.form.validation.emailInvalid')
        }
        
        if (!formData.password) {
            newErrors.password = t('signup.form.validation.passwordRequired')
        } else if (formData.password.length < 8) {
            newErrors.password = t('signup.form.validation.passwordMinLength')
        }
        
        if (!formData.confirmPassword) {
            newErrors.confirmPassword = t('signup.form.validation.confirmPasswordRequired')
        } else if (formData.password !== formData.confirmPassword) {
            newErrors.confirmPassword = t('signup.form.validation.passwordsDoNotMatch')
        }
        
        if (!formData.acceptTerms) {
            newErrors.acceptTerms = t('signup.form.validation.acceptTermsRequired')
        }
        
        setErrors(newErrors)
        return Object.keys(newErrors).length === 0
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        
        if (!validateForm()) {
            return
        }
        
        setIsLoading(true)
        setError(null)
        
        try {
            // TODO: Implement actual signup logic here
            console.log('Signup attempt:', formData)
            
            // Simulate API call
            await new Promise(resolve => setTimeout(resolve, 1000))
            
            // Show email verification screen
            setShowEmailVerification(true)
        } catch (error) {
            console.error('Signup error:', error)
            setError(t('signup.form.error.general'))
        } finally {
            setIsLoading(false)
        }
    }

    const handleWeb3AuthSignup = async () => {
        setIsLoading(true)
        setError(null)
        
        try {
            // TODO: Implement Web3Auth signup logic here
            console.log('Web3Auth signup attempt')
            
            // Simulate Web3Auth call
            await new Promise(resolve => setTimeout(resolve, 1000))
            
            // For now, just redirect to dashboard (replace with actual Web3Auth logic)
            router.push('/dashboard')
        } catch (error) {
            console.error('Web3Auth signup error:', error)
            setError(t('signup.form.error.walletConnection'))
        } finally {
            setIsLoading(false)
        }
    }

    const handleVerifyEmail = async () => {
        setIsLoading(true)
        setError(null)
        
        try {
            // TODO: Implement email verification logic here
            console.log('Email verification attempt')
            
            // Simulate API call
            await new Promise(resolve => setTimeout(resolve, 1000))
            
            // Redirect to dashboard after successful verification
            router.push('/dashboard')
        } catch (error) {
            console.error('Email verification error:', error)
            setError(t('signup.verification.error.general'))
        } finally {
            setIsLoading(false)
        }
    }

    const handleResendVerification = async () => {
        setIsLoading(true)
        setError(null)
        
        try {
            // TODO: Implement resend verification logic here
            console.log('Resend verification attempt')
            
            // Simulate API call
            await new Promise(resolve => setTimeout(resolve, 1000))
            
            // Show success message
            setError(t('signup.verification.resendSuccess'))
        } catch (error) {
            console.error('Resend verification error:', error)
            setError(t('signup.verification.resendError'))
        } finally {
            setIsLoading(false)
        }
    }

    if (showEmailVerification) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 flex items-center justify-center py-4 px-4 sm:px-6 lg:px-8">
                <div className="max-w-md w-full space-y-8">
                    {/* Language Switcher */}
                    <div className="flex justify-end">
                        <LanguageSwitcher />
                    </div>
                    
                    <div className="bg-white/90 backdrop-blur-md py-8 px-6 shadow-2xl rounded-3xl border border-white/60 text-center">
                        <div className="mb-6">
                            <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-indigo-100">
                                <svg className="h-6 w-6 text-indigo-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                                </svg>
                            </div>
                        </div>
                        
                        <h2 className="text-2xl font-bold text-gray-900 mb-4">
                            {t('signup.verification.title')}
                        </h2>
                        
                        <p className="text-gray-600 mb-6">
                            {t('signup.verification.message', { email: formData.email })}
                        </p>
                        
                        <div className="space-y-4">
                            <button
                                onClick={handleVerifyEmail}
                                disabled={isLoading}
                                className="w-full flex justify-center py-3 px-4 border border-transparent rounded-xl shadow-lg text-sm font-medium text-white bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 hover:from-indigo-700 hover:via-purple-700 hover:to-pink-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
                            >
                                {isLoading ? (
                                    <div className="flex items-center">
                                        <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                        </svg>
                                        {t('signup.verification.verifying')}
                                    </div>
                                ) : (
                                    t('signup.verification.verifyButton')
                                )}
                            </button>
                            
                            <button
                                onClick={handleResendVerification}
                                disabled={isLoading}
                                className="w-full flex justify-center py-3 px-4 border border-gray-300 rounded-xl shadow-lg text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
                            >
                                {t('signup.verification.resendButton')}
                            </button>
                        </div>
                        
                        {/* Error Display */}
                        {error && (
                            <div className="mt-4 bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-xl text-sm">
                                {error}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        )
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 flex items-center justify-center py-4 px-4 sm:px-6 lg:px-8">
            <div className="max-w-md w-full space-y-8">
                {/* Language Switcher */}
                <div className="flex justify-end">
                    <LanguageSwitcher />
                </div>
                
                <div className="text-center">
                    <h2 className="text-3xl font-bold text-gray-900 mb-2">
                        {t('signup.title')}
                    </h2>
                    <p className="text-gray-600">
                        {t('signup.subtitle')}
                    </p>
                </div>
                
                <div className="bg-white/90 backdrop-blur-md py-8 px-6 shadow-2xl rounded-3xl border border-white/60">
                    <form className="space-y-6" onSubmit={handleSubmit}>
                        {/* General Error */}
                        {error && (
                            <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-xl text-sm">
                                {error}
                            </div>
                        )}

                        {/* Name Fields */}
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label htmlFor="firstName" className="block text-sm font-medium text-gray-700 mb-2">
                                    {t('signup.form.firstName.label')}
                                </label>
                                <input
                                    id="firstName"
                                    name="firstName"
                                    type="text"
                                    autoComplete="given-name"
                                    value={formData.firstName}
                                    onChange={handleInputChange}
                                    className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all duration-200 ${
                                        errors.firstName 
                                            ? 'border-red-300 bg-red-50' 
                                            : 'border-gray-300 hover:border-gray-400'
                                    }`}
                                    placeholder={t('signup.form.firstName.placeholder')}
                                />
                                {errors.firstName && (
                                    <p className="mt-2 text-sm text-red-600">{errors.firstName}</p>
                                )}
                            </div>
                            
                            <div>
                                <label htmlFor="lastName" className="block text-sm font-medium text-gray-700 mb-2">
                                    {t('signup.form.lastName.label')}
                                </label>
                                <input
                                    id="lastName"
                                    name="lastName"
                                    type="text"
                                    autoComplete="family-name"
                                    value={formData.lastName}
                                    onChange={handleInputChange}
                                    className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all duration-200 ${
                                        errors.lastName 
                                            ? 'border-red-300 bg-red-50' 
                                            : 'border-gray-300 hover:border-gray-400'
                                    }`}
                                    placeholder={t('signup.form.lastName.placeholder')}
                                />
                                {errors.lastName && (
                                    <p className="mt-2 text-sm text-red-600">{errors.lastName}</p>
                                )}
                            </div>
                        </div>

                        {/* Email Field */}
                        <div>
                            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                                {t('signup.form.email.label')}
                            </label>
                            <input
                                id="email"
                                name="email"
                                type="email"
                                autoComplete="email"
                                value={formData.email}
                                onChange={handleInputChange}
                                className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all duration-200 ${
                                    errors.email 
                                        ? 'border-red-300 bg-red-50' 
                                        : 'border-gray-300 hover:border-gray-400'
                                }`}
                                placeholder={t('signup.form.email.placeholder')}
                            />
                            {errors.email && (
                                <p className="mt-2 text-sm text-red-600">{errors.email}</p>
                            )}
                        </div>

                        {/* Password Fields */}
                        <div>
                            <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
                                {t('signup.form.password.label')}
                            </label>
                            <input
                                id="password"
                                name="password"
                                type="password"
                                autoComplete="new-password"
                                value={formData.password}
                                onChange={handleInputChange}
                                className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all duration-200 ${
                                    errors.password 
                                        ? 'border-red-300 bg-red-50' 
                                        : 'border-gray-300 hover:border-gray-400'
                                }`}
                                placeholder={t('signup.form.password.placeholder')}
                            />
                            {errors.password && (
                                <p className="mt-2 text-sm text-red-600">{errors.password}</p>
                            )}
                        </div>

                        <div>
                            <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-2">
                                {t('signup.form.confirmPassword.label')}
                            </label>
                            <input
                                id="confirmPassword"
                                name="confirmPassword"
                                type="password"
                                autoComplete="new-password"
                                value={formData.confirmPassword}
                                onChange={handleInputChange}
                                className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all duration-200 ${
                                    errors.confirmPassword 
                                        ? 'border-red-300 bg-red-50' 
                                        : 'border-gray-300 hover:border-gray-400'
                                }`}
                                placeholder={t('signup.form.confirmPassword.placeholder')}
                            />
                            {errors.confirmPassword && (
                                <p className="mt-2 text-sm text-red-600">{errors.confirmPassword}</p>
                            )}
                        </div>

                        {/* Terms and Conditions */}
                        <div className="flex items-start">
                            <div className="flex items-center h-5">
                                <input
                                    id="acceptTerms"
                                    name="acceptTerms"
                                    type="checkbox"
                                    checked={formData.acceptTerms}
                                    onChange={handleInputChange}
                                    className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                                />
                            </div>
                            <div className="ml-3 text-sm">
                                <label htmlFor="acceptTerms" className="text-gray-700">
                                    {t('signup.form.acceptTerms.text')}{' '}
                                    <Link href="/terms-of-service" className="text-indigo-600 hover:text-indigo-500">
                                        {t('signup.form.acceptTerms.terms')}
                                    </Link>
                                    {' '}{t('signup.form.acceptTerms.and')}{' '}
                                    <Link href="/privacy-policy" className="text-indigo-600 hover:text-indigo-500">
                                        {t('signup.form.acceptTerms.privacy')}
                                    </Link>
                                </label>
                                {errors.acceptTerms && (
                                    <p className="mt-1 text-sm text-red-600">{errors.acceptTerms}</p>
                                )}
                            </div>
                        </div>

                        {/* Submit Button */}
                        <button
                            type="submit"
                            disabled={isLoading}
                            className="w-full flex justify-center py-3 px-4 border border-transparent rounded-xl shadow-lg text-sm font-medium text-white bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 hover:from-indigo-700 hover:via-purple-700 hover:to-pink-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 hover:scale-105 hover:shadow-xl"
                        >
                            {isLoading ? (
                                <div className="flex items-center">
                                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                    </svg>
                                    {t('signup.form.creating')}
                                </div>
                            ) : (
                                t('signup.form.submit')
                            )}
                        </button>
                    </form>

                    {/* Web3Auth Signup */}
                    <div className="mt-6">
                        <div className="text-center">
                            <div className="text-sm text-gray-600 mb-4">
                                {t('signup.or')}
                            </div>
                            <button
                                onClick={handleWeb3AuthSignup}
                                disabled={isLoading}
                                className="w-full flex justify-center items-center py-3 px-4 border border-gray-300 rounded-xl shadow-lg text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
                            >
                                {isLoading ? (
                                    <div className="flex items-center">
                                        <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-gray-700" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                        </svg>
                                        {t('signup.connectingWallet')}
                                    </div>
                                ) : (
                                    <>
                                        <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                                            <path fillRule="evenodd" d="M17.778 8.222c-4.296-4.296-11.26-4.296-15.556 0A1 1 0 01.808 6.808c5.076-5.076 13.308-5.076 18.384 0a1 1 0 01-1.414 1.414zM14.95 11.05c-3.124-3.124-8.186-3.124-11.31 0a1 1 0 01-1.414-1.414c3.89-3.89 10.24-3.89 14.13 0a1 1 0 01-1.414 1.414zM12.12 13.88c-1.171-1.171-3.073-1.171-4.244 0a1 1 0 01-1.415-1.415c2.051-2.051 5.378-2.051 7.429 0a1 1 0 01-1.415 1.415zM9 16a1 1 0 112 0 1 1 0 01-2 0z" clipRule="evenodd" />
                                        </svg>
                                        {t('signup.connectWallet')}
                                    </>
                                )}
                            </button>
                        </div>
                    </div>

                    {/* Login Link */}
                    <div className="mt-6 text-center">
                        <p className="text-sm text-gray-600">
                            {t('signup.login.prompt')}{' '}
                            <Link href="/login" className="font-medium text-indigo-600 hover:text-indigo-500 transition-colors duration-200">
                                {t('signup.login.link')}
                            </Link>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    )
}
