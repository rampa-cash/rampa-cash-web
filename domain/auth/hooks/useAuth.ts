/**
 * Authentication Hooks
 *
 * Provides convenient hooks for accessing authentication functionality
 */

import { useAuth as useAuthContext } from '../contexts/AuthContext';
import type { LoginOptions } from '../ports/auth.port';

/**
 * Main authentication hook
 * Provides full access to authentication state and methods
 */
export const useAuth = () => {
    return useAuthContext();
};

/**
 * Hook for authentication status only
 */
export const useAuthStatus = () => {
    const { isAuthenticated, isLoading } = useAuthContext();
    return { isAuthenticated, isLoading };
};

/**
 * Hook for user information only
 */
export const useUser = () => {
    const { user, isLoading } = useAuthContext();
    return { user, isLoading };
};

/**
 * Hook for authentication actions only
 */
export const useAuthActions = () => {
    const { login, logout, error, clearError } = useAuthContext();
    return { login, logout, error, clearError };
};

/**
 * Hook for token management only
 */
export const useToken = () => {
    const { getToken, isTokenValid, refreshToken } = useAuthContext();
    return { getToken, isTokenValid, refreshToken };
};

/**
 * Hook for wallet operations
 */
export const useWallet = () => {
    const { getWalletAddress, signMessage, signTransaction, user } =
        useAuthContext();
    return {
        getWalletAddress,
        signMessage,
        signTransaction,
        walletAddress: user?.walletAddress,
    };
};

export default useAuth;
