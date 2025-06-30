import type { NextApiRequest, NextApiResponse } from 'next';
import { loadWaitlist } from '../../lib/waitlist-storage';
import { 
  validateRequest, 
  sendApiResponse, 
  sendErrorResponse, 
  createApiError,
  rateLimit,
  corsMiddleware
} from '../../lib/api-utils';
import {
  ApiErrorCode,
  type WaitlistResponse,
  WaitlistRequestSchema
} from '../../lib/types/api';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<WaitlistResponse>
): Promise<void> {
  // Handle CORS
  corsMiddleware(req, res);
  
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
  const validation = validateRequest(WaitlistRequestSchema, req);
  if (!validation.success) {
    console.log('❌ Validation failed:', validation.error);
    sendErrorResponse(
      res,
      400,
      createApiError(ApiErrorCode.VALIDATION_ERROR, validation.error)
    );
    return;
  }

  const { email } = validation.data;

  try {
    // Use Vector Database when available (works as Redis storage)
    const isProduction = process.env.VERCEL ?? process.env.UPSTASH_VECTOR_REST_URL;
    
    if (isProduction) {
      console.log('📡 Using Vercel Vector Database storage');
      const { addToWaitlist } = await import('../../lib/waitlist-storage-production');
      const success = await addToWaitlist(email);
      
      if (success) {
        sendApiResponse(res, 200, {
          success: true,
          message: 'Successfully added to waitlist!'
        });
        return;
      } else {
        sendApiResponse(res, 409, {
          success: false,
          error: 'Email already exists in waitlist'
        });
        return;
      }
    } else {
      console.log('📁 Using local file storage');
      const { addToWaitlist } = await import('../../lib/waitlist-storage');
      const success = addToWaitlist(email);
      
      const emailsAfter = loadWaitlist();
      console.log('📊 Emails after:', emailsAfter.length);
      console.log('📧 All emails:', emailsAfter);

      if (!success) {
        console.log('⚠️ Email already exists:', email);
        sendApiResponse(res, 200, {
          success: true,
          message: 'You\'re already on our waitlist!',
          count: emailsAfter.length
        });
        return;
      }

      console.log('✅ Email added successfully:', email);

      sendApiResponse(res, 200, {
        success: true,
        message: 'Successfully joined the waitlist!',
        count: emailsAfter.length
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
}