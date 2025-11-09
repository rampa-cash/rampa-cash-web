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
import { useParaContext } from '@/lib/adapters/auth/para';

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

    // Initialize adapter
    useEffect(() => {
        const init = async () => {
            try {
                await adapter.initialize();
                const authenticated = await adapter.isAuthenticated();
                if (authenticated) {
                    const userData = await adapter.getUser();
                    setUser(userData);
                }
            } catch (error) {
                console.error('Failed to initialize auth adapter:', error);
            } finally {
                setIsInitialized(true);
            }
        };

        init();
    }, [adapter]);

    // Derived state
    const isAuthenticated = !!user;
    const isLoading = adapter.isLoading() || !isInitialized;
    const error = adapter.getError();

    // Login method
    const login = useCallback(
        async (options?: LoginOptions) => {
            try {
                adapter.clearError();
                const userData = await adapter.login(options);
                setUser(userData);
            } catch (err) {
                console.error('Login error:', err);
                throw err;
            }
        },
        [adapter]
    );

    // Logout method
    const logout = useCallback(async () => {
        try {
            adapter.clearError();
            await adapter.logout();
            setUser(null);
        } catch (err) {
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

    // Clear error
    const clearError = useCallback(() => {
        adapter.clearError();
    }, [adapter]);

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
 * Wrapper component that gets the adapter from ParaContext
 */
export const AuthProviderWrapper: React.FC<{ children: ReactNode }> = ({
    children,
}) => {
    const { adapter } = useParaContext();
    return <AuthProvider adapter={adapter}>{children}</AuthProvider>;
};

export default AuthProvider;
