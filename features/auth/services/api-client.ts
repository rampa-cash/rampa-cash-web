import axios from 'axios';
import { Web3AuthJWTService } from './web3auth-jwt.service';

// API Client with Web3Auth token injection
export class Web3AuthApiClient {
    private client: any;

    constructor(
        baseURL: string = process.env.NEXT_PUBLIC_BACKEND_URL ||
            'http://localhost:3001'
    ) {
        this.client = axios.create({
            baseURL,
            timeout: parseInt(process.env.NEXT_PUBLIC_API_TIMEOUT || '10000'),
            headers: {
                'Content-Type': 'application/json',
            },
        });

        // Add request interceptor to inject Web3Auth token
        this.client.interceptors.request.use(
            (config: any) => {
                const token = Web3AuthJWTService.getToken();
                if (token && Web3AuthJWTService.isTokenValid()) {
                    config.headers.Authorization = `Bearer ${token}`;
                }
                return config;
            },
            (error: any) => {
                return Promise.reject(error);
            }
        );

        // Add response interceptor to handle auth errors
        this.client.interceptors.response.use(
            (response: any) => {
                return response;
            },
            (error: any) => {
                if (error.response?.status === 401) {
                    // Token is invalid or expired
                    Web3AuthJWTService.clearToken();
                    // Redirect to login or trigger logout
                    if (typeof window !== 'undefined') {
                        window.location.href = '/';
                    }
                }
                return Promise.reject(error);
            }
        );
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

    /**
     * Check if user is authenticated
     */
    isAuthenticated(): boolean {
        return Web3AuthJWTService.isTokenValid();
    }

    /**
     * Get current user info from token
     */
    getCurrentUser(): any | null {
        const token = Web3AuthJWTService.getToken();
        if (!token) return null;

        return Web3AuthJWTService.getUserFromToken(token);
    }

    /**
     * Get wallet addresses from token
     */
    getWalletAddresses(): string[] {
        const token = Web3AuthJWTService.getToken();
        if (!token) return [];

        return Web3AuthJWTService.getWalletAddresses(token);
    }

    /**
     * Get primary wallet address
     */
    getPrimaryWalletAddress(): string | null {
        const token = Web3AuthJWTService.getToken();
        if (!token) return null;

        return Web3AuthJWTService.getPrimaryWalletAddress(token);
    }
}

// Create singleton instance
export const apiClient = new Web3AuthApiClient();

// Export for convenience
export default apiClient;
