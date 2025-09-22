// Application constants
export const APP_CONFIG = {
    name: 'rampa',
    description: 'Empowering families with Web3 finance',
    version: '1.0.0',
    url: 'https://www.rampa.cash',
} as const;

// API endpoints
export const API_ENDPOINTS = {
    waitlist: '/inquiry/waitlist',
    waitlistCount: '/inquiry/waitlist/count',
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
