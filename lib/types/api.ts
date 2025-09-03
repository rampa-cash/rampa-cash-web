import { z } from 'zod'

// Base API Response Schema
export const BaseApiResponseSchema = z.object({
    success: z.boolean(),
    message: z.string().optional(),
    error: z.string().optional(),
})

// Waitlist API Schemas
export const WaitlistRequestSchema = z.object({
    name: z.string().min(1, 'Name is required'),
    email: z.string().email('Please enter a valid email address'),
})

export const WaitlistResponseSchema = BaseApiResponseSchema.extend({
    count: z.number().optional(),
})



// Type exports
export type BaseApiResponse = z.infer<typeof BaseApiResponseSchema>
export type WaitlistRequest = z.infer<typeof WaitlistRequestSchema>
export type WaitlistResponse = z.infer<typeof WaitlistResponseSchema>



// API Error Types
export enum ApiErrorCode {
    VALIDATION_ERROR = 'VALIDATION_ERROR',
    AUTHENTICATION_ERROR = 'AUTHENTICATION_ERROR',
    AUTHORIZATION_ERROR = 'AUTHORIZATION_ERROR',
    NOT_FOUND = 'NOT_FOUND',
    INTERNAL_ERROR = 'INTERNAL_ERROR',
    RATE_LIMIT_EXCEEDED = 'RATE_LIMIT_EXCEEDED',
}

export interface ApiError {
    code: ApiErrorCode
    message: string
    details?: Record<string, unknown>
}

// Rate Limiting Types
export interface RateLimitConfig {
    windowMs: number
    maxRequests: number
    message: string
}

// Authentication Types
export interface AuthUser {
    id: string
    email: string
    role: 'user' | 'admin'
}

export interface AuthContext {
    user: AuthUser | null
    isAuthenticated: boolean
} 