import { serverRequest } from '../../lib/api-client';
import { API_ENDPOINTS } from '../../lib/constants';
import type { 
    SignupRequest, 
    LoginRequest, 
    AuthResponse, 
    UserProfile 
} from './types';

/**
 * Auth feature-specific API client
 * Handles all authentication-related API calls to the backend
 * Aligned with OpenAPI specification
 */
export class AuthApiClient {
    /**
     * Create new user account
     * POST /auth/signup
     */
    static async signup(data: SignupRequest): Promise<AuthResponse> {
        return serverRequest<AuthResponse>(
            'POST',
            API_ENDPOINTS.auth.signup,
            undefined, // token not required for signup
            data
        );
    }

    /**
     * Authenticate user
     * POST /auth/login
     */
    static async login(data: LoginRequest): Promise<AuthResponse> {
        return serverRequest<AuthResponse>(
            'POST',
            API_ENDPOINTS.auth.login,
            undefined, // token not required for login
            data
        );
    }

    /**
     * Refresh access token
     * POST /auth/refresh
     */
    static async refreshToken(refreshToken: string): Promise<{ accessToken: string }> {
        return serverRequest<{ accessToken: string }>(
            'POST',
            API_ENDPOINTS.auth.refresh,
            undefined, // token not required for refresh
            { refreshToken }
        );
    }

    /**
     * Get user profile
     * GET /auth/me
     */
    static async getMe(token: string): Promise<UserProfile> {
        return serverRequest<UserProfile>(
            'GET',
            API_ENDPOINTS.auth.me,
            token
        );
    }

    /**
     * Verify email address
     * POST /auth/verify-email
     */
    static async verifyEmail(token: string): Promise<{ message: string }> {
        return serverRequest<{ message: string }>(
            'POST',
            API_ENDPOINTS.auth.verifyEmail,
            undefined, // token not required for verification
            { token }
        );
    }

    /**
     * Resend verification email
     * POST /auth/resend-verification
     */
    static async resendVerification(email: string): Promise<{ message: string }> {
        return serverRequest<{ message: string }>(
            'POST',
            API_ENDPOINTS.auth.resendVerification,
            undefined, // token not required
            { email }
        );
    }

    /**
     * Request password reset
     * POST /auth/forgot-password
     */
    static async forgotPassword(email: string): Promise<{ message: string }> {
        return serverRequest<{ message: string }>(
            'POST',
            API_ENDPOINTS.auth.forgotPassword,
            undefined, // token not required
            { email }
        );
    }

    /**
     * Reset password
     * POST /auth/reset-password
     */
    static async resetPassword(token: string, newPassword: string): Promise<{ message: string }> {
        return serverRequest<{ message: string }>(
            'POST',
            API_ENDPOINTS.auth.resetPassword,
            undefined, // token not required
            { token, newPassword }
        );
    }

    /**
     * Logout user
     * POST /auth/logout
     */
    static async logout(token: string): Promise<{ message: string }> {
        return serverRequest<{ message: string }>(
            'POST',
            API_ENDPOINTS.auth.logout,
            token
        );
    }
}
