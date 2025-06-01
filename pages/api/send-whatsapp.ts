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
  const { to, message, transferData } = req.body;

  // Validate input
  if (!to || !message) {
    return res.status(400).json({ 
      success: false, 
      error: 'Missing required parameters: to, message' 
    });
  }

  try {
    // Send initial confirmation message
    await client.messages.create({
      body: message,
      from: `whatsapp:${process.env.TWILIO_WHATSAPP_NUMBER}`,
      to: `whatsapp:${to}`
    });

    // If transferData is provided, send follow-up messages
    if (transferData) {
      // Send processing update after 5 seconds
      setTimeout(async () => {
        try {
          await client.messages.create({
            body: `⏳ PROCESSING UPDATE

Your ${transferData.amount} EUR transfer to ${transferData.country} is being processed...

🔄 Status: Blockchain confirmation in progress
⏱️ Expected completion: 30-60 seconds

We'll notify you once completed! 🚀`,
            from: `whatsapp:${process.env.TWILIO_WHATSAPP_NUMBER}`,
            to: `whatsapp:${to}`
          });
        } catch (error) {
          console.error('Error sending processing update:', error);
        }
      }, 5000);

      // Send completion message after 15 seconds (simulated)
      setTimeout(async () => {
        try {
          await client.messages.create({
            body: `✅ TRANSFER COMPLETED!

🎉 SUCCESS! Your transfer has been completed:

💰 ${transferData.recipientAmount.toFixed(2)} ${transferData.currency} delivered
🏦 Recipient can collect the funds now
📍 Destination: ${transferData.country}
🔗 Blockchain: Confirmed on Solana
⚡ Speed: Completed in under 1 minute

Thank you for using RAMPA! 
Your money, delivered fast. 🚀

Need help? Reply to this message.`,
            from: `whatsapp:${process.env.TWILIO_WHATSAPP_NUMBER}`,
            to: `whatsapp:${to}`
          });
        } catch (error) {
          console.error('Error sending completion message:', error);
        }
      }, 15000);
    }
    
    return res.status(200).json({ 
      success: true, 
      message: 'Transfer notifications sent successfully' 
    });
    
  } catch (error) {
    console.error('Error sending WhatsApp messages:', error);
    return res.status(500).json({ 
      success: false, 
      error: 'Failed to send WhatsApp messages' 
    });
  }
}