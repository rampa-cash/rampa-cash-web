import type { NextApiRequest, NextApiResponse } from 'next';
import twilio from 'twilio';
import { Connection, PublicKey, Transaction, SystemProgram, Keypair } from '@solana/web3.js';
import bs58 from 'bs58';

// Connect to Solana devnet
const connection = new Connection('https://api.devnet.solana.com', 'confirmed');

// Initialize Twilio client
const twilioClient = twilio(
  process.env.TWILIO_ACCOUNT_SID,
  process.env.TWILIO_AUTH_TOKEN
);

// Get keypair from environment variable
const getKeypairFromEnv = (): Keypair => {
  const privateKey = process.env.SOLANA_PRIVATE_KEY;
  if (!privateKey) throw new Error('Missing SOLANA_PRIVATE_KEY environment variable');
  
  // Convert base58 private key to Uint8Array and create keypair
  const decodedKey = bs58.decode(privateKey);
  return Keypair.fromSecretKey(decodedKey);
};

type ResponseData = {
  success: boolean;
  transactionId?: string;
  error?: string;
};

const handler = async (
  req: NextApiRequest,
  res: NextApiResponse<ResponseData>
): Promise<void> => {
  // Only allow POST requests
  if (req.method !== 'POST') {
    return res.status(405).json({ success: false, error: 'Method not allowed' });
  }

  // Get data from request body
  const { 
    senderPhone, 
    recipientPhone,
    recipientAddress,
    amount,
    currency 
  } = req.body;

  // Validate input
  if (!senderPhone || !recipientPhone || !recipientAddress || !amount || !currency) {
    return res.status(400).json({ 
      success: false, 
      error: 'Missing required parameters' 
    });
  }

  try {
    // 1. Process Solana transaction
    const senderKeypair = getKeypairFromEnv();
    const recipientPublicKey = new PublicKey(recipientAddress);
    
    const transaction = new Transaction().add(
      SystemProgram.transfer({
        fromPubkey: senderKeypair.publicKey,
        toPubkey: recipientPublicKey,
        lamports: Math.floor(amount * 1000000) // Convert to lamports
      })
    );
    
    const signature = await connection.sendTransaction(
      transaction,
      [senderKeypair]
    );
    
    // Wait for confirmation
    await connection.confirmTransaction(signature);
    
    // 2. Send WhatsApp notifications
    
    // Message to sender
    await twilioClient.messages.create({
      body: `Your transfer of ${amount} ${currency} to ${recipientPhone} is complete! Transaction ID: ${signature}`,
      from: `whatsapp:${process.env.TWILIO_WHATSAPP_NUMBER}`,
      to: `whatsapp:${senderPhone}`
    });
    
    // Message to recipient
    await twilioClient.messages.create({
      body: `You have received ${amount} ${currency} from ${senderPhone}. Transaction ID: ${signature}`,
      from: `whatsapp:${process.env.TWILIO_WHATSAPP_NUMBER}`,
      to: `whatsapp:${recipientPhone}`
    });
    
    // Return success response
    return res.status(200).json({
      success: true,
      transactionId: signature
    });
  } catch (error) {
    console.error('Error processing WhatsApp transfer:', error);
    return res.status(500).json({ 
      success: false, 
      error: typeof error === 'object' && error !== null ? 
        (error as Error).message : 'Unknown error' 
    });
  }
};

export default handler;