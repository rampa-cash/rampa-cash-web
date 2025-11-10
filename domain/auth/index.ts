// Port (Interface)
export type {
    IAuthPort,
    AuthUser,
    AuthToken,
    LoginOptions,
    AuthError,
} from './interfaces/authentication-service.interface';

// Adapters (infrastructure layer)
// Note: Adapters are in lib/adapters/auth/ to separate infrastructure from domain
export {
    ParaAdapter,
    ParaContextProvider,
    useParaContext,
    getParaConfig,
} from '@/lib/adapters/auth/para';

// API Client
export { AuthApiClient, apiClient } from './services/api-client';

// Services
export { AuthService } from './services/auth.service';

// Hooks
export {
    useAuth,
    useAuthStatus,
    useUser,
    useAuthActions,
    useToken,
    useWallet,
} from './hooks/useAuth';

// Context
export {
    AuthProvider,
    AuthProviderWrapper,
    useAuth as useAuthContext,
} from './contexts/AuthContext';

// Guards
export {
    AuthGuard,
    withAuth,
    useRequiresAuth,
    useRedirectsAuth,
} from './guards/AuthGuard';

// Types (legacy - for backward compatibility)
export type {
    User,
    SignupRequest,
    LoginRequest,
    AuthResponse,
    UserProfile,
    LoginCredentials,
    SignupData,
    AuthState,
} from './types';
