/**
 * API Client with Token Injection
 *
 * Automatically injects authentication tokens from the auth adapter
 */

import axios, { AxiosInstance } from 'axios';
import { BACKEND_CONFIG } from '@/lib/constants';
import { IAuthPort } from '../interfaces/authentication-service.interface';

export class AuthApiClient {
    private client: AxiosInstance;
    private authAdapter: IAuthPort | null = null;

    constructor(baseURL: string = BACKEND_CONFIG.baseURL) {
        this.client = axios.create({
            baseURL,
            timeout: parseInt(process.env.NEXT_PUBLIC_API_TIMEOUT || '10000'),
            headers: {
                'Content-Type': 'application/json',
            },
        });

        // Add request interceptor to inject auth token
        this.client.interceptors.request.use(
            async config => {
                if (this.authAdapter) {
                    const token = await this.authAdapter.getToken();
                    if (token && this.authAdapter.isTokenValid()) {
                        config.headers.Authorization = `Bearer ${token}`;
                    }
                }
                return config;
            },
            error => {
                return Promise.reject(error);
            }
        );

        // Add response interceptor to handle auth errors
        this.client.interceptors.response.use(
            response => {
                return response;
            },
            async error => {
                if (error.response?.status === 401 && this.authAdapter) {
                    // Token is invalid or expired
                    // Try to refresh token
                    try {
                        await this.authAdapter.refreshToken();
                        // Retry the original request
                        const token = await this.authAdapter.getToken();
                        if (token) {
                            error.config.headers.Authorization = `Bearer ${token}`;
                            return this.client.request(error.config);
                        }
                    } catch (refreshError) {
                        // Refresh failed, redirect to login
                        if (typeof window !== 'undefined') {
                            window.location.href = '/';
                        }
                    }
                }
                return Promise.reject(error);
            }
        );
    }

    /**
     * Set the auth adapter for token injection
     */
    setAuthAdapter(adapter: IAuthPort): void {
        this.authAdapter = adapter;
    }

    /**
     * Make authenticated GET request
     */
    async get<T = any>(url: string, config?: any): Promise<T> {
        try {
            const response = await this.client.get(url, config);
            return response.data;
        } catch (error) {
            throw this.handleError(error);
        }
    }

    /**
     * Make authenticated POST request
     */
    async post<T = any>(url: string, data?: any, config?: any): Promise<T> {
        try {
            const response = await this.client.post(url, data, config);
            return response.data;
        } catch (error) {
            throw this.handleError(error);
        }
    }

    /**
     * Make authenticated PUT request
     */
    async put<T = any>(url: string, data?: any, config?: any): Promise<T> {
        try {
            const response = await this.client.put(url, data, config);
            return response.data;
        } catch (error) {
            throw this.handleError(error);
        }
    }

    /**
     * Make authenticated DELETE request
     */
    async delete<T = any>(url: string, config?: any): Promise<T> {
        try {
            const response = await this.client.delete(url, config);
            return response.data;
        } catch (error) {
            throw this.handleError(error);
        }
    }

    /**
     * Make authenticated PATCH request
     */
    async patch<T = any>(url: string, data?: any, config?: any): Promise<T> {
        try {
            const response = await this.client.patch(url, data, config);
            return response.data;
        } catch (error) {
            throw this.handleError(error);
        }
    }

    /**
     * Login endpoint
     */
    async login(data: {
        authProvider: string;
        authProviderId: string;
        walletAddress?: string;
    }): Promise<any> {
        return this.post('/auth/login', data);
    }

    /**
     * Signup endpoint
     */
    async signup(data: {
        authProvider: string;
        authProviderId: string;
        firstName: string;
        lastName: string;
        email: string;
        phone?: string;
        language?: string;
    }): Promise<any> {
        return this.post('/auth/signup', data);
    }

    /**
     * Get current user
     */
    async getMe(token: string): Promise<any> {
        return this.get('/auth/me', {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });
    }

    /**
     * Refresh token
     */
    async refreshToken(refreshToken: string): Promise<any> {
        return this.post('/auth/refresh', { refreshToken });
    }

    /**
     * Logout
     */
    async logout(token: string): Promise<void> {
        return this.post(
            '/auth/logout',
            {},
            {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            }
        );
    }

    /**
     * Handle API errors
     */
    private handleError(error: any): Error {
        if (error.response) {
            const message =
                error.response?.data?.message ||
                error.message ||
                'API request failed';
            const status = error.response?.status;

            switch (status) {
                case 401:
                    return new Error('Authentication required. Please log in.');
                case 403:
                    return new Error(
                        'Access denied. You do not have permission to perform this action.'
                    );
                case 404:
                    return new Error('Resource not found.');
                case 422:
                    return new Error('Invalid data provided.');
                case 429:
                    return new Error(
                        'Too many requests. Please try again later.'
                    );
                case 500:
                    return new Error('Server error. Please try again later.');
                default:
                    return new Error(message);
            }
        }

        return new Error('An unexpected error occurred');
    }
}

// Create singleton instance
export const apiClient = new AuthApiClient();

// Export for convenience
export default apiClient;
