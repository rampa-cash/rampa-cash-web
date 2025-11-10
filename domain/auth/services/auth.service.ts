/**
 * Auth Service
 *
 * Uses the Port pattern to interact with authentication adapters
 * This service is adapter-agnostic and works with any IAuthPort implementation
 */

import {
    IAuthPort,
    AuthUser,
    LoginOptions,
} from '../interfaces/authentication-service.interface';
import { AuthApiClient } from '../api-client';

export class AuthService {
    private adapter: IAuthPort;

    constructor(adapter: IAuthPort) {
        this.adapter = adapter;
    }

    /**
     * Set a new adapter (useful for switching providers)
     */
    setAdapter(adapter: IAuthPort): void {
        this.adapter = adapter;
    }

    /**
     * Login with the specified options
     */
    async login(options?: LoginOptions): Promise<AuthUser> {
        return await this.adapter.login(options);
    }

    /**
     * Logout the current user
     */
    async logout(): Promise<void> {
        return await this.adapter.logout();
    }

    /**
     * Get the current authenticated user
     */
    async getCurrentUser(): Promise<AuthUser | null> {
        return await this.adapter.getUser();
    }

    /**
     * Check if user is authenticated
     */
    async isAuthenticated(): Promise<boolean> {
        return await this.adapter.isAuthenticated();
    }

    /**
     * Get the current authentication token
     */
    async getToken(): Promise<string | null> {
        return await this.adapter.getToken();
    }

    /**
     * Check if the current token is valid
     */
    isTokenValid(): boolean {
        return this.adapter.isTokenValid();
    }

    /**
     * Refresh the authentication token
     */
    async refreshToken(): Promise<void> {
        await this.adapter.refreshToken();
    }

    /**
     * Get wallet address
     */
    async getWalletAddress(): Promise<string | null> {
        return await this.adapter.getWalletAddress();
    }

    /**
     * Sign a message
     */
    async signMessage(message: string): Promise<string> {
        return await this.adapter.signMessage(message);
    }

    /**
     * Sign a transaction
     */
    async signTransaction(transaction: any): Promise<any> {
        return await this.adapter.signTransaction(transaction);
    }

    /**
     * Get user profile from backend
     */
    async getUserProfile(): Promise<any> {
        const token = await this.getToken();
        if (!token) {
            throw new Error('Not authenticated');
        }

        return await AuthApiClient.getMe(token);
    }
}
