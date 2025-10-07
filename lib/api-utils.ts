import { NextApiRequest, NextApiResponse } from 'next';
import { z } from 'zod';
import { RATE_LIMIT_CONFIG } from './constants';

// Rate limiting store (in production, use Redis or similar)
const rateLimitStore = new Map<string, { count: number; resetTime: number }>();

export interface RateLimitConfig {
    windowMs: number;
    maxRequests: number;
    message: string;
}

export const rateLimit = (config: RateLimitConfig = RATE_LIMIT_CONFIG) => {
    return (req: NextApiRequest, res: NextApiResponse): boolean => {
        const ip =
            req.headers['x-forwarded-for'] ??
            req.socket.remoteAddress ??
            'unknown';
        const key = `rate_limit:${ip}`;

        const now = Date.now();
        const current = rateLimitStore.get(key);

        if (!current || current.resetTime < now) {
            rateLimitStore.set(key, {
                count: 1,
                resetTime: now + config.windowMs,
            });
            return true;
        }

        if (current.count >= config.maxRequests) {
            res.setHeader('Retry-After', Math.ceil(config.windowMs / 1000));
            return false;
        }

        current.count++;
        return true;
    };
};

export const validateRequest = <T>(
    schema: z.ZodSchema<T>,
    req: NextApiRequest
): { success: true; data: T } | { success: false; error: string } => {
    try {
        const data = schema.parse(req.body);
        return { success: true, data };
    } catch (error) {
        if (error instanceof z.ZodError) {
            const messages = error.errors
                .map((e: z.ZodIssue) => e.message)
                .join(', ');
            return { success: false, error: messages };
        }
        return { success: false, error: 'Invalid request data' };
    }
};

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
    code: ApiErrorCode;
    message: string;
    details?: Record<string, unknown>;
}

export const createApiError = (
    code: ApiErrorCode,
    message: string,
    details?: Record<string, unknown>
): ApiError => {
    return {
        code,
        message,
        ...(details && { details }),
    };
};

export const sendApiResponse = <T>(
    res: NextApiResponse,
    statusCode: number,
    data: T
): void => {
    res.status(statusCode).json(data);
};

export const sendErrorResponse = (
    res: NextApiResponse,
    statusCode: number,
    error: ApiError
): void => {
    res.status(statusCode).json({
        success: false,
        error: error.message,
        code: error.code,
        ...(error.details && { details: error.details }),
    });
};

// CORS middleware
export const corsMiddleware = (
    req: NextApiRequest,
    res: NextApiResponse
): void => {
    res.setHeader(
        'Access-Control-Allow-Origin',
        process.env.ALLOWED_ORIGINS ?? '*'
    );
    res.setHeader(
        'Access-Control-Allow-Methods',
        'GET, POST, PUT, DELETE, OPTIONS'
    );
    res.setHeader(
        'Access-Control-Allow-Headers',
        'Content-Type, Authorization'
    );

    // Handle preflight requests
    if (req.method === 'OPTIONS') {
        res.status(200).end();
        return;
    }
};

// Authentication middleware (basic implementation)
export const requireAuth = (
    req: NextApiRequest,
    res: NextApiResponse
): boolean => {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        sendErrorResponse(
            res,
            401,
            createApiError(
                ApiErrorCode.AUTHENTICATION_ERROR,
                'Authentication required'
            )
        );
        return false;
    }

    // In production, validate JWT token here
    const token = authHeader.substring(7);

    // Placeholder validation - replace with actual JWT validation
    if (!token || token.length < 10) {
        sendErrorResponse(
            res,
            401,
            createApiError(ApiErrorCode.AUTHENTICATION_ERROR, 'Invalid token')
        );
        return false;
    }

    return true;
};
