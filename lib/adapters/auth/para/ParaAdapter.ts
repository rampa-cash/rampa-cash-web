/**
 * Para Authentication Adapter
 *
 * Implements the IAuthPort interface using Para SDK
 * This is an infrastructure concern, not a domain concern.
 */

import {
    IAuthPort,
    AuthUser,
    AuthToken,
    LoginOptions,
    AuthError,
    WalletInfo,
} from '@/domain/auth/interfaces/authentication-service.interface';
import { BACKEND_CONFIG, API_ENDPOINTS } from '@/lib/constants';

// Para SDK types (we'll import these from the actual SDK)
interface ParaWallet {
    id: string;
    address: string;
    chain?: string;
}

interface ParaAccount {
    id: string;
    email?: string;
    phone?: string;
    name?: string;
    profileImage?: string;
}

// This will be injected from the Para context
interface ParaSDK {
    client: unknown;
    wallet: ParaWallet | null;
    account: ParaAccount | null;
    isConnected: boolean;
    openModal: () => Promise<void>;
    signMessage: (walletId: string, messageBase64: string) => Promise<string>;
    signTransaction: (
        walletId: string,
        transaction: unknown
    ) => Promise<unknown>;
    logout: () => Promise<void>;
    issueJWT: () => Promise<string>;
    exportSession?: () => Promise<string>; // Add exportSession method
}

export class ParaAdapter implements IAuthPort {
    private paraSDK: ParaSDK | null = null;
    private isLoadingState: boolean = false;
    private errorState: AuthError | null = null;
    private backendToken: string | null = null;
    private tokenExpiry: number | null = null;
    private refreshTimer: NodeJS.Timeout | null = null;

    constructor(paraSDK?: ParaSDK) {
        if (paraSDK) {
            this.paraSDK = paraSDK;
        }
    }

    /**
     * Set the Para SDK instance
     */
    setSDK(sdk: ParaSDK): void {
        this.paraSDK = sdk;
    }

    async initialize(): Promise<void> {
        try {
            this.isLoadingState = true;
            this.clearError();

            // Para SDK initialization is handled by ParaProvider
            // This method can be used for any additional setup

            this.isLoadingState = false;
        } catch (error) {
            this.isLoadingState = false;
            this.errorState = {
                message:
                    error instanceof Error
                        ? error.message
                        : 'Failed to initialize Para',
                code: 'INIT_ERROR',
            };
            throw error;
        }
    }

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    async login(_options?: LoginOptions): Promise<AuthUser> {
        try {
            this.isLoadingState = true;
            this.clearError();

            if (!this.paraSDK) {
                throw new Error('Para SDK not initialized');
            }

            // Check if already connected - if so, import session and return current user
            if (
                this.paraSDK.isConnected &&
                this.paraSDK.account &&
                this.paraSDK.wallet
            ) {
                // eslint-disable-next-line no-console
                console.log('Already authenticated, importing session to backend');
                const currentUser = this.getCurrentAccount();
                if (currentUser) {
                    // Still need to import session to backend
                    await this.importSessionToBackend();
                    this.isLoadingState = false;
                    return currentUser;
                }
            }

            // Open Para modal for authentication
            await this.paraSDK.openModal();

            // Wait for user to complete authentication (with timeout)
            // The modal will close when user completes authentication
            // We need to wait for the SDK to update isConnected and wallet
            const maxWaitTime = 300000; // 5 minutes max wait
            const checkInterval = 500; // Check every 500ms
            const startTime = Date.now();

            while (
                !this.paraSDK.isConnected ||
                !this.paraSDK.wallet ||
                !this.paraSDK.account
            ) {
                if (Date.now() - startTime > maxWaitTime) {
                    throw new Error(
                        'Authentication timeout - user did not complete login'
                    );
                }
                // Wait a bit before checking again
                await new Promise(resolve =>
                    setTimeout(resolve, checkInterval)
                );
            }

            // NEW: Export session and send to backend
            await this.importSessionToBackend();

            // Build user object
            const user = await this.getUser();
            if (!user) {
                throw new Error('Failed to get user after login');
            }

            // Start background refresh
            this.startBackgroundRefresh();

            // eslint-disable-next-line no-console
            console.log('=== Para Login Success ===');
            // eslint-disable-next-line no-console
            console.log('User Data:', {
                id: user.id,
                email: user.email,
                phone: user.phone,
                name: user.name,
                profileImage: user.profileImage,
                walletAddress: user.walletAddress,
            });
            // eslint-disable-next-line no-console
            console.log('Session Token:', this.backendToken?.substring(0, 10) + '...');
            // eslint-disable-next-line no-console
            console.log('Token Expiry:', this.tokenExpiry);
            // eslint-disable-next-line no-console
            console.log('========================');

            this.isLoadingState = false;
            return user;
        } catch (error) {
            this.isLoadingState = false;
            this.errorState = {
                message:
                    error instanceof Error ? error.message : 'Login failed',
                code: 'LOGIN_ERROR',
            };
            throw error;
        }
    }

    /**
     * Import session to backend by exporting Para session and sending it
     */
    private async importSessionToBackend(): Promise<void> {
        if (!this.paraSDK?.isConnected) {
            throw new Error('Para SDK not connected');
        }

        // Try to export session from Para SDK
        // First try the exportSession method if available
        let serializedSession: string;
        
        if (this.paraSDK.exportSession && typeof this.paraSDK.exportSession === 'function') {
            serializedSession = await this.paraSDK.exportSession();
        } else {
            // Fallback: Try to access Para client directly
            // The Para client might be available through the SDK
            const paraClient = (this.paraSDK as any).client;
            if (paraClient && typeof paraClient.exportSession === 'function') {
                serializedSession = await paraClient.exportSession();
            } else {
                // If we can't export session, we need to get it from Para SDK hooks
                // This is a workaround - ideally Para SDK should provide exportSession hook
                throw new Error(
                    'Cannot export session: exportSession method not available. ' +
                    'Please ensure Para SDK is properly initialized and exportSession is accessible.'
                );
            }
        }

        // Send to backend
        const response = await fetch(
            `${BACKEND_CONFIG.baseURL}/auth/session/import`,
            {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ serializedSession }),
            }
        );

        if (!response.ok) {
            const errorData = await response.json().catch(() => ({}));
            throw new Error(
                errorData.message || 'Failed to import session to backend'
            );
        }

        const { sessionToken, user, expiresAt } = await response.json();

        // Store sessionToken
        this.backendToken = sessionToken;
        this.tokenExpiry = new Date(expiresAt).getTime();

        // Log for debugging
        // eslint-disable-next-line no-console
        console.log('Session imported successfully:', {
            sessionToken: sessionToken.substring(0, 10) + '...',
            userId: user?.id,
            isVerified: user?.isVerified,
        });
    }

    async logout(): Promise<void> {
        try {
            this.isLoadingState = true;
            this.clearError();

            // Clear background refresh timer
            if (this.refreshTimer) {
                clearInterval(this.refreshTimer);
                this.refreshTimer = null;
            }

            // Clear backend token
            this.backendToken = null;
            this.tokenExpiry = null;

            // Logout from Para
            if (this.paraSDK) {
                await this.paraSDK.logout();
            }

            this.isLoadingState = false;
        } catch (error) {
            this.isLoadingState = false;
            this.errorState = {
                message:
                    error instanceof Error ? error.message : 'Logout failed',
                code: 'LOGOUT_ERROR',
            };
            // Still clear local state even if Para logout fails
            this.backendToken = null;
            this.tokenExpiry = null;
            if (this.refreshTimer) {
                clearInterval(this.refreshTimer);
                this.refreshTimer = null;
            }
            throw error;
        }
    }

    async getUser(): Promise<AuthUser | null> {
        try {
            if (!this.paraSDK || !this.paraSDK.isConnected) {
                return null;
            }

            // Get user info from backend using token
            const token = await this.getToken();
            if (!token) {
                return null;
            }

            const response = await fetch(
                `${BACKEND_CONFIG.baseURL}${API_ENDPOINTS.auth.me}`,
                {
                    method: 'GET',
                    headers: {
                        Authorization: `Bearer ${token}`,
                        'Content-Type': 'application/json',
                    },
                }
            );

            if (!response.ok) {
                return null;
            }

            const userData = await response.json();

            // Map backend user to AuthUser
            return {
                id: userData.id || this.paraSDK.account?.id || '',
                email: userData.email || this.paraSDK.account?.email,
                phone: userData.phone || this.paraSDK.account?.phone,
                firstName: userData.firstName,
                lastName: userData.lastName,
                name: userData.name || this.paraSDK.account?.name,
                language: userData.language,
                authProvider: userData.authProvider || 'para',
                isActive: userData.isActive,
                status: userData.status,
                createdAt: userData.createdAt,
                lastLoginAt: userData.lastLoginAt,
                profileImage:
                    userData.profileImage || this.paraSDK.account?.profileImage,
                walletAddress: this.paraSDK.wallet?.address,
                wallets: this.paraSDK.wallet
                    ? [
                          {
                              public_key: this.paraSDK.wallet.address,
                              type: 'para',
                              curve: 'ed25519',
                          },
                      ]
                    : undefined,
            };
        } catch (error) {
            // eslint-disable-next-line no-console
            console.error('Failed to get user:', error);
            return null;
        }
    }

    async getToken(): Promise<string | null> {
        try {
            // Proactive refresh before returning token
            await this.refreshSessionIfNeeded();

            // Return backend sessionToken if valid
            if (this.backendToken && this.isTokenValid()) {
                return this.backendToken;
            }

            // If no valid token and user is connected, try to re-import session
            if (this.paraSDK?.isConnected) {
                await this.importSessionToBackend();
                return this.backendToken;
            }

            return null;
        } catch (error) {
            // eslint-disable-next-line no-console
            console.error('Failed to get token:', error);
            return null;
        }
    }

    async isAuthenticated(): Promise<boolean> {
        if (!this.paraSDK || !this.paraSDK.isConnected) {
            return false;
        }

        const token = await this.getToken();
        return token !== null && this.isTokenValid();
    }

    isTokenValid(): boolean {
        if (!this.backendToken) {
            return false;
        }

        if (this.tokenExpiry) {
            return Date.now() < this.tokenExpiry;
        }

        // Try to decode token to check expiry
        try {
            const payload = JSON.parse(atob(this.backendToken.split('.')[1]));
            const currentTime = Date.now() / 1000;
            return payload.exp > currentTime;
        } catch {
            return false;
        }
    }

    async refreshToken(): Promise<AuthToken | null> {
        try {
            if (!this.backendToken) {
                return null;
            }

            const response = await fetch(
                `${BACKEND_CONFIG.baseURL}/auth/session/refresh`,
                {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ sessionToken: this.backendToken }),
                }
            );

            if (!response.ok) {
                return null;
            }

            const { sessionToken, expiresAt } = await response.json();

            this.backendToken = sessionToken;
            this.tokenExpiry = new Date(expiresAt).getTime();

            return {
                accessToken: sessionToken,
                expiresAt: this.tokenExpiry,
            };
        } catch (error) {
            // eslint-disable-next-line no-console
            console.error('Failed to refresh token:', error);
            return null;
        }
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
        if (!this.paraSDK?.wallet) {
            return null;
        }
        return this.paraSDK.wallet.address;
    }

    async signMessage(message: string): Promise<string> {
        if (!this.paraSDK?.wallet) {
            throw new Error('Wallet not connected');
        }

        try {
            const messageBase64 = btoa(message);
            const signature = await this.paraSDK.signMessage(
                this.paraSDK.wallet.id,
                messageBase64
            );
            return signature;
        } catch (error) {
            throw new Error(
                error instanceof Error
                    ? error.message
                    : 'Failed to sign message'
            );
        }
    }

    async signTransaction(transaction: unknown): Promise<unknown> {
        if (!this.paraSDK?.wallet) {
            throw new Error('Wallet not connected');
        }

        try {
            const signedTx = await this.paraSDK.signTransaction(
                this.paraSDK.wallet.id,
                transaction
            );
            return signedTx;
        } catch (error) {
            throw new Error(
                error instanceof Error
                    ? error.message
                    : 'Failed to sign transaction'
            );
        }
    }

    /**
     * Get current connection state (synchronous, for React reactivity)
     */
    getIsConnected(): boolean {
        return this.paraSDK?.isConnected ?? false;
    }

    /**
     * Get current account/user (synchronous, for React reactivity)
     */
    getCurrentAccount(): AuthUser | null {
        if (!this.paraSDK?.account || !this.paraSDK?.wallet) {
            return null;
        }

        // Return account data mapped to AuthUser format
        return {
            id: this.paraSDK.account.id,
            email: this.paraSDK.account.email,
            phone: this.paraSDK.account.phone,
            name: this.paraSDK.account.name,
            profileImage: this.paraSDK.account.profileImage,
            walletAddress: this.paraSDK.wallet.address,
            wallets: this.paraSDK.wallet.address
                ? [
                      {
                          public_key: this.paraSDK.wallet.address,
                          type: 'para',
                          curve: 'ed25519',
                      },
                  ]
                : undefined,
            authProvider: 'para',
        };
    }

    /**
     * Get current wallet info (synchronous, for React reactivity)
     */
    getCurrentWallet(): WalletInfo | null {
        if (!this.paraSDK?.wallet) {
            return null;
        }

        return {
            address: this.paraSDK.wallet.address,
            chain: this.paraSDK.wallet.chain,
            id: this.paraSDK.wallet.id,
        };
    }

    /**
     * Open wallet modal (for viewing wallet, switching wallets, etc.)
     * When user is already authenticated, this opens the wallet management screen
     */
    async openWalletModal(): Promise<void> {
        if (!this.paraSDK) {
            throw new Error('Para SDK not initialized');
        }

        // Check if user is connected before opening modal
        if (!this.paraSDK.isConnected) {
            throw new Error('User is not authenticated. Please login first.');
        }

        // Ensure we have the latest SDK state
        // The modal will automatically show the appropriate screen based on auth state
        // If authenticated: shows wallet management (ACCOUNT_MAIN screen)
        // If not authenticated: shows login flow
        // eslint-disable-next-line no-console
        console.log('Opening Para wallet modal (user is authenticated)');
        await this.paraSDK.openModal();
    }

    /**
     * Proactive refresh: Check if session needs refresh and refresh if needed
     */
    private async refreshSessionIfNeeded(): Promise<void> {
        if (!this.backendToken || !this.tokenExpiry) return;

        const now = Date.now();
        const timeUntilExpiry = this.tokenExpiry - now;
        const refreshThreshold = 5 * 60 * 1000; // 5 minutes before expiry

        if (timeUntilExpiry < refreshThreshold) {
            await this.refreshToken();
        }
    }

    /**
     * Start background refresh timer
     */
    private startBackgroundRefresh(): void {
        if (this.refreshTimer) {
            clearInterval(this.refreshTimer);
        }

        this.refreshTimer = setInterval(async () => {
            await this.refreshSessionIfNeeded();
        }, 60 * 1000); // Check every minute
    }

    /**
     * Get verification status from backend
     */
    async getVerificationStatus(): Promise<{
        verificationStatus: string;
        missingFields: string[];
        isVerified: boolean;
    }> {
        const token = await this.getToken();
        if (!token) {
            throw new Error('Not authenticated');
        }

        const response = await fetch(
            `${BACKEND_CONFIG.baseURL}/user/verification-status`,
            {
                method: 'GET',
                headers: {
                    Authorization: `Bearer ${token}`,
                    'Content-Type': 'application/json',
                },
            }
        );

        if (!response.ok) {
            throw new Error('Failed to get verification status');
        }

        return await response.json();
    }

    /**
     * Check if user can perform financial operations
     */
    async canPerformFinancialOperations(): Promise<boolean> {
        try {
            const status = await this.getVerificationStatus();
            return status.isVerified;
        } catch (error) {
            // eslint-disable-next-line no-console
            console.error('Failed to check verification status:', error);
            return false;
        }
    }
}
