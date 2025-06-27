import { NextApiRequest, NextApiResponse } from 'next'
import { z } from 'zod'
import { ApiErrorCode, type ApiError } from './types/api'

// Rate limiting store (in production, use Redis or similar)
const rateLimitStore = new Map<string, { count: number; resetTime: number }>()

export interface RateLimitConfig {
  windowMs: number
  maxRequests: number
  message: string
}

export const defaultRateLimit: RateLimitConfig = {
  windowMs: 15 * 60 * 1000, // 15 minutes
  maxRequests: 100,
  message: 'Too many requests, please try again later.',
}

export function rateLimit(config: RateLimitConfig = defaultRateLimit) {
  return (req: NextApiRequest, res: NextApiResponse): boolean => {
    const ip = req.headers['x-forwarded-for'] || req.socket.remoteAddress || 'unknown'
    const key = `rate_limit:${ip}`
    
    const now = Date.now()
    
    const current = rateLimitStore.get(key)
    
    if (!current || current.resetTime < now) {
      rateLimitStore.set(key, { count: 1, resetTime: now + config.windowMs })
      return true
    }
    
    if (current.count >= config.maxRequests) {
      res.setHeader('Retry-After', Math.ceil(config.windowMs / 1000))
      return false
    }
    
    current.count++
    return true
  }
}

export function validateRequest<T>(
  schema: z.ZodSchema<T>,
  req: NextApiRequest
): { success: true; data: T } | { success: false; error: string } {
  try {
    const data = schema.parse(req.body)
    return { success: true, data }
  } catch (error) {
    if (error instanceof z.ZodError) {
      const messages = error.errors.map((e: z.ZodIssue) => e.message).join(', ')
      return { success: false, error: messages }
    }
    return { success: false, error: 'Invalid request data' }
  }
}

export function createApiError(
  code: ApiErrorCode,
  message: string,
  details?: Record<string, unknown>
): ApiError {
  return { 
    code, 
    message, 
    ...(details && { details })
  }
}

export function sendApiResponse<T>(
  res: NextApiResponse,
  statusCode: number,
  data: T
): void {
  res.status(statusCode).json(data)
}

export function sendErrorResponse(
  res: NextApiResponse,
  statusCode: number,
  error: ApiError
): void {
  res.status(statusCode).json({
    success: false,
    error: error.message,
    code: error.code,
    ...(error.details && { details: error.details }),
  })
}

export function sanitizeInput(input: string): string {
  return input
    .trim()
    .replace(/[<>]/g, '') // Remove potential HTML tags
    .slice(0, 1000) // Limit length
}

export function validateEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailRegex.test(email)
}

export function validateSolanaAddress(address: string): boolean {
  // Basic Solana address validation (base58, 32-44 characters)
  const addressRegex = /^[1-9A-HJ-NP-Za-km-z]{32,44}$/
  return addressRegex.test(address)
}

// CORS middleware
export function corsMiddleware(req: NextApiRequest, res: NextApiResponse): void {
  res.setHeader('Access-Control-Allow-Origin', process.env.ALLOWED_ORIGINS || '*')
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS')
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization')
  
  if (req.method === 'OPTIONS') {
    res.status(200).end()
  }
}

// Authentication middleware (basic implementation)
export function requireAuth(
  req: NextApiRequest,
  res: NextApiResponse
): boolean {
  const authHeader = req.headers.authorization
  
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    sendErrorResponse(
      res,
      401,
      createApiError(ApiErrorCode.AUTHENTICATION_ERROR, 'Authentication required')
    )
    return false
  }
  
  // In production, validate JWT token here
  const token = authHeader.substring(7)
  
  // Placeholder validation - replace with actual JWT validation
  if (!token || token.length < 10) {
    sendErrorResponse(
      res,
      401,
      createApiError(ApiErrorCode.AUTHENTICATION_ERROR, 'Invalid token')
    )
    return false
  }
  
  return true
} 