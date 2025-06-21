import type { NextApiRequest, NextApiResponse } from 'next';
import { addToWaitlist, loadWaitlist } from '../../lib/waitlist-storage';

type ResponseData = {
  success: boolean;
  message?: string;
  error?: string;
  count?: number;
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ResponseData>
) {
  if (req.method !== 'POST') {
    return res.status(405).json({ success: false, error: 'Method not allowed' });
  }

  const { email } = req.body;

  if (!email) {
    return res.status(400).json({ 
      success: false, 
      error: 'Email is required' 
    });
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return res.status(400).json({ 
      success: false, 
      error: 'Please enter a valid email address' 
    });
  }

  try {
    const isNew = addToWaitlist(email);
    const allEmails = loadWaitlist();

    if (!isNew) {
      return res.status(200).json({ 
        success: true, 
        message: 'You\'re already on our waitlist!' 
      });
    }

    console.log(`📧 New waitlist signup: ${email}`);
    console.log(`📊 Total waitlist count: ${allEmails.length}`);

    return res.status(200).json({ 
      success: true, 
      message: 'Successfully joined the waitlist!',
      count: allEmails.length 
    });

  } catch (error) {
    console.error('Waitlist signup error:', error);
    return res.status(500).json({ 
      success: false, 
      error: 'Failed to join waitlist. Please try again.' 
    });
  }
}