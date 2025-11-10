/**
 * Mock Authentication Adapter
 *
 * Implements IAuthPort for testing and development.
 * This adapter simulates authentication without requiring external services.
 */

import {
    IAuthPort,
    AuthUser,
    AuthToken,
    LoginOptions,
    AuthError,
    WalletInfo,
} from '@/domain/auth/interfaces/authentication-service.interface';

export class MockAdapter implements IAuthPort {
    private isConnectedState: boolean = false;
    private currentUser: AuthUser | null = null;
    private currentWallet: WalletInfo | null = null;
    private isLoadingState: boolean = false;
    private errorState: AuthError | null = null;
    private backendToken: string | null = null;
    private tokenExpiry: number | null = null;

    async initialize(): Promise<void> {
        this.isLoadingState = true;
        this.clearError();

        // Simulate initialization delay
        await new Promise(resolve => setTimeout(resolve, 100));

        // Check if there's a stored session (simulate localStorage)
        const storedUser = this.getStoredUser();
        if (storedUser) {
            this.currentUser = storedUser;
            this.isConnectedState = true;
            this.currentWallet = {
                address: storedUser.walletAddress ?? '0xMockAddress123',
                chain: 'ethereum',
            };
        }

        this.isLoadingState = false;
    }

    async login(options?: LoginOptions): Promise<AuthUser> {
        this.isLoadingState = true;
        this.clearError();

        // Simulate login delay
        await new Promise(resolve => setTimeout(resolve, 500));

        // Create mock user
        const mockUser: AuthUser = {
            id: 'mock-user-123',
            email: options?.email ?? 'mock@example.com',
            name: 'Mock User',
            authProvider: 'mock',
            isActive: true,
            status: 'active',
            walletAddress: '0xMockAddress123',
            wallets: [
                {
                    public_key: '0xMockAddress123',
                    type: 'mock',
                    curve: 'secp256k1',
                },
            ],
        };

        this.currentUser = mockUser;
        this.isConnectedState = true;
        this.currentWallet = {
            address: mockUser.walletAddress,
            chain: 'ethereum',
        };

        // Generate mock token
        this.backendToken = 'mock-token-' + Date.now();
        this.tokenExpiry = Date.now() + 3600000; // 1 hour

        // Store user (simulate localStorage)
        this.storeUser(mockUser);

        this.isLoadingState = false;
        return mockUser;
    }

    async logout(): Promise<void> {
        this.isLoadingState = true;
        this.clearError();

        // Simulate logout delay
        await new Promise(resolve => setTimeout(resolve, 200));

        this.isConnectedState = false;
        this.currentUser = null;
        this.currentWallet = null;
        this.backendToken = null;
        this.tokenExpiry = null;

        // Clear stored user
        this.clearStoredUser();

        this.isLoadingState = false;
    }

    async getUser(): Promise<AuthUser | null> {
        return this.currentUser;
    }

    async getToken(): Promise<string | null> {
        if (this.backendToken && this.isTokenValid()) {
            return this.backendToken;
        }
        return null;
    }

    async isAuthenticated(): Promise<boolean> {
        return this.isConnectedState && this.currentUser !== null;
    }

    isTokenValid(): boolean {
        if (!this.backendToken) {
            return false;
        }

        if (this.tokenExpiry) {
            return Date.now() < this.tokenExpiry;
        }

        return true;
    }

    async refreshToken(): Promise<AuthToken | null> {
        if (!this.isConnectedState) {
            return null;
        }

        // Generate new mock token
        this.backendToken = 'mock-token-' + Date.now();
        this.tokenExpiry = Date.now() + 3600000; // 1 hour

        return {
            accessToken: this.backendToken,
            expiresIn: 3600,
            expiresAt: this.tokenExpiry,
        };
    }

    isLoading(): boolean {
        return this.isLoadingState;
    }

    getError(): AuthError | null {
        return this.errorState;
    }

    clearError(): void {
        this.errorState = null;
    }

    async getWalletAddress(): Promise<string | null> {
        return this.currentWallet?.address ?? null;
    }

    async signMessage(message: string): Promise<string> {
        if (!this.isConnectedState) {
            throw new Error('Not authenticated');
        }

        // Return mock signature
        return 'mock-signature-' + Buffer.from(message).toString('base64');
    }

    async signTransaction(transaction: any): Promise<any> {
        if (!this.isConnectedState) {
            throw new Error('Not authenticated');
        }

        // Return mock signed transaction
        return {
            ...transaction,
            signature: 'mock-transaction-signature',
        };
    }

    // Reactive state methods (new)
    getIsConnected(): boolean {
        return this.isConnectedState;
    }

    getCurrentAccount(): AuthUser | null {
        return this.currentUser;
    }

    getCurrentWallet(): WalletInfo | null {
        return this.currentWallet;
    }

    async openWalletModal(): Promise<void> {
        // Mock implementation - just log
        // eslint-disable-next-line no-console
        console.log('Mock: Opening wallet modal');
    }

    // Private helper methods
    private getStoredUser(): AuthUser | null {
        if (typeof window === 'undefined') {
            return null;
        }

        try {
            const stored = localStorage.getItem('mock-auth-user');
            return stored ? JSON.parse(stored) : null;
        } catch {
            return null;
        }
    }

    private storeUser(user: AuthUser): void {
        if (typeof window === 'undefined') {
            return;
        }

        try {
            localStorage.setItem('mock-auth-user', JSON.stringify(user));
        } catch {
            // Ignore storage errors
        }
    }

    private clearStoredUser(): void {
        if (typeof window === 'undefined') {
            return;
        }

        try {
            localStorage.removeItem('mock-auth-user');
        } catch {
            // Ignore storage errors
        }
    }
}
