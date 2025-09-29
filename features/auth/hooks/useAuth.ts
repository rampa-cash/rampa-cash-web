import { useState, useEffect, useCallback } from 'react'
import { useRouter } from 'next/router'
import { AuthService } from '../services/auth.service'
import type { User, LoginCredentials, SignupData } from '../types'

interface UseAuthReturn {
    // State
    user: User | null
    isLoading: boolean
    isAuthenticated: boolean
    error: string | null

    // Actions
    login: (credentials: LoginCredentials) => Promise<void>
    signup: (userData: SignupData) => Promise<void>
    web3AuthLogin: (walletAddress: string, signature: string) => Promise<void>
    logout: () => Promise<void>
    verifyEmail: (token: string) => Promise<void>
    resendVerification: (email: string) => Promise<void>
    forgotPassword: (email: string) => Promise<void>
    resetPassword: (token: string, newPassword: string) => Promise<void>
    refreshToken: () => Promise<void>
    clearError: () => void
}

export const useAuth = (): UseAuthReturn => {
    const router = useRouter()
    const [user, setUser] = useState<User | null>(null)
    const [isLoading, setIsLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)

    // Check if user is authenticated
    const isAuthenticated = AuthService.isAuthenticated()

    /**
     * Initialize auth state
     */
    useEffect(() => {
        const initializeAuth = async () => {
            try {
                setIsLoading(true)

                if (isAuthenticated) {
                    const currentUser = await AuthService.getCurrentUser()
                    setUser(currentUser)
                }
            } catch (error) {
                console.error('Auth initialization error:', error)
                setError('Failed to initialize authentication')
            } finally {
                setIsLoading(false)
            }
        }

        initializeAuth()
    }, [isAuthenticated])

    /**
     * Login with email and password
     */
    const login = useCallback(async (credentials: LoginCredentials) => {
        try {
            setIsLoading(true)
            setError(null)

            const response = await AuthService.login(credentials)
            setUser(response.user)

            // Redirect to dashboard
            router.push('/dashboard')
        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : 'Login failed'
            setError(errorMessage)
            throw error
        } finally {
            setIsLoading(false)
        }
    }, [router])

    /**
     * Register new user
     */
    const signup = useCallback(async (userData: SignupData) => {
        try {
            setIsLoading(true)
            setError(null)

            const response = await AuthService.signup(userData)
            setUser(response.user)

            // Redirect to email verification page
            router.push('/auth/verify-email')
        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : 'Signup failed'
            setError(errorMessage)
            throw error
        } finally {
            setIsLoading(false)
        }
    }, [router])

    /**
     * Web3Auth login (wallet connection)
     */
    const web3AuthLogin = useCallback(async (walletAddress: string, signature: string) => {
        try {
            setIsLoading(true)
            setError(null)

            const response = await AuthService.web3AuthLogin(walletAddress, signature)
            setUser(response.user)

            // Redirect to dashboard
            router.push('/dashboard')
        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : 'Wallet connection failed'
            setError(errorMessage)
            throw error
        } finally {
            setIsLoading(false)
        }
    }, [router])

    /**
     * Logout user
     */
    const logout = useCallback(async () => {
        try {
            setIsLoading(true)
            setError(null)

            await AuthService.logout()
            setUser(null)

            // Redirect to login page
            router.push('/auth/login')
        } catch (error) {
            console.error('Logout error:', error)
            // Still clear local state even if API call fails
            setUser(null)
            router.push('/auth/login')
        } finally {
            setIsLoading(false)
        }
    }, [router])

    /**
     * Verify email address
     */
    const verifyEmail = useCallback(async (token: string) => {
        try {
            setIsLoading(true)
            setError(null)

            await AuthService.verifyEmail(token)

            // Update user state to reflect verified status
            if (user) {
                // Note: Email verification status would be updated via API response
                // For now, we'll just refresh the user data
                const updatedUser = await AuthService.getCurrentUser()
                if (updatedUser) {
                    setUser(updatedUser)
                }
            }
        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : 'Email verification failed'
            setError(errorMessage)
            throw error
        } finally {
            setIsLoading(false)
        }
    }, [user])

    /**
     * Resend verification email
     */
    const resendVerification = useCallback(async (email: string) => {
        try {
            setIsLoading(true)
            setError(null)

            await AuthService.resendVerification(email)
        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : 'Failed to resend verification'
            setError(errorMessage)
            throw error
        } finally {
            setIsLoading(false)
        }
    }, [])

    /**
     * Forgot password
     */
    const forgotPassword = useCallback(async (email: string) => {
        try {
            setIsLoading(true)
            setError(null)

            await AuthService.forgotPassword(email)
        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : 'Failed to send reset email'
            setError(errorMessage)
            throw error
        } finally {
            setIsLoading(false)
        }
    }, [])

    /**
     * Reset password
     */
    const resetPassword = useCallback(async (token: string, newPassword: string) => {
        try {
            setIsLoading(true)
            setError(null)

            await AuthService.resetPassword(token, newPassword)

            // Redirect to login page
            router.push('/auth/login')
        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : 'Password reset failed'
            setError(errorMessage)
            throw error
        } finally {
            setIsLoading(false)
        }
    }, [router])

    /**
     * Refresh access token
     */
    const refreshToken = useCallback(async () => {
        try {
            setError(null)

            const response = await AuthService.refreshToken()
            setUser(response.user)
        } catch (error) {
            console.error('Token refresh error:', error)
            setUser(null)
            router.push('/auth/login')
        }
    }, [router])

    /**
     * Clear error state
     */
    const clearError = useCallback(() => {
        setError(null)
    }, [])

    return {
        // State
        user,
        isLoading,
        isAuthenticated,
        error,

        // Actions
        login,
        signup,
        web3AuthLogin,
        logout,
        verifyEmail,
        resendVerification,
        forgotPassword,
        resetPassword,
        refreshToken,
        clearError,
    }
}
