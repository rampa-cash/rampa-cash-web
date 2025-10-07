import { useWeb3Auth as useWeb3AuthContext } from '../contexts/Web3AuthContext';

/**
 * Custom hook that provides Web3Auth functionality
 * This is a clean API wrapper around the Web3Auth context
 *
 * @returns Web3Auth context with user state and authentication methods
 */
export const useWeb3Auth = () => {
    return useWeb3AuthContext();
};

/**
 * Hook for authentication status
 * @returns boolean indicating if user is authenticated
 */
export const useAuth = () => {
    const { isAuthenticated, isLoading } = useWeb3AuthContext();
    return { isAuthenticated, isLoading };
};

/**
 * Hook for user information
 * @returns user data and loading state
 */
export const useUser = () => {
    const { user, isLoading } = useWeb3AuthContext();
    return { user, isLoading };
};

/**
 * Hook for authentication actions
 * @returns login, logout, and error handling methods
 */
export const useAuthActions = () => {
    const { login, logout, error, clearError } = useWeb3AuthContext();
    return { login, logout, error, clearError };
};

/**
 * Hook for token management
 * @returns token-related methods
 */
export const useToken = () => {
    const { getToken, isTokenValid } = useWeb3AuthContext();
    return { getToken, isTokenValid };
};

export default useWeb3Auth;
