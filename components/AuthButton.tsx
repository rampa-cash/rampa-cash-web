import { useRouter } from 'next/router'
import { useTranslation } from 'next-i18next'
import { useWeb3AuthConnect, useWeb3AuthDisconnect, useWeb3AuthUser } from '@web3auth/modal/react'
import { FEATURE_FLAGS } from '@/lib/constants'

interface AuthButtonProps {
    variant?: 'desktop' | 'mobile'
    className?: string
}

export const AuthButton = ({ variant = 'desktop', className = '' }: AuthButtonProps): JSX.Element | null => {
    const { t } = useTranslation('common')
    const router = useRouter()
    
    // Web3Auth hooks (must be called unconditionally)
    const { connect, loading: isConnecting } = useWeb3AuthConnect()
    const { disconnect } = useWeb3AuthDisconnect()
    const { userInfo: web3AuthUser } = useWeb3AuthUser()
    
    // Don't render if login button is disabled
    if (!FEATURE_FLAGS.showLoginButton) {
        return null
    }
    
    // Web3Auth login/logout handler
    const handleWeb3AuthAction = async () => {
        try {
            if (web3AuthUser) {
                // User is logged in, so logout
                await disconnect()
            } else {
                // User is not logged in, so login
                const provider = await connect()
                if (provider) {
                    // Redirect to dashboard after successful login
                    router.push('/dashboard')
                }
            }
        } catch (error) {
            console.error('Web3Auth action error:', error)
        }
    }

    // Base classes for both variants
    const baseClasses = "bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 hover:from-indigo-700 hover:via-purple-700 hover:to-pink-700 text-white font-medium transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
    
    // Variant-specific classes
    const variantClasses = variant === 'desktop' 
        ? "px-4 py-2 rounded-lg hover:scale-105"
        : "px-3 py-1 text-xs rounded-md"
    
    const buttonClasses = `${baseClasses} ${variantClasses} ${className}`

    return (
        <button
            onClick={handleWeb3AuthAction}
            disabled={isConnecting}
            className={buttonClasses}
        >
            {isConnecting ? (
                variant === 'desktop' ? (
                    <div className="flex items-center">
                        <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        {t('auth.connecting') || 'Connecting...'}
                    </div>
                ) : (
                    t('auth.connecting') || 'Connecting...'
                )
            ) : web3AuthUser ? (
                variant === 'desktop' ? (
                    <div className="flex items-center">
                        <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                        </svg>
                        {t('auth.logout') || 'Logout'}
                    </div>
                ) : (
                    t('auth.logout') || 'Logout'
                )
            ) : (
                variant === 'desktop' ? (
                    <div className="flex items-center">
                        <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z" />
                        </svg>
                        {t('auth.login') || 'Login'}
                    </div>
                ) : (
                    t('auth.login') || 'Login'
                )
            )}
        </button>
    )
}

export default AuthButton
