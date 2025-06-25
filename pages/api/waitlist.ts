import type { NextApiRequest, NextApiResponse } from 'next';
import { addToWaitlist, loadWaitlist } from '../../lib/waitlist-storage';
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

  const { email } = validation.data;

  try {
    // Force production storage when REDIS_URL exists
    const isProduction = process.env.VERCEL || process.env.REDIS_URL;
    
    if (isProduction) {
      console.log('📡 Using Vercel Redis storage');
      const { addToWaitlist } = await import('../../lib/waitlist-storage-production');
      const success = await addToWaitlist(email);
      
      if (success) {
        return res.status(200).json({ 
          message: 'Successfully added to waitlist!',
          environment: 'production-redis'
        });
      } else {
        return res.status(409).json({ 
          error: 'Email already exists in waitlist',
          environment: 'production-redis'
        });
      }
    } else {
      console.log('📁 Using local file storage');
      const { addToWaitlist } = await import('../../lib/waitlist-storage');
      const success = addToWaitlist(email);
      
      const emailsAfter = loadWaitlist();
      console.log('📊 Emails after:', emailsAfter.length);
      console.log('📧 All emails:', emailsAfter);

    if (!isNewEmail) {
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