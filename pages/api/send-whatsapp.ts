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

Your ${transferData.amount} EUR transfer to ${transferData.recipientName || transferData.recipientPhone} is being processed...

👤 Recipient: ${transferData.recipientName || 'Contact'}
📞 Phone: ${transferData.recipientPhone}
🔄 Status: Blockchain confirmation in progress
⏱️ Expected completion: 30-60 seconds

We'll notify you once completed! 🚀`,
            from: `whatsapp:${process.env.TWILIO_WHATSAPP_NUMBER}`,
            to: `whatsapp:${to}`
          });

          // Also update the recipient
          if (transferData.recipientPhone) {
            await client.messages.create({
              body: `⏳ Your transfer is being processed...

💰 Amount: ${transferData.recipientAmount.toFixed(2)} ${transferData.currency}
📱 From: ${transferData.senderPhone}
🔄 Status: Almost ready!

You'll get notified when it's ready to collect! 🚀`,
              from: `whatsapp:${process.env.TWILIO_WHATSAPP_NUMBER}`,
              to: `whatsapp:${transferData.recipientPhone}`
            });
          }
        } catch (error) {
          console.error('Error sending processing update:', error);
        }
      }, 5000);

      // Send completion message after 15 seconds (simulated)
      setTimeout(async () => {
        try {
          // Message to sender
          await client.messages.create({
            body: `✅ TRANSFER COMPLETED!

🎉 SUCCESS! Your transfer has been completed:

💰 Sent: ${transferData.amount} EUR
👤 To: ${transferData.recipientName || transferData.recipientPhone}
📞 Recipient: ${transferData.recipientPhone}
💵 They received: ${transferData.recipientAmount.toFixed(2)} ${transferData.currency}
📍 Destination: ${transferData.country}
🔗 Blockchain: Confirmed on Solana
⚡ Speed: Completed in under 1 minute

Thank you for using RAMPA! 
Your money, delivered fast. 🚀`,
            from: `whatsapp:${process.env.TWILIO_WHATSAPP_NUMBER}`,
            to: `whatsapp:${to}`
          });

          // Message to recipient
          if (transferData.recipientPhone) {
            await client.messages.create({
              body: `✅ MONEY RECEIVED!

🎉 Your transfer is ready to collect:

💰 Amount: ${transferData.recipientAmount.toFixed(2)} ${transferData.currency}
📱 From: ${transferData.senderPhone}
🏦 Via: RAMPA
🔗 Blockchain confirmed on Solana

💡 The money has been delivered successfully!
Thank you for using RAMPA! 🚀`,
              from: `whatsapp:${process.env.TWILIO_WHATSAPP_NUMBER}`,
              to: `whatsapp:${transferData.recipientPhone}`
            });
          }
        } catch (error) {
          console.error('Error sending completion message:', error);
        }
      }, 15000);

      // If transferData includes recipient info, send them a notification too
      if (transferData.recipientPhone) {
        try {
          await client.messages.create({
            body: `💰 MONEY INCOMING!

Hi${transferData.recipientName ? ` ${transferData.recipientName}` : ''}! You're receiving a money transfer:

💵 Amount: ${transferData.recipientAmount.toFixed(2)} ${transferData.currency}
📱 From: ${transferData.senderPhone}
🏦 Via: RAMPA (Blockchain transfer)

🔄 Processing now...
⏱️ Expected completion: 30-60 seconds

You'll receive another message when it's ready to collect! 🚀`,
            from: `whatsapp:${process.env.TWILIO_WHATSAPP_NUMBER}`,
            to: `whatsapp:${transferData.recipientPhone}`
          });
        } catch (error) {
          console.error('Error sending message to recipient:', error);
          // Don't fail the whole transaction if recipient message fails
        }
      }
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