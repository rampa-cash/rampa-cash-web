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

// Solana Transfer API Schemas
export const SolanaTransferRequestSchema = z.object({
  recipientAddress: z.string().min(32, 'Invalid recipient address'),
  amount: z.number().positive('Amount must be positive'),
})

export const SolanaTransferResponseSchema = BaseApiResponseSchema.extend({
  signature: z.string().optional(),
})

// WhatsApp API Schemas
export const WhatsAppMessageRequestSchema = z.object({
  to: z.string(),
  message: z.string().min(1, 'Message cannot be empty'),
})

export const WhatsAppMessageResponseSchema = BaseApiResponseSchema.extend({
  messageId: z.string().optional(),
})

// Type exports
export type BaseApiResponse = z.infer<typeof BaseApiResponseSchema>
export type WaitlistRequest = z.infer<typeof WaitlistRequestSchema>
export type WaitlistResponse = z.infer<typeof WaitlistResponseSchema>
export type SolanaTransferRequest = z.infer<typeof SolanaTransferRequestSchema>
export type SolanaTransferResponse = z.infer<typeof SolanaTransferResponseSchema>
export type WhatsAppMessageRequest = z.infer<typeof WhatsAppMessageRequestSchema>
export type WhatsAppMessageResponse = z.infer<typeof WhatsAppMessageResponseSchema>

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