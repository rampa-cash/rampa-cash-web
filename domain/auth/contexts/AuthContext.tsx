/**
 * Authentication Context
 *
 * Uses the Port and Adapter pattern to provide authentication functionality
 * without being tied to a specific implementation
 */

'use client';

import React, {
    createContext,
    useContext,
    useEffect,
    useState,
    ReactNode,
    useCallback,
} from 'react';
import {
    IAuthPort,
    AuthUser,
    LoginOptions,
    AuthError,
} from '../interfaces/authentication-service.interface';
import { FEATURE_FLAGS } from '@/lib/constants';
import { setTokenRefreshFunction } from '@/lib/api-client';

interface VerificationStatus {
    verificationStatus: string;
    missingFields: string[];
    isVerified: boolean;
}

interface AuthContextType {
    // User state
    user: AuthUser | null;
    isAuthenticated: boolean;
    isLoading: boolean;
    error: AuthError | null;

    // Authentication methods
    login: (options?: LoginOptions) => Promise<void>;
    logout: () => Promise<void>;
    refreshToken: () => Promise<void>;

    // Token management
    getToken: () => Promise<string | null>;
    isTokenValid: () => boolean;

    // Wallet operations
    getWalletAddress: () => Promise<string | null>;
    signMessage: (message: string) => Promise<string>;
    signTransaction: (transaction: any) => Promise<any>;
    openWalletModal: () => Promise<void>;

    // Verification status
    verificationStatus: VerificationStatus | null;
    isVerified: boolean;
    getVerificationStatus: () => Promise<VerificationStatus>;
    refreshVerificationStatus: () => Promise<void>;
    canPerformFinancialOperations: () => Promise<boolean>;

    // Error handling
    clearError: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
    children: ReactNode;
    adapter: IAuthPort;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({
    children,
    adapter,
}) => {
    const [user, setUser] = useState<AuthUser | null>(null);
    const [isInitialized, setIsInitialized] = useState(false);
    const [verificationStatus, setVerificationStatus] =
        useState<VerificationStatus | null>(null);

    // Initialize adapter (only once)
    useEffect(() => {
        const init = async () => {
            try {
                await adapter.initialize();
            } catch (error) {
                // eslint-disable-next-line no-console
                console.error('Failed to initialize auth adapter:', error);
            } finally {
                setIsInitialized(true);
            }
        };

        if (!isInitialized) {
            void init();
        }
    }, [adapter, isInitialized]);

    // Set token refresh function for api-client (reactive refresh on 401)
    useEffect(() => {
        setTokenRefreshFunction(async () => {
            try {
                await adapter.refreshToken();
                return await adapter.getToken();
            } catch (error) {
                // eslint-disable-next-line no-console
                console.error('Failed to refresh token in api-client:', error);
                return null;
            }
        });
    }, [adapter]);

    // Sync user state with adapter's reactive state
    // Use a ref to track previous state and avoid unnecessary updates
    const prevStateRef = React.useRef<{
        isConnected: boolean;
        accountId: string | null;
    }>({ isConnected: false, accountId: null });

    // Sync function that can be called immediately or on interval
    const syncUser = React.useCallback((): void => {
        const isConnected = adapter.getIsConnected();
        const currentAccount = adapter.getCurrentAccount();
        const currentAccountId = currentAccount?.id ?? null;

        // Only update if state actually changed
        if (
            prevStateRef.current.isConnected === isConnected &&
            prevStateRef.current.accountId === currentAccountId
        ) {
            return; // No change, skip update
        }

        // Update ref
        prevStateRef.current = {
            isConnected,
            accountId: currentAccountId,
        };

        // Update user state
        if (isConnected && currentAccount) {
            // Use adapter's current account directly (don't call backend API here to avoid rate limiting)
            setUser(currentAccount);
        } else {
            setUser(null);
        }
    }, [adapter]);

    useEffect(() => {
        if (!isInitialized) {
            return;
        }

        // Initial sync
        syncUser();

        // Poll for changes (reduced frequency to avoid rate limiting)
        const interval = setInterval(syncUser, 1000); // Check every 1 second instead of 200ms

        return () => clearInterval(interval);
    }, [isInitialized, syncUser]);

    // Derived state - use adapter's reactive state
    // Call getIsConnected() on every render to get latest state
    const isConnected = adapter.getIsConnected();
    const isAuthenticated = isConnected && !!user;
    const isLoading = adapter.isLoading() || !isInitialized;
    const error = adapter.getError();

    // Login method
    const login = useCallback(
        async (options?: LoginOptions) => {
            try {
                adapter.clearError();
                const userData = await adapter.login(options);
                setUser(userData);

                // Force immediate state sync after login
                // Wait a bit for Para SDK to update its internal state, then sync
                setTimeout(() => {
                    syncUser();
                }, 300);
            } catch (err) {
                // eslint-disable-next-line no-console
                console.error('Login error:', err);
                throw err;
            }
        },
        [adapter, syncUser]
    );

    // Logout method - use adapter's logout which handles Para logout
    const logout = useCallback(async () => {
        try {
            adapter.clearError();
            // Adapter's logout method handles Para logout internally
            await adapter.logout();
            setUser(null);
        } catch (err) {
            // eslint-disable-next-line no-console
            console.error('Logout error:', err);
            // Still clear local state even if logout fails
            setUser(null);
            throw err;
        }
    }, [adapter]);

    // Refresh token
    const refreshToken = useCallback(async () => {
        try {
            adapter.clearError();
            await adapter.refreshToken();
            // Refresh user data
            const userData = await adapter.getUser();
            setUser(userData);
        } catch (err) {
            // eslint-disable-next-line no-console
            console.error('Token refresh error:', err);
            setUser(null);
            throw err;
        }
    }, [adapter]);

    // Get token
    const getToken = useCallback(async () => {
        return await adapter.getToken();
    }, [adapter]);

    // Check token validity
    const isTokenValid = useCallback(() => {
        return adapter.isTokenValid();
    }, [adapter]);

    // Get wallet address
    const getWalletAddress = useCallback(async () => {
        return await adapter.getWalletAddress();
    }, [adapter]);

    // Sign message
    const signMessage = useCallback(
        async (message: string) => {
            return await adapter.signMessage(message);
        },
        [adapter]
    );

    // Sign transaction
    const signTransaction = useCallback(
        async (transaction: any) => {
            return await adapter.signTransaction(transaction);
        },
        [adapter]
    );

    // Open wallet modal
    const openWalletModal = useCallback(async () => {
        try {
            await adapter.openWalletModal();
        } catch (err) {
            // eslint-disable-next-line no-console
            console.error('Failed to open wallet modal:', err);
            throw err;
        }
    }, [adapter]);

    // Clear error
    const clearError = useCallback(() => {
        adapter.clearError();
    }, [adapter]);

    // Get verification status
    const getVerificationStatus =
        useCallback(async (): Promise<VerificationStatus> => {
            // Check if adapter has getVerificationStatus method
            if (typeof (adapter as any).getVerificationStatus === 'function') {
                const status = await (adapter as any).getVerificationStatus();
                setVerificationStatus(status);
                return status;
            }
            throw new Error('Verification status not supported by adapter');
        }, [adapter]);

    // Refresh verification status
    const refreshVerificationStatus = useCallback(async () => {
        await getVerificationStatus();
    }, [getVerificationStatus]);

    // Check if can perform financial operations
    const canPerformFinancialOperations =
        useCallback(async (): Promise<boolean> => {
            // Check if adapter has canPerformFinancialOperations method
            if (
                typeof (adapter as any).canPerformFinancialOperations ===
                'function'
            ) {
                return await (adapter as any).canPerformFinancialOperations();
            }
            // Fallback: check verification status
            try {
                const status = await getVerificationStatus();
                return status.isVerified;
            } catch {
                return false;
            }
        }, [adapter, getVerificationStatus]);

    // Poll verification status after login
    useEffect(() => {
        if (!isAuthenticated) {
            setVerificationStatus(null);
            return;
        }

        // Initial fetch
        const fetchStatus = async () => {
            try {
                await getVerificationStatus();
            } catch (error) {
                // eslint-disable-next-line no-console
                console.error('Failed to fetch verification status:', error);
            }
        };

        fetchStatus();

        // Poll every 30 seconds
        const interval = setInterval(fetchStatus, 30000);

        return () => clearInterval(interval);
    }, [isAuthenticated, getVerificationStatus]);

    // Derived verification state
    const isVerified = verificationStatus?.isVerified ?? false;

    // Context value
    const contextValue: AuthContextType = {
        user,
        isAuthenticated,
        isLoading,
        error,
        login,
        logout,
        refreshToken,
        getToken,
        isTokenValid,
        getWalletAddress,
        signMessage,
        signTransaction,
        openWalletModal,
        verificationStatus,
        isVerified,
        getVerificationStatus,
        refreshVerificationStatus,
        canPerformFinancialOperations,
        clearError,
    };

    // Don't render if feature is disabled
    if (!FEATURE_FLAGS.showLoginButton) {
        return <>{children}</>;
    }

    return (
        <AuthContext.Provider value={contextValue}>
            {children}
        </AuthContext.Provider>
    );
};

// Hook to use auth context
export const useAuth = (): AuthContextType => {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within AuthProvider');
    }
    return context;
};

/**
 * Wrapper component that accepts an adapter instance
 * The adapter should be created by AuthProviderFactory
 */
export const AuthProviderWrapper: React.FC<{
    children: ReactNode;
    adapter: IAuthPort;
}> = ({ children, adapter }) => {
    return <AuthProvider adapter={adapter}>{children}</AuthProvider>;
};

export default AuthProvider;
