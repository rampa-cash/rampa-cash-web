import type { NextApiRequest, NextApiResponse } from 'next';
import twilio from 'twilio';

const client = twilio(
  process.env.TWILIO_ACCOUNT_SID,
  process.env.TWILIO_AUTH_TOKEN
);

// Store active transfers temporarily (in production, use a database)
const activeTransfers = new Map();

type ResponseData = {
  success: boolean;
  message?: string;
  error?: string;
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ResponseData>
) {
  if (req.method !== 'POST') {
    return res.status(405).json({ success: false, error: 'Method not allowed' });
  }

  const { senderPhone, transferData } = req.body;

  if (!senderPhone || !transferData) {
    return res.status(400).json({ 
      success: false, 
      error: 'Missing required parameters' 
    });
  }

  try {
    // Store transfer data temporarily
    activeTransfers.set(senderPhone, {
      ...transferData,
      step: 'choosing_recipient',
      timestamp: Date.now()
    });

    // Send initial message with contact options
    await client.messages.create({
      body: `🚀 RAMPA Transfer: ${transferData.amount} EUR → ${transferData.recipientAmount.toFixed(2)} ${transferData.currency}

📱 Choose who to send money to:

1️⃣ Reply *"1"* - Maria Rodriguez (Mexico) 🇲🇽
2️⃣ Reply *"2"* - Carlos Silva (Colombia) 🇨🇴  
3️⃣ Reply *"3"* - Ana Santos (Brazil) 🇧🇷
4️⃣ Reply *"4"* - Add new contact

Or send the recipient's WhatsApp number directly (e.g., +521234567890)

💡 What would you like to do?`,
      from: `whatsapp:${process.env.TWILIO_WHATSAPP_NUMBER}`,
      to: `whatsapp:${senderPhone}`
    });

    return res.status(200).json({ 
      success: true, 
      message: 'Interactive transfer flow started' 
    });
    
  } catch (error) {
    console.error('Error starting interactive transfer:', error);
    return res.status(500).json({ 
      success: false, 
      error: 'Failed to start transfer flow' 
    });
  }
}

// Export the activeTransfers map for use in webhook
export { activeTransfers };