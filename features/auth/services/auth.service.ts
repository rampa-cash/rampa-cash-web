import { AuthApiClient } from '../api-client';
import { getLocalStorage, setLocalStorage, removeLocalStorage } from '@/lib/browser-utils';
import type { 
    User, 
    LoginCredentials, 
    SignupData, 
    AuthResponse, 
    Web3AuthResponse
} from '../types';

/**
 * Auth service for handling authentication logic
 * Uses AuthApiClient for API calls and manages local state
 */
export class AuthService {
    /**
     * Login with email and password
     */
    static async login(credentials: LoginCredentials): Promise<AuthResponse> {
        try {
            const response = await AuthApiClient.login({
                authProvider: 'web3auth', // Default for email/password
                authProviderId: credentials.email,
            })

            // Store tokens in localStorage
            this.storeTokens(response.accessToken, response.refreshToken)

            return response
        } catch (error) {
            console.error('Login error:', error)
            throw new Error('Failed to login. Please check your credentials.')
        }
    }

    /**
     * Register new user
     */
    static async signup(userData: SignupData): Promise<AuthResponse> {
        try {
            const response = await AuthApiClient.signup({
                authProvider: 'web3auth',
                authProviderId: userData.email,
                firstName: userData.firstName,
                lastName: userData.lastName,
                email: userData.email,
                language: userData.language || 'en',
            })

            // Store tokens in localStorage
            this.storeTokens(response.accessToken, response.refreshToken)

            return response
        } catch (error) {
            console.error('Signup error:', error)
            throw new Error('Failed to create account. Please try again.')
        }
    }

    /**
     * Web3Auth login (wallet connection)
     * @param authProviderId - The unique identifier from Web3Auth (email, verifierId, or name)
     * @param _signature - Not used for Web3Auth login (kept for compatibility)
     */
    static async web3AuthLogin(authProviderId: string, _signature: string): Promise<Web3AuthResponse> {
        try {
            const response = await AuthApiClient.login({
                authProvider: 'web3auth',
                authProviderId: authProviderId,
                walletAddress: authProviderId, // Using authProviderId as walletAddress for now
            })

            // Store tokens in localStorage
            this.storeTokens(response.accessToken, response.refreshToken)

            return {
                ...response,
                walletAddress: authProviderId,
            }
        } catch (error) {
            console.error('Web3Auth login error:', error)
            throw new Error('Failed to authenticate with Web3Auth. Please try again.')
        }
    }

    /**
     * Refresh access token
     */
    static async refreshToken(): Promise<AuthResponse> {
        try {
            const refreshToken = this.getRefreshToken()
            if (!refreshToken) {
                throw new Error('No refresh token available')
            }

            const response = await AuthApiClient.refreshToken(refreshToken)

            // Store new access token
            this.storeTokens(response.accessToken, refreshToken)

            // Get user profile to reconstruct full AuthResponse
            const userProfile = await AuthApiClient.getMe(response.accessToken)
            
            return {
                user: userProfile as User,
                accessToken: response.accessToken,
                refreshToken,
                expiresIn: 3600, // Default 1 hour
                userId: userProfile.id,
                email: userProfile.email,
                firstName: userProfile.firstName,
                lastName: userProfile.lastName,
                language: userProfile.language,
                authProvider: userProfile.authProvider,
                isActive: userProfile.isActive,
            }
        } catch (error) {
            console.error('Token refresh error:', error)
            this.clearTokens()
            throw new Error('Session expired. Please login again.')
        }
    }

    /**
     * Logout user
     */
    static async logout(): Promise<void> {
        try {
            const token = this.getAccessToken()
            if (token) {
                await AuthApiClient.logout(token)
            }
        } catch (error) {
            console.error('Logout error:', error)
        } finally {
            this.clearTokens()
        }
    }

    /**
     * Verify email address
     */
    static async verifyEmail(token: string): Promise<void> {
        try {
            await AuthApiClient.verifyEmail(token)
        } catch (error) {
            console.error('Email verification error:', error)
            throw new Error('Failed to verify email. Please try again.')
        }
    }

    /**
     * Resend verification email
     */
    static async resendVerification(email: string): Promise<void> {
        try {
            await AuthApiClient.resendVerification(email)
        } catch (error) {
            console.error('Resend verification error:', error)
            throw new Error('Failed to resend verification email.')
        }
    }

    /**
     * Forgot password
     */
    static async forgotPassword(email: string): Promise<void> {
        try {
            await AuthApiClient.forgotPassword(email)
        } catch (error) {
            console.error('Forgot password error:', error)
            throw new Error('Failed to send reset email.')
        }
    }

    /**
     * Reset password
     */
    static async resetPassword(token: string, newPassword: string): Promise<void> {
        try {
            await AuthApiClient.resetPassword(token, newPassword)
        } catch (error) {
            console.error('Reset password error:', error)
            throw new Error('Failed to reset password.')
        }
    }

    /**
     * Get current user from token
     */
    static async getCurrentUser(): Promise<User | null> {
        try {
            const token = this.getAccessToken()
            if (!token) {
                return null
            }

            const userProfile = await AuthApiClient.getMe(token)
            return userProfile as User
        } catch (error) {
            console.error('Get current user error:', error)
            return null
        }
    }

    /**
     * Check if user is authenticated
     */
    static isAuthenticated(): boolean {
        const token = this.getAccessToken()
        if (!token) {
            return false
        }

        // Check if token is expired
        try {
            const payload = JSON.parse(atob(token.split('.')[1]))
            const currentTime = Date.now() / 1000
            return payload.exp > currentTime
        } catch {
            return false
        }
    }

    /**
     * Get access token from localStorage
     */
    static getAccessToken(): string | null {
        return getLocalStorage('accessToken')
    }

    /**
     * Get refresh token from localStorage
     */
    static getRefreshToken(): string | null {
        return getLocalStorage('refreshToken')
    }

    /**
     * Store tokens in localStorage
     */
    private static storeTokens(accessToken: string, refreshToken: string): void {
        setLocalStorage('accessToken', accessToken)
        setLocalStorage('refreshToken', refreshToken)
    }

    /**
     * Clear tokens from localStorage
     */
    private static clearTokens(): void {
        removeLocalStorage('accessToken')
        removeLocalStorage('refreshToken')
    }
}