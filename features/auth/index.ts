// API Client
export { AuthApiClient } from './api-client'

// Services
export { AuthService } from './services/auth.service'

// Hooks
export { useAuth } from './hooks/useAuth'

// Config
export { web3AuthConfig } from './config/web3auth.config'

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
} from './types'
