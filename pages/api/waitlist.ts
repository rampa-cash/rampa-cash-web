import type { NextApiRequest, NextApiResponse } from 'next';
import {
    validateRequest,
    sendApiResponse,
    sendErrorResponse,
    createApiError,
    rateLimit,
    corsMiddleware
} from '../../lib/api-utils';
import { ApiErrorCode } from '../../lib/api-utils';
import { type WaitlistResponse, waitlistRequestSchema } from '../../lib/validators';
import { addToWaitlist, getWaitlistCount } from '../../lib/waitlist-storage-production';

const handler = async (
    req: NextApiRequest,
    res: NextApiResponse<WaitlistResponse>
): Promise<void> => {
    // Handle CORS first
    corsMiddleware(req, res);

    // If it's an OPTIONS request, CORS middleware already handled it
    if (req.method === 'OPTIONS') {
        return;
    }

    // Apply rate limiting
    const rateLimitCheck = rateLimit({
        windowMs: 15 * 60 * 1000, // 15 minutes
        maxRequests: 10, // 10 requests per 15 minutes for waitlist
        message: 'Too many waitlist requests, please try again later.',
    });

    if (!rateLimitCheck(req, res)) {
        return;
    }

    console.log('🔍 Waitlist API called');
    console.log('Environment:', process.env.NODE_ENV);
    console.log('Method:', req.method);
    console.log('Body:', req.body);

    if (req.method !== 'POST') {
        console.log('❌ Wrong method');
        sendErrorResponse(
            res,
            405,
            createApiError(ApiErrorCode.VALIDATION_ERROR, 'Method not allowed')
        );
        return;
    }

    // Validate request body
    const validation = validateRequest(waitlistRequestSchema, req);
    if (!validation.success) {
        console.log('❌ Validation failed:', validation.error);
        sendErrorResponse(
            res,
            400,
            createApiError(ApiErrorCode.VALIDATION_ERROR, validation.error)
        );
        return;
    }

    const { name, email } = validation.data;

    try {
        console.log('📡 Using Backend API storage');

        const success = await addToWaitlist(name, email);
        const count = await getWaitlistCount();

        if (success) {
            console.log('✅ Email added successfully:', email);
            sendApiResponse(res, 200, {
                success: true,
                message: 'Successfully joined the waitlist!',
                count: count
            });
        } else {
            console.log('⚠️ Email already exists:', email);
            sendApiResponse(res, 200, {
                success: true,
                message: 'You\'re already on our waitlist!',
                count: count
            });
        }

    } catch (error) {
        console.error('❌ Error adding to waitlist:', error);
        sendErrorResponse(
            res,
            500,
            createApiError(
                ApiErrorCode.INTERNAL_ERROR,
                'Failed to join waitlist. Please try again.'
            )
        );
    }
};

export default handler;