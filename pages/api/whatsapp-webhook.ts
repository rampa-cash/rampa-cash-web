import type { NextApiRequest, NextApiResponse } from 'next';
import twilio from 'twilio';

const client = twilio(
  process.env.TWILIO_ACCOUNT_SID,
  process.env.TWILIO_AUTH_TOKEN
);

// In-memory storage for active transfers (use database in production)
const activeTransfers = new Map();

// Predefined contacts (you can expand this list)
const savedContacts = [
  { id: '1', name: 'Maria Rodriguez', phone: '+521234567890', country: 'Mexico', flag: '🇲🇽' },
  { id: '2', name: 'Carlos Silva', phone: '+5711234567890', country: 'Colombia', flag: '🇨🇴' },
  { id: '3', name: 'Ana Santos', phone: '+5511234567890', country: 'Brazil', flag: '🇧🇷' },
];

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { Body, From } = req.body;
    const userMessage = Body?.trim();
    const senderPhone = From?.replace('whatsapp:', '');

    console.log('📨 Received WhatsApp message:', { from: senderPhone, message: userMessage });

    if (!senderPhone || !userMessage) {
      return res.status(200).send('OK');
    }

    // Check if user has an active transfer
    const activeTransfer = activeTransfers.get(senderPhone);
    
    if (!activeTransfer) {
      // No active transfer, send help message
      await sendHelpMessage(senderPhone);
      return res.status(200).send('OK');
    }

    // Handle different steps of the transfer process
    if (activeTransfer.step === 'choosing_recipient') {
      await handleRecipientSelection(senderPhone, userMessage, activeTransfer);
    } else if (activeTransfer.step === 'waiting_for_phone') {
      await handlePhoneNumberInput(senderPhone, userMessage, activeTransfer);
    } else if (activeTransfer.step === 'confirming_transfer') {
      await handleTransferConfirmation(senderPhone, userMessage, activeTransfer);
    }

    return res.status(200).send('OK');
    
  } catch (error) {
    console.error('❌ Webhook error:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
}

async function sendHelpMessage(senderPhone: string) {
  await client.messages.create({
    body: `👋 Welcome to RAMPA!

To start a money transfer, visit:
🌐 https://your-domain.com/whatsapp-transfer

Or reply with:
• *"help"* - See this message
• *"rates"* - Check exchange rates
• *"support"* - Contact support

Fast, secure money transfers powered by blockchain! 🚀`,
    from: `whatsapp:${process.env.TWILIO_WHATSAPP_NUMBER}`,
    to: `whatsapp:${senderPhone}`
  });
}

async function handleRecipientSelection(senderPhone: string, userMessage: string, transferData: any) {
  const message = userMessage.toLowerCase();
  let recipientInfo = null;

  // Check if user selected a predefined contact
  if (['1', '2', '3'].includes(message)) {
    recipientInfo = savedContacts.find(contact => contact.id === message);
    
    if (recipientInfo) {
      await confirmRecipientAndTransfer(senderPhone, recipientInfo, transferData);
    }
  } 
  // Check if user wants to add new contact
  else if (message === '4') {
    await client.messages.create({
      body: `📱 Add New Contact

Please send the recipient's WhatsApp number in international format.

✅ Examples:
• +521234567890 (Mexico)
• +5711234567890 (Colombia)  
• +5511234567890 (Brazil)
• +5493112345678 (Argentina)
• +51987654321 (Peru)

📝 Send the number now:`,
      from: `whatsapp:${process.env.TWILIO_WHATSAPP_NUMBER}`,
      to: `whatsapp:${senderPhone}`
    });
    
    // Update step to wait for phone number
    activeTransfers.set(senderPhone, {
      ...transferData,
      step: 'waiting_for_phone'
    });
  }
  // Check if user sent a phone number directly
  else if (message.startsWith('+') && message.length > 10) {
    recipientInfo = {
      name: `Contact ${message}`,
      phone: message,
      country: 'International',
      flag: '📱'
    };
    await confirmRecipientAndTransfer(senderPhone, recipientInfo, transferData);
  }
  // Invalid input
  else {
    await client.messages.create({
      body: `❌ Invalid option. Please choose:

1️⃣ Reply *"1"* - Maria Rodriguez (Mexico) 🇲🇽
2️⃣ Reply *"2"* - Carlos Silva (Colombia) 🇨🇴  
3️⃣ Reply *"3"* - Ana Santos (Brazil) 🇧🇷
4️⃣ Reply *"4"* - Add new contact

📱 Or send a phone number directly (e.g., +521234567890)

💡 What would you like to do?`,
      from: `whatsapp:${process.env.TWILIO_WHATSAPP_NUMBER}`,
      to: `whatsapp:${senderPhone}`
    });
  }
}

async function handlePhoneNumberInput(senderPhone: string, userMessage: string, transferData: any) {
  const phoneNumber = userMessage.trim();
  
  // Validate phone number format
  if (phoneNumber.startsWith('+') && phoneNumber.length >= 10) {
    const recipientInfo = {
      name: `Contact ${phoneNumber}`,
      phone: phoneNumber,
      country: 'International',
      flag: '📱'
    };
    
    await confirmRecipientAndTransfer(senderPhone, recipientInfo, transferData);
  } else {
    await client.messages.create({
      body: `❌ Invalid phone number format.

Please send a valid international number:
✅ +521234567890 (Mexico)
✅ +5711234567890 (Colombia)

❌ 1234567890 (missing country code)
❌ 521234567890 (missing + sign)

📱 Try again:`,
      from: `whatsapp:${process.env.TWILIO_WHATSAPP_NUMBER}`,
      to: `whatsapp:${senderPhone}`
    });
  }
}

async function confirmRecipientAndTransfer(senderPhone: string, recipient: any, transferData: any) {
  try {
    // Send confirmation message
    await client.messages.create({
      body: `✅ TRANSFER CONFIRMATION

📋 Please confirm your transfer:

💰 You send: ${transferData.amount} EUR
💵 Recipient gets: ${transferData.recipientAmount.toFixed(2)} ${transferData.currency}
👤 To: ${recipient.name}
📱 Phone: ${recipient.phone}
🏦 Via: RAMPA Blockchain

💡 Reply:
• *"YES"* to confirm and send
• *"NO"* to cancel
• *"CHANGE"* to choose different recipient`,
      from: `whatsapp:${process.env.TWILIO_WHATSAPP_NUMBER}`,
      to: `whatsapp:${senderPhone}`
    });

    // Update transfer data with recipient info
    activeTransfers.set(senderPhone, {
      ...transferData,
      recipient: recipient,
      step: 'confirming_transfer'
    });

  } catch (error) {
    console.error('❌ Error in confirmation:', error);
    await client.messages.create({
      body: `❌ Error occurred. Please try again or contact support.`,
      from: `whatsapp:${process.env.TWILIO_WHATSAPP_NUMBER}`,
      to: `whatsapp:${senderPhone}`
    });
  }
}

async function handleTransferConfirmation(senderPhone: string, userMessage: string, transferData: any) {
  const message = userMessage.toLowerCase();
  
  if (message === 'yes' || message === 'y' || message === 'confirm') {
    await processConfirmedTransfer(senderPhone, transferData);
  } else if (message === 'no' || message === 'n' || message === 'cancel') {
    await client.messages.create({
      body: `❌ Transfer cancelled.

To start a new transfer, visit:
🌐 https://your-domain.com/whatsapp-transfer

Thank you for using RAMPA! 🚀`,
      from: `whatsapp:${process.env.TWILIO_WHATSAPP_NUMBER}`,
      to: `whatsapp:${senderPhone}`
    });
    
    // Clear the active transfer
    activeTransfers.delete(senderPhone);
  } else if (message === 'change') {
    // Go back to recipient selection
    activeTransfers.set(senderPhone, {
      ...transferData,
      step: 'choosing_recipient'
    });
    
    await client.messages.create({
      body: `📱 Choose a different recipient:

1️⃣ Reply *"1"* - Maria Rodriguez (Mexico) 🇲🇽
2️⃣ Reply *"2"* - Carlos Silva (Colombia) 🇨🇴  
3️⃣ Reply *"3"* - Ana Santos (Brazil) 🇧🇷
4️⃣ Reply *"4"* - Add new contact

📱 Or send a phone number directly`,
      from: `whatsapp:${process.env.TWILIO_WHATSAPP_NUMBER}`,
      to: `whatsapp:${senderPhone}`
    });
  } else {
    await client.messages.create({
      body: `❓ Please confirm your choice:

✅ Reply *"YES"* to confirm transfer
❌ Reply *"NO"* to cancel  
🔄 Reply *"CHANGE"* to choose different recipient

💡 What would you like to do?`,
      from: `whatsapp:${process.env.TWILIO_WHATSAPP_NUMBER}`,
      to: `whatsapp:${senderPhone}`
    });
  }
}

async function processConfirmedTransfer(senderPhone: string, transferData: any) {
  try {
    const { recipient } = transferData;
    
    // Send processing message to sender
    await client.messages.create({
      body: `🚀 TRANSFER PROCESSING!

✅ Your transfer is confirmed and processing:

💰 Amount: ${transferData.amount} EUR → ${transferData.recipientAmount.toFixed(2)} ${transferData.currency}
👤 To: ${recipient.name}
📱 Phone: ${recipient.phone}
🔗 Blockchain: Solana
⏱️ Expected completion: 30-60 seconds

We'll notify you when it's complete! 🚀`,
      from: `whatsapp:${process.env.TWILIO_WHATSAPP_NUMBER}`,
      to: `whatsapp:${senderPhone}`
    });

    // Send notification to recipient (if valid phone)
    if (recipient.phone.startsWith('+') && recipient.phone.length > 10) {
      try {
        await client.messages.create({
          body: `💰 MONEY INCOMING!

You're receiving a money transfer:

💵 Amount: ${transferData.recipientAmount.toFixed(2)} ${transferData.currency}
📱 From: ${senderPhone}
🏦 Via: RAMPA (Blockchain transfer)

🔄 Processing now...
⏱️ You'll be notified when ready to collect!

Thank you! 🚀`,
          from: `whatsapp:${process.env.TWILIO_WHATSAPP_NUMBER}`,
          to: `whatsapp:${recipient.phone}`
        });
      } catch (error) {
        console.error('❌ Failed to notify recipient:', error);
      }
    }

    // Send completion message after delay (simulating blockchain processing)
    setTimeout(async () => {
      try {
        // Message to sender
        await client.messages.create({
          body: `🎉 TRANSFER COMPLETED!

✅ Your ${transferData.amount} EUR has been successfully delivered!

👤 Recipient: ${recipient.name}
📱 Phone: ${recipient.phone}
💰 Amount delivered: ${transferData.recipientAmount.toFixed(2)} ${transferData.currency}
🔗 Blockchain: Confirmed on Solana
⚡ Delivery time: Under 1 minute

Thank you for using RAMPA! 🚀

💡 Send another transfer? Visit:
🌐 https://your-domain.com/whatsapp-transfer`,
          from: `whatsapp:${process.env.TWILIO_WHATSAPP_NUMBER}`,
          to: `whatsapp:${senderPhone}`
        });

        // Message to recipient
        if (recipient.phone.startsWith('+') && recipient.phone.length > 10) {
          await client.messages.create({
            body: `✅ MONEY RECEIVED!

🎉 Your transfer is complete and ready:

💰 Amount: ${transferData.recipientAmount.toFixed(2)} ${transferData.currency}
📱 From: ${senderPhone}
🏦 Via: RAMPA
🔗 Blockchain confirmed

💡 The money has been successfully delivered!
Thank you for using RAMPA! 🚀`,
            from: `whatsapp:${process.env.TWILIO_WHATSAPP_NUMBER}`,
            to: `whatsapp:${recipient.phone}`
          });
        }
      } catch (error) {
        console.error('❌ Failed to send completion messages:', error);
      }
    }, 15000); // 15 seconds delay to simulate processing

    // Clear the active transfer
    activeTransfers.delete(senderPhone);

  } catch (error) {
    console.error('❌ Error processing transfer:', error);
    
    await client.messages.create({
      body: `❌ Transfer failed due to technical error. 

Please try again or contact support.
Your money is safe and no charges were applied.`,
      from: `whatsapp:${process.env.TWILIO_WHATSAPP_NUMBER}`,
      to: `whatsapp:${senderPhone}`
    });
    
    // Clear the failed transfer
    activeTransfers.delete(senderPhone);
  }
}

// Export activeTransfers for use in other API routes
export { activeTransfers };