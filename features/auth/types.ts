export interface User {
    id: string;
    email: string;
    phone?: string;
    firstName: string;
    lastName: string;
    language: 'en' | 'es';
    authProvider: 'google' | 'apple' | 'web3auth' | 'phantom' | 'solflare';
    authProviderId: string;
    isActive: boolean;
    status: 'active' | 'suspended';
    createdAt: string;
    updatedAt: string;
    lastLoginAt?: string;
}

export interface SignupRequest {
    authProvider: 'google' | 'apple' | 'web3auth';
    authProviderId: string;
    firstName: string;
    lastName: string;
    email: string;
    phone?: string;
    language?: 'en' | 'es';
}

export interface LoginRequest {
    authProvider: 'google' | 'apple' | 'web3auth' | 'phantom' | 'solflare';
    authProviderId: string;
    walletAddress?: string;
}

export interface AuthResponse {
    user: User;
    accessToken: string;
    refreshToken: string;
    expiresIn: number;
    userId: string;
    email: string;
    firstName: string;
    lastName: string;
    language: 'en' | 'es';
    authProvider: string;
    isActive: boolean;
}

export interface UserProfile {
    id: string;
    email: string;
    firstName: string;
    lastName: string;
    language: 'en' | 'es';
    authProvider: string;
    isActive: boolean;
    status: string;
    createdAt: string;
    lastLoginAt?: string;
}

export interface LoginCredentials {
    email: string;
    password: string;
}

export interface SignupData {
    firstName: string;
    lastName: string;
    email: string;
    password: string;
    language?: 'en' | 'es';
}

export interface Web3AuthResponse extends AuthResponse {
    walletAddress: string;
}

export interface AuthState {
    user: User | null;
    isLoading: boolean;
    error: string | null;
    isAuthenticated: boolean;
}

export interface LoginFormProps {
    onSuccess?: (response: AuthResponse) => void;
    onError?: (error: string) => void;
    className?: string;
}

export interface SignupFormProps {
    onSuccess?: (response: AuthResponse) => void;
    onError?: (error: string) => void;
    className?: string;
}

export interface AuthProviderProps {
    children: React.ReactNode;
}
