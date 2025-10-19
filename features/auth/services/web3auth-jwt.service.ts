import {
    getLocalStorage,
    setLocalStorage,
    removeLocalStorage,
} from '@/lib/browser-utils';

// JWT Token Management Service for Web3Auth
export class Web3AuthJWTService {
    private static readonly TOKEN_KEY = 'web3auth_jwt_token';
    private static readonly TOKEN_EXPIRY_KEY = 'web3auth_jwt_expiry';

    /**
     * Store JWT token with expiration
     */
    static storeToken(token: string): void {
        try {
            // Decode token to get expiration
            const payload = JSON.parse(atob(token.split('.')[1]));
            const expiry = payload.exp * 1000; // Convert to milliseconds

            // Log token storage for debugging
            console.log('💾 Storing JWT Token:', {
                token: token.substring(0, 50) + '...', // First 50 chars for security
                expiry: new Date(expiry).toISOString(),
                payload: payload
            });

            setLocalStorage(this.TOKEN_KEY, token);
            setLocalStorage(this.TOKEN_EXPIRY_KEY, expiry.toString());
        } catch (error) {
            console.error('Failed to store Web3Auth token:', error);
        }
    }

    /**
     * Retrieve stored JWT token
     */
    static getToken(): string | null {
        try {
            const token = getLocalStorage(this.TOKEN_KEY);
            if (!token) return null;

            // Check if token is expired
            if (this.isTokenExpired()) {
                this.clearToken();
                return null;
            }

            return token;
        } catch (error) {
            console.error('Failed to get Web3Auth token:', error);
            return null;
        }
    }

    /**
     * Check if stored token is expired
     */
    static isTokenExpired(): boolean {
        try {
            const expiryStr = getLocalStorage(this.TOKEN_EXPIRY_KEY);
            if (!expiryStr) return true;

            const expiry = parseInt(expiryStr, 10);
            const now = Date.now();

            return now >= expiry;
        } catch (error) {
            console.error('Failed to check token expiry:', error);
            return true;
        }
    }

    /**
     * Check if token is valid (not expired)
     */
    static isTokenValid(): boolean {
        const token = this.getToken();
        return token !== null && !this.isTokenExpired();
    }

    /**
     * Clear stored token
     */
    static clearToken(): void {
        removeLocalStorage(this.TOKEN_KEY);
        removeLocalStorage(this.TOKEN_EXPIRY_KEY);
    }

    /**
     * Decode JWT token payload
     */
    static decodeToken(token: string): any | null {
        try {
            const payload = JSON.parse(atob(token.split('.')[1]));
            return payload;
        } catch (error) {
            console.error('Failed to decode Web3Auth token:', error);
            return null;
        }
    }

    /**
     * Get user information from token
     */
    static getUserFromToken(token: string): {
        id: string;
        email?: string;
        name?: string;
        wallets?: Array<{
            public_key: string;
            type: string;
            curve: string;
        }>;
    } | null {
        try {
            const payload = this.decodeToken(token);
            if (!payload) return null;

            return {
                id: payload.sub || payload.userId || '',
                email: payload.email,
                name: payload.name,
                wallets: payload.wallets || [],
            };
        } catch (error) {
            console.error('Failed to extract user from token:', error);
            return null;
        }
    }

    /**
     * Get wallet addresses from token
     */
    static getWalletAddresses(token: string): string[] {
        try {
            const payload = this.decodeToken(token);
            if (!payload || !payload.wallets) return [];

            return payload.wallets
                .filter(
                    (wallet: any) =>
                        wallet.type === 'web3auth_app_key' &&
                        wallet.curve === 'ed25519'
                )
                .map((wallet: any) => wallet.public_key);
        } catch (error) {
            console.error('Failed to extract wallet addresses:', error);
            return [];
        }
    }

    /**
     * Get primary wallet address (first Ed25519 wallet)
     */
    static getPrimaryWalletAddress(token: string): string | null {
        const addresses = this.getWalletAddresses(token);
        return addresses.length > 0 ? addresses[0] : null;
    }

    /**
     * Check if token is from Web3Auth
     */
    static isWeb3AuthToken(token: string): boolean {
        try {
            const payload = this.decodeToken(token);
            return payload && payload.iss === 'https://api-auth.web3auth.io';
        } catch (error) {
            return false;
        }
    }

    /**
     * Check if token needs refresh (expires in next 5 minutes)
     */
    static needsRefresh(): boolean {
        try {
            const expiryStr = getLocalStorage(this.TOKEN_EXPIRY_KEY);
            if (!expiryStr) return true;

            const expiry = parseInt(expiryStr, 10);
            const now = Date.now();
            const fiveMinutes = 5 * 60 * 1000; // 5 minutes in milliseconds

            return expiry - now < fiveMinutes;
        } catch (error) {
            console.error('Failed to check if token needs refresh:', error);
            return true;
        }
    }
}

export default Web3AuthJWTService;
