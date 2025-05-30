import type { NextApiRequest, NextApiResponse } from 'next';
import twilio from 'twilio';

// Initialize Twilio client
const client = twilio(
  process.env.TWILIO_ACCOUNT_SID,
  process.env.TWILIO_AUTH_TOKEN
);

type ResponseData = {
  success: boolean;
  message?: string;
  error?: string;
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ResponseData>
) {
  // Only allow POST requests
  if (req.method !== 'POST') {
    return res.status(405).json({ success: false, error: 'Method not allowed' });
  }

  // Get data from request body
  const { to, message } = req.body;

  // Validate input
  if (!to || !message) {
    return res.status(400).json({ 
      success: false, 
      error: 'Missing required parameters: to, message' 
    });
  }

  try {
    // Send WhatsApp message
    await client.messages.create({
      body: message,
      from: `whatsapp:${process.env.TWILIO_WHATSAPP_NUMBER}`,
      to: `whatsapp:${to}`
    });
    
    console.log(`Message sent to ${to}`);
    return res.status(200).json({ 
      success: true, 
      message: 'WhatsApp message sent successfully' 
    });
  } catch (error) {
    console.error('Error sending WhatsApp message:', error);
    return res.status(500).json({ 
      success: false, 
      error: 'Failed to send WhatsApp message' 
    });
  }
}