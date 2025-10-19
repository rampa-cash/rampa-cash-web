import React, {
    createContext,
    useContext,
    useEffect,
    useState,
    ReactNode,
} from 'react';
import {
    useWeb3AuthUser,
    useWeb3AuthConnect,
    useWeb3AuthDisconnect,
} from '@web3auth/modal/react';
import { useIdentityToken } from '@web3auth/modal/react';
import { FEATURE_FLAGS } from '@/lib/constants';
import { Web3AuthJWTService } from '../services/web3auth-jwt.service';

// Types
interface Web3AuthUser {
    id: string;
    email?: string;
    firstName?: string;
    lastName?: string;
    language?: string;
    authProvider?: string;
    isActive?: boolean;
    status?: string;
    createdAt?: string;
    lastLoginAt?: string;
    name?: string;
    profileImage?: string;
    wallets?: Array<{
        public_key: string;
        type: string;
        curve: string;
    }>;
}

interface Web3AuthContextType {
    // User state
    user: Web3AuthUser | null;
    isAuthenticated: boolean;
    isLoading: boolean;

    // Authentication methods
    login: () => Promise<void>;
    logout: () => Promise<void>;

    // Token management
    getToken: () => Promise<string | null>;
    isTokenValid: () => boolean;

    // Error handling
    error: string | null;
    clearError: () => void;
}

// Create context
const Web3AuthContext = createContext<Web3AuthContextType | undefined>(
    undefined
);

// Provider component
interface Web3AuthProviderProps {
    children: ReactNode;
}

export const Web3AuthProvider: React.FC<Web3AuthProviderProps> = ({
    children,
}) => {
    // Web3Auth hooks
    const { userInfo: web3AuthUser } = useWeb3AuthUser();
    const { connect, loading: isConnecting } = useWeb3AuthConnect();
    const { disconnect } = useWeb3AuthDisconnect();
    const {
        getIdentityToken,
        token,
        loading: isTokenLoading,
    } = useIdentityToken();

    // Local state
    const [user, setUser] = useState<Web3AuthUser | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [isInitialized, setIsInitialized] = useState(false);

    // Derived state
    const isAuthenticated = !!web3AuthUser && !!user;
    const isLoading = isConnecting || isTokenLoading || !isInitialized;

    // Initialize user data when Web3Auth user changes
    useEffect(() => {
        if (web3AuthUser) {
            const userData: Web3AuthUser = {
                id: web3AuthUser.userId || '',
                email: web3AuthUser.email,
                name: web3AuthUser.name,
                profileImage: web3AuthUser.profileImage,
                wallets: [],
            };
            setUser(userData);
            setError(null);
        } else {
            setUser(null);
        }
        setIsInitialized(true);
    }, [web3AuthUser]);

    // Login method
    const login = async (): Promise<void> => {
        try {
            setError(null);
            const provider = await connect();
            if (!provider) {
                throw new Error('Failed to connect to Web3Auth');
            }

            // Get Web3Auth JWT token
            const web3AuthToken = await getIdentityToken();
            if (!web3AuthToken) {
                throw new Error('Failed to get Web3Auth token');
            }

            // Log Web3Auth token for debugging
            console.log('🔐 Web3Auth Identity Token:', web3AuthToken);

            // Call backend to exchange Web3Auth token for our JWT
            const response = await fetch(
                `${process.env.NEXT_PUBLIC_BACKEND_URL}/auth/web3auth/validate`,
                {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        token: web3AuthToken,
                    }),
                }
            );

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || 'Token validation failed');
            }

            const { accessToken, user: backendUser } = await response.json();

            // Log backend access token for debugging
            console.log('🎫 Backend Access Token:', accessToken);
            console.log('👤 Backend User Data:', backendUser);

            // Store our backend JWT token securely
            Web3AuthJWTService.storeToken(accessToken);

            // Store user data in context state
            setUser({
                id: backendUser.id,
                email: backendUser.email,
                firstName: backendUser.firstName,
                lastName: backendUser.lastName,
                language: backendUser.language,
                authProvider: backendUser.authProvider,
                isActive: backendUser.isActive,
                status: backendUser.status,
                createdAt: backendUser.createdAt,
                lastLoginAt: backendUser.lastLoginAt,
            });

            // Log successful login completion
            console.log('✅ Web3Auth Login Successful!', {
                userId: backendUser.id,
                email: backendUser.email,
                authProvider: backendUser.authProvider,
                loginTime: new Date().toISOString()
            });

            // User data will be set by the useEffect above
        } catch (err) {
            const errorMessage =
                err instanceof Error ? err.message : 'Login failed';
            setError(errorMessage);
            console.error('Web3Auth login error:', err);
            throw err;
        }
    };

    // Logout method
    const logout = async (): Promise<void> => {
        try {
            setError(null);

            // 1. Clear all stored tokens from localStorage
            Web3AuthJWTService.clearToken();

            // 2. Disconnect Web3Auth session
            await disconnect();

            // 3. Clear user state
            setUser(null);
        } catch (err) {
            const errorMessage =
                err instanceof Error ? err.message : 'Logout failed';
            setError(errorMessage);
            console.error('Web3Auth logout error:', err);

            // Even if there's an error, clear frontend state
            Web3AuthJWTService.clearToken();
            setUser(null);
            throw err;
        }
    };

    // Get JWT token
    const getToken = async (): Promise<string | null> => {
        try {
            if (!isAuthenticated) {
                return null;
            }

            // If we already have a token, return it
            if (token) {
                return token;
            }

            // Otherwise, get a new token
            const newToken = await getIdentityToken();
            return newToken;
        } catch (err) {
            console.error('Failed to get Web3Auth token:', err);
            setError('Failed to get authentication token');
            return null;
        }
    };

    // Check if token is valid
    const isTokenValid = (): boolean => {
        if (!token) return false;

        try {
            // Decode JWT to check expiration
            const payload = JSON.parse(atob(token.split('.')[1]));
            const currentTime = Date.now() / 1000;
            return payload.exp > currentTime;
        } catch {
            return false;
        }
    };

    // Clear error
    const clearError = (): void => {
        setError(null);
    };

    // Context value
    const contextValue: Web3AuthContextType = {
        user,
        isAuthenticated,
        isLoading,
        login,
        logout,
        getToken,
        isTokenValid,
        error,
        clearError,
    };

    // Don't render if feature is disabled
    if (!FEATURE_FLAGS.showLoginButton) {
        return <>{children}</>;
    }

    return (
        <Web3AuthContext.Provider value={contextValue}>
            {children}
        </Web3AuthContext.Provider>
    );
};

// Hook to use Web3Auth context
export const useWeb3Auth = (): Web3AuthContextType => {
    const context = useContext(Web3AuthContext);
    if (context === undefined) {
        throw new Error('useWeb3Auth must be used within a Web3AuthProvider');
    }
    return context;
};

export default Web3AuthProvider;
