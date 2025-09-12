import { useState } from 'react'
import { useTranslation } from 'next-i18next'
import Link from 'next/link'

interface LoginFormProps {
    onSubmit: (formData: { email: string; password: string }) => Promise<void>
    isLoading?: boolean
}

export const LoginForm = ({ onSubmit, isLoading = false }: LoginFormProps): JSX.Element => {
    const { t } = useTranslation('common')
    const [formData, setFormData] = useState({
        email: '',
        password: ''
    })
    const [errors, setErrors] = useState<{ [key: string]: string }>({})

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target
        setFormData(prev => ({
            ...prev,
            [name]: value
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
        
        if (!formData.email) {
            newErrors.email = t('login.form.validation.emailRequired')
        } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
            newErrors.email = t('login.form.validation.emailInvalid')
        }
        
        if (!formData.password) {
            newErrors.password = t('login.form.validation.passwordRequired')
        } else if (formData.password.length < 6) {
            newErrors.password = t('login.form.validation.passwordMinLength')
        }
        
        setErrors(newErrors)
        return Object.keys(newErrors).length === 0
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        
        if (!validateForm()) {
            return
        }
        
        try {
            await onSubmit(formData)
        } catch (error) {
            console.error('Login error:', error)
            setErrors({ general: t('login.form.error.general') })
        }
    }

    return (
        <div className="bg-white/90 backdrop-blur-md py-8 px-6 shadow-2xl rounded-3xl border border-white/60">
            <form className="space-y-6" onSubmit={handleSubmit}>
                {/* General Error */}
                {errors.general && (
                    <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-xl text-sm">
                        {errors.general}
                    </div>
                )}

                {/* Email Field */}
                <div>
                    <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                        {t('login.form.email.label')}
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
                        placeholder={t('login.form.email.placeholder')}
                    />
                    {errors.email && (
                        <p className="mt-2 text-sm text-red-600">{errors.email}</p>
                    )}
                </div>

                {/* Password Field */}
                <div>
                    <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
                        {t('login.form.password.label')}
                    </label>
                    <input
                        id="password"
                        name="password"
                        type="password"
                        autoComplete="current-password"
                        value={formData.password}
                        onChange={handleInputChange}
                        className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all duration-200 ${
                            errors.password 
                                ? 'border-red-300 bg-red-50' 
                                : 'border-gray-300 hover:border-gray-400'
                        }`}
                        placeholder={t('login.form.password.placeholder')}
                    />
                    {errors.password && (
                        <p className="mt-2 text-sm text-red-600">{errors.password}</p>
                    )}
                </div>

                {/* Remember Me & Forgot Password */}
                <div className="flex items-center justify-between">
                    <div className="flex items-center">
                        <input
                            id="remember-me"
                            name="remember-me"
                            type="checkbox"
                            className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                        />
                        <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-700">
                            {t('login.form.rememberMe')}
                        </label>
                    </div>
                    <div className="text-sm">
                        <Link href="/forgot-password" className="font-medium text-indigo-600 hover:text-indigo-500 transition-colors duration-200">
                            {t('login.form.forgotPassword')}
                        </Link>
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
                            {t('login.form.submitting')}
                        </div>
                    ) : (
                        t('login.form.submit')
                    )}
                </button>
            </form>

            {/* Sign Up Link */}
            <div className="mt-6 text-center">
                <p className="text-sm text-gray-600">
                    {t('login.signup.prompt')}{' '}
                    <Link href="/signup" className="font-medium text-indigo-600 hover:text-indigo-500 transition-colors duration-200">
                        {t('login.signup.link')}
                    </Link>
                </p>
            </div>
        </div>
    )
}
