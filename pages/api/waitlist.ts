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
    // Choose storage based on environment
    const isProduction = process.env.NODE_ENV === 'production' || process.env.VERCEL;
    
    if (isProduction) {
      console.log('🔧 Using Vercel KV storage');
      const { addToWaitlist, loadWaitlist } = await import('../../lib/waitlist-storage-production');
      
      const emailsBefore = await loadWaitlist();
      console.log('📊 Emails before (KV):', emailsBefore.length);
      
      const isNewEmail = await addToWaitlist(email);
      
      const emailsAfter = await loadWaitlist();
      console.log('📊 Emails after (KV):', emailsAfter.length);

      if (!isNewEmail) {
        return res.status(200).json({ 
          success: true, 
          message: 'You\'re already on our waitlist!',
          count: emailsAfter.length
        });
      }

      return res.status(200).json({ 
        success: true, 
        message: 'Successfully joined the waitlist!',
        count: emailsAfter.length 
      });
      
    } else {
      console.log('🔧 Using local file storage');
      const { addToWaitlist, loadWaitlist } = await import('../../lib/waitlist-storage');
      
      const emailsBefore = loadWaitlist();
      console.log('📊 Emails before:', emailsBefore.length);
      
      const isNewEmail = addToWaitlist(email);
      
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