// Application constants
export const APP_CONFIG = {
    name: 'rampa',
    description: 'Empowering families with Web3 finance',
    version: '1.0.0',
    url: 'https://www.rampa.cash',
} as const;

// Backend configuration
export const BACKEND_CONFIG = {
    baseURL: process.env.NEXT_PUBLIC_BACKEND_URL ?? 'https://api-rampa-cash-test.up.railway.app',
} as const;

// API endpoints
export const API_ENDPOINTS = {
    waitlist: '/inquiry/waitlist',
    auth: {
        signup: '/auth/signup',
        login: '/auth/login',
        refresh: '/auth/refresh',
        me: '/auth/me',
        verifyEmail: '/auth/verify-email',
        resendVerification: '/auth/resend-verification',
        forgotPassword: '/auth/forgot-password',
        resetPassword: '/auth/reset-password',
        logout: '/auth/logout',
        web3authValidate: '/auth/web3auth/validate',
    },
    wallet: {
        create: '/wallet',
        get: '/wallet',
        update: '/wallet',
        delete: '/wallet',
        balance: '/wallet/balance',
        balances: '/wallet/balances',
        connect: '/wallet/connect',
        transfer: '/wallet/transfer',
        suspend: '/wallet/suspend',
        activate: '/wallet/activate',
    },
    transactions: {
        list: '/transactions',
        create: '/transactions',
        sent: '/transactions/sent',
        received: '/transactions/received',
        pending: '/transactions/pending',
        stats: '/transactions/stats/summary',
        get: '/transactions',
        confirm: '/transactions',
        cancel: '/transactions',
    },
    contacts: {
        list: '/contacts',
        create: '/contacts',
        appUsers: '/contacts/app-users',
        nonAppUsers: '/contacts/non-app-users',
        search: '/contacts/search',
        stats: '/contacts/stats',
        sync: '/contacts/sync',
        byEmail: '/contacts/by-email',
        byPhone: '/contacts/by-phone',
        byWallet: '/contacts/by-wallet',
        get: '/contacts',
        update: '/contacts',
        delete: '/contacts',
    },
    onramp: {
        initiate: '/onramp/initiate',
        list: '/onramp',
        pending: '/onramp/pending',
        stats: '/onramp/stats/summary',
        get: '/onramp',
        process: '/onramp',
        fail: '/onramp',
        byProvider: '/onramp/providers',
    },
    offramp: {
        initiate: '/offramp/initiate',
        list: '/offramp',
        pending: '/offramp/pending',
        stats: '/offramp/stats/summary',
        get: '/offramp',
        process: '/offramp',
        fail: '/offramp',
        byProvider: '/offramp/providers',
    },
    visaCard: {
        get: '/visa-card',
        create: '/visa-card',
        all: '/visa-card/all',
        byStatus: '/visa-card/by-status',
        expired: '/visa-card/expired',
        stats: '/visa-card/stats',
        getById: '/visa-card',
        update: '/visa-card',
        activate: '/visa-card',
        suspend: '/visa-card',
        reactivate: '/visa-card',
        cancel: '/visa-card',
        updateBalance: '/visa-card',
        checkLimits: '/visa-card',
    },
} as const;

// Rate limiting configuration
export const RATE_LIMIT_CONFIG = {
    windowMs: 15 * 60 * 1000, // 15 minutes
    maxRequests: 100,
    message: 'Too many requests, please try again later.',
} as const;

// Validation limits
export const VALIDATION_LIMITS = {
    maxNameLength: 100,
    maxEmailLength: 255,
    maxInputLength: 1000,
} as const;

// Environment
export const ENV = {
    isDevelopment: process.env.NODE_ENV === 'development',
    isProduction: process.env.NODE_ENV === 'production',
} as const;

// Feature flags
export const FEATURE_FLAGS = {
    showLoginButton: process.env.NEXT_PUBLIC_SHOW_LOGIN_BUTTON === 'true',
} as const;
