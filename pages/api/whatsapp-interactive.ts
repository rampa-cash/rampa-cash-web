import type { NextApiRequest, NextApiResponse } from 'next';
import twilio from 'twilio';

const client = twilio(
  process.env.TWILIO_ACCOUNT_SID,
  process.env.TWILIO_AUTH_TOKEN
);

// Use the SAME activeTransfers map as the webhook
const activeTransfers = new Map();

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  console.log('🚀 Interactive API called');
  console.log('Environment variables:');
  console.log('TWILIO_ACCOUNT_SID:', process.env.TWILIO_ACCOUNT_SID ? 'Found' : 'Missing');
  console.log('TWILIO_AUTH_TOKEN:', process.env.TWILIO_AUTH_TOKEN ? 'Found' : 'Missing');

  if (req.method !== 'POST') {
    return res.status(405).json({ success: false, error: 'Method not allowed' });
  }

  const { senderPhone, transferData } = req.body;

  if (!senderPhone || !transferData) {
    console.log('❌ Missing required parameters');
    return res.status(400).json({ 
      success: false, 
      error: 'Missing required parameters' 
    });
  }

  try {
    console.log('💾 Storing transfer data for:', senderPhone);
    
    // Store transfer data
    activeTransfers.set(senderPhone, {
      ...transferData,
      step: 'choosing_recipient',
      timestamp: Date.now()
    });

    console.log('📱 Sending WhatsApp menu message');

    // Send the recipient selection menu
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

    console.log('✅ Message sent successfully');

    return res.status(200).json({ 
      success: true, 
      message: 'Interactive transfer flow started' 
    });
    
  } catch (error) {
    const errorMessage = (typeof error === 'object' && error !== null && 'message' in error)
      ? (error as { message: string }).message
      : 'Unknown error';
    res.status(500).json({
      success: false,
      error: `Failed to start transfer: ${errorMessage}`
    });
  }
}

// Export for sharing with webhook
export { activeTransfers };