/**
 * Authentication Port (Interface)
 *
 * This defines the contract that all authentication adapters must implement.
 * This allows us to switch between different authentication providers (Para, Magic, etc.)
 * without changing the rest of the application code.
 */

export interface AuthUser {
    id: string;
    email?: string;
    phone?: string;
    firstName?: string;
    lastName?: string;
    name?: string;
    language?: string;
    authProvider?: string;
    isActive?: boolean;
    status?: string;
    createdAt?: string;
    lastLoginAt?: string;
    profileImage?: string;
    walletAddress?: string;
    wallets?: Array<{
        public_key: string;
        type: string;
        curve: string;
    }>;
}

export interface AuthToken {
    accessToken: string;
    refreshToken?: string;
    expiresIn?: number;
    expiresAt?: number;
}

export interface LoginOptions {
    method?: 'google' | 'email' | 'phone' | 'custom';
    email?: string;
    phone?: string;
    customToken?: string;
    [key: string]: any;
}

export interface AuthError {
    message: string;
    code?: string;
    details?: any;
}

/**
 * Wallet information for reactive state
 */
export interface WalletInfo {
    address?: string;
    chain?: string;
    id?: string;
}

/**
 * Authentication Port Interface
 * All authentication adapters must implement this interface
 */
export interface IAuthPort {
    /**
     * Initialize the authentication provider
     */
    initialize(): Promise<void>;

    /**
     * Login with the specified method
     */
    login(options?: LoginOptions): Promise<AuthUser>;

    /**
     * Logout the current user
     */
    logout(): Promise<void>;

    /**
     * Get the current authenticated user
     */
    getUser(): Promise<AuthUser | null>;

    /**
     * Get the current authentication token
     */
    getToken(): Promise<string | null>;

    /**
     * Check if the user is authenticated
     */
    isAuthenticated(): Promise<boolean>;

    /**
     * Check if the current token is valid
     */
    isTokenValid(): boolean;

    /**
     * Refresh the authentication token
     */
    refreshToken(): Promise<AuthToken | null>;

    /**
     * Get the current loading state
     */
    isLoading(): boolean;

    /**
     * Get the current error state
     */
    getError(): AuthError | null;

    /**
     * Clear the current error state
     */
    clearError(): void;

    /**
     * Get wallet address if available
     */
    getWalletAddress(): Promise<string | null>;

    /**
     * Sign a message with the user's wallet
     */
    signMessage(message: string): Promise<string>;

    /**
     * Sign a transaction
     */
    signTransaction(transaction: any): Promise<any>;

    /**
     * Get current connection state (synchronous, for React reactivity)
     */
    getIsConnected(): boolean;

    /**
     * Get current account/user (synchronous, for React reactivity)
     */
    getCurrentAccount(): AuthUser | null;

    /**
     * Get current wallet info (synchronous, for React reactivity)
     */
    getCurrentWallet(): WalletInfo | null;

    /**
     * Open wallet modal (for viewing wallet, switching wallets, etc.)
     * This is different from login - it opens the wallet management modal
     */
    openWalletModal(): Promise<void>;
}
