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
}

export class ParaAdapter implements IAuthPort {
    private paraSDK: ParaSDK | null = null;
    private isLoadingState: boolean = false;
    private errorState: AuthError | null = null;
    private backendToken: string | null = null;
    private tokenExpiry: number | null = null;

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

            // Check if already connected - if so, return current user
            if (
                this.paraSDK.isConnected &&
                this.paraSDK.account &&
                this.paraSDK.wallet
            ) {
                // eslint-disable-next-line no-console
                console.log('Already authenticated, returning current user');
                const currentUser = this.getCurrentAccount();
                if (currentUser) {
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

            // Get Para JWT token
            const paraJWT = await this.paraSDK.issueJWT();

            // Log Para JWT token for backend handshake
            // eslint-disable-next-line no-console
            console.log('=== Para Login - JWT Token for Backend ===');
            // eslint-disable-next-line no-console
            console.log('Para JWT Token:', paraJWT);
            // eslint-disable-next-line no-console
            console.log('==========================================');

            // Exchange Para JWT for backend token
            const backendResponse = await this.exchangeToken(paraJWT);

            // Store backend token
            this.backendToken = backendResponse.accessToken;
            if (backendResponse.expiresAt) {
                this.tokenExpiry = backendResponse.expiresAt;
            } else if (backendResponse.expiresIn) {
                this.tokenExpiry =
                    Date.now() + backendResponse.expiresIn * 1000;
            }

            // Build user object
            const user = await this.getUser();
            if (!user) {
                throw new Error('Failed to get user after login');
            }

            // Log complete user data and tokens after successful login
            // eslint-disable-next-line no-console
            console.log('=== Para Login Success - Complete User Data ===');
            // eslint-disable-next-line no-console
            console.log('User Data:', {
                id: user.id,
                email: user.email,
                phone: user.phone,
                name: user.name,
                profileImage: user.profileImage,
                walletAddress: user.walletAddress,
                wallets: user.wallets,
            });
            // eslint-disable-next-line no-console
            console.log('Para JWT Token (for backend handshake):', paraJWT);
            // eslint-disable-next-line no-console
            console.log('Backend Access Token:', this.backendToken);
            // eslint-disable-next-line no-console
            console.log('Token Expiry:', this.tokenExpiry);
            // eslint-disable-next-line no-console
            console.log('==============================================');

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

    async logout(): Promise<void> {
        try {
            this.isLoadingState = true;
            this.clearError();

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
            // Return backend token if valid
            if (this.backendToken && this.isTokenValid()) {
                return this.backendToken;
            }

            // If no valid token, try to refresh
            if (this.paraSDK?.isConnected) {
                const paraJWT = await this.paraSDK.issueJWT();
                const backendResponse = await this.exchangeToken(paraJWT);
                this.backendToken = backendResponse.accessToken;
                if (backendResponse.expiresAt) {
                    this.tokenExpiry = backendResponse.expiresAt;
                } else if (backendResponse.expiresIn) {
                    this.tokenExpiry =
                        Date.now() + backendResponse.expiresIn * 1000;
                }
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
            if (!this.paraSDK || !this.paraSDK.isConnected) {
                return null;
            }

            const paraJWT = await this.paraSDK.issueJWT();
            const backendResponse = await this.exchangeToken(paraJWT);

            this.backendToken = backendResponse.accessToken;
            if (backendResponse.expiresAt) {
                this.tokenExpiry = backendResponse.expiresAt;
            } else if (backendResponse.expiresIn) {
                this.tokenExpiry =
                    Date.now() + backendResponse.expiresIn * 1000;
            }

            return {
                accessToken: backendResponse.accessToken,
                refreshToken: backendResponse.refreshToken,
                expiresIn: backendResponse.expiresIn,
                expiresAt: this.tokenExpiry ?? undefined,
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
     * Exchange Para JWT for backend token
     */
    private async exchangeToken(paraJWT: string): Promise<{
        accessToken: string;
        refreshToken?: string;
        expiresIn?: number;
        expiresAt?: number;
    }> {
        const response = await fetch(
            `${BACKEND_CONFIG.baseURL}${API_ENDPOINTS.auth.paraValidate}`,
            {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    token: paraJWT,
                }),
            }
        );

        if (!response.ok) {
            const errorData = await response.json().catch(() => ({}));
            throw new Error(errorData.message || 'Token validation failed');
        }

        return await response.json();
    }
}
