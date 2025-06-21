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
  console.log('🔍 Waitlist API called');
  console.log('Method:', req.method);
  console.log('Body:', req.body);

  if (req.method !== 'POST') {
    console.log('❌ Wrong method');
    return res.status(405).json({ success: false, error: 'Method not allowed' });
  }

  const { email } = req.body;

  if (!email) {
    console.log('❌ No email provided');
    return res.status(400).json({ 
      success: false, 
      error: 'Email is required' 
    });
  }

  // Basic email validation
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    console.log('❌ Invalid email format:', email);
    return res.status(400).json({ 
      success: false, 
      error: 'Please enter a valid email address' 
    });
  }

  try {
    // Load current emails to check count before
    const emailsBefore = loadWaitlist();
    console.log('📊 Emails before:', emailsBefore.length);
    
    // Try to add email using your existing function
    const isNewEmail = addToWaitlist(email);
    
    // Load emails after to get current count
    const emailsAfter = loadWaitlist();
    console.log('📊 Emails after:', emailsAfter.length);
    console.log('📧 All emails:', emailsAfter);

    if (!isNewEmail) {
      console.log('⚠️ Email already exists:', email);
      return res.status(200).json({ 
        success: true, 
        message: 'You\'re already on our waitlist!',
        count: emailsAfter.length
      });
    }

    console.log('✅ Email added successfully:', email);

    return res.status(200).json({ 
      success: true, 
      message: 'Successfully joined the waitlist!',
      count: emailsAfter.length 
    });

  } catch (error) {
    console.error('❌ Error adding to waitlist:', error);
    return res.status(500).json({ 
      success: false, 
      error: 'Failed to join waitlist. Please try again.' 
    });
  }
}