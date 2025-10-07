// API Client
export { AuthApiClient } from './api-client';

// Services
export { AuthService } from './services/auth.service';
export { Web3AuthJWTService } from './services/web3auth-jwt.service';
export { Web3AuthApiClient, apiClient } from './services/api-client';

// Hooks
export { useAuth } from './hooks/useAuth';
export {
    useWeb3Auth,
    useUser,
    useAuthActions,
    useToken,
} from './hooks/useWeb3Auth';

// Context
export { Web3AuthProvider } from './contexts/Web3AuthContext';

// Guards
export {
    AuthGuard,
    withAuth,
    useRequiresAuth,
    useRedirectsAuth,
} from './guards/AuthGuard';

// Utils
export { Web3AuthErrorHandler } from './utils/web3auth-error-handler';

// Config
export { web3AuthConfig } from './config/web3auth.config';

// Types
export type {
    User,
    SignupRequest,
    LoginRequest,
    AuthResponse,
    UserProfile,
    LoginCredentials,
    SignupData,
    Web3AuthResponse,
    AuthState,
} from './types';
