import type { NextApiRequest, NextApiResponse } from 'next';
import { Connection, PublicKey, Transaction, SystemProgram, Keypair } from '@solana/web3.js';
import { Token, TOKEN_PROGRAM_ID } from '@solana/spl-token';
import bs58 from 'bs58'; // You'll need to install this package

// Connect to Solana devnet
const connection = new Connection('https://api.devnet.solana.com', 'confirmed');

// IMPORTANT: In production, NEVER store private keys in code
// This is just for demonstration purposes
const getKeypairFromEnv = () => {
  const privateKey = process.env.SOLANA_PRIVATE_KEY;
  if (!privateKey) throw new Error('Missing SOLANA_PRIVATE_KEY environment variable');
  
  // Convert base58 private key to Uint8Array and create keypair
  const decodedKey = bs58.decode(privateKey);
  return Keypair.fromSecretKey(decodedKey);
};

type ResponseData = {
  success: boolean;
  signature?: string;
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
  const { recipientAddress, amount } = req.body;

  // Validate input
  if (!recipientAddress || !amount) {
    return res.status(400).json({ 
      success: false, 
      error: 'Missing required parameters: recipientAddress, amount' 
    });
  }

  try {
    // Get sender keypair (in production this would come from a secure vault)
    const senderKeypair = getKeypairFromEnv();
    
    // Validate recipient address
    let recipientPublicKey: PublicKey;
    try {
      recipientPublicKey = new PublicKey(recipientAddress);
    } catch (error) {
      return res.status(400).json({ 
        success: false, 
        error: 'Invalid recipient address' 
      });
    }
    
    // Create transaction
    const transaction = new Transaction().add(
      SystemProgram.transfer({
        fromPubkey: senderKeypair.publicKey,
        toPubkey: recipientPublicKey,
        lamports: amount * 1000000 // Convert to lamports
      })
    );
    
    // Sign and send transaction
    const signature = await connection.sendTransaction(
      transaction,
      [senderKeypair]
    );
    
    // Return success response with transaction signature
    return res.status(200).json({
      success: true,
      signature
    });
  } catch (error) {
    console.error('Error processing Solana transfer:', error);
    return res.status(500).json({ 
      success: false, 
      error: 'Failed to process Solana transfer' 
    });
  }
}