import type { NextApiRequest, NextApiResponse } from 'next';
import { Connection, PublicKey, Transaction, SystemProgram, Keypair } from '@solana/web3.js';
import bs58 from 'bs58'; // You'll need to install this package
import { 
  validateRequest, 
  sendApiResponse, 
  sendErrorResponse, 
  createApiError,
  rateLimit,
  corsMiddleware
} from '../../lib/api-utils';
import {
  ApiErrorCode,
  type SolanaTransferResponse,
  SolanaTransferRequestSchema
} from '../../lib/types/api';

// Connect to Solana devnet
const connection = new Connection('https://api.devnet.solana.com', 'confirmed');

// IMPORTANT: In production, NEVER store private keys in code
// This is just for demonstration purposes
const getKeypairFromEnv = (): Keypair => {
  const privateKey = process.env.SOLANA_PRIVATE_KEY;
  if (!privateKey) {
    throw new Error('Missing SOLANA_PRIVATE_KEY environment variable');
  }
  
  try {
    // Convert base58 private key to Uint8Array and create keypair
    const decodedKey = bs58.decode(privateKey);
    return Keypair.fromSecretKey(decodedKey);
  } catch (error) {
    throw new Error('Invalid SOLANA_PRIVATE_KEY format');
  }
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<SolanaTransferResponse>
): Promise<void> {
  // Handle CORS
  corsMiddleware(req, res);
  
  // Apply rate limiting
  const rateLimitCheck = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    maxRequests: 5, // 5 transfers per 15 minutes
    message: 'Too many transfer requests, please try again later.',
  });
  
  if (!rateLimitCheck(req, res)) {
    return;
  }

  // Only allow POST requests
  if (req.method !== 'POST') {
    sendErrorResponse(
      res,
      405,
      createApiError(ApiErrorCode.VALIDATION_ERROR, 'Method not allowed')
    );
    return;
  }

  // Validate request body
  const validation = validateRequest(SolanaTransferRequestSchema, req);
  if (!validation.success) {
    sendErrorResponse(
      res,
      400,
      createApiError(ApiErrorCode.VALIDATION_ERROR, validation.error)
    );
    return;
  }

  const { recipientAddress, amount } = validation.data;

  try {
    // Get sender keypair (in production this would come from a secure vault)
    const senderKeypair = getKeypairFromEnv();
    
    // Validate recipient address
    let recipientPublicKey: PublicKey;
    try {
      recipientPublicKey = new PublicKey(recipientAddress);
    } catch (error) {
      sendErrorResponse(
        res,
        400,
        createApiError(ApiErrorCode.VALIDATION_ERROR, 'Invalid recipient address')
      );
      return;
    }
    
    // Validate amount (prevent dust attacks and excessive amounts)
    if (amount <= 0 || amount > 1000000) { // Max 1M SOL for safety
      sendErrorResponse(
        res,
        400,
        createApiError(ApiErrorCode.VALIDATION_ERROR, 'Invalid amount')
      );
      return;
    }
    
    // Check sender balance
    const senderBalance = await connection.getBalance(senderKeypair.publicKey);
    const requiredAmount = amount * 1000000 // Convert to lamports
    const transactionFee = 5000 // Estimated transaction fee
    
    if (senderBalance < requiredAmount + transactionFee) {
      sendErrorResponse(
        res,
        400,
        createApiError(ApiErrorCode.VALIDATION_ERROR, 'Insufficient balance')
      );
      return;
    }
    
    // Create transaction
    const transaction = new Transaction().add(
      SystemProgram.transfer({
        fromPubkey: senderKeypair.publicKey,
        toPubkey: recipientPublicKey,
        lamports: requiredAmount
      })
    );
    
    // Get recent blockhash
    const { blockhash } = await connection.getLatestBlockhash();
    transaction.recentBlockhash = blockhash;
    transaction.feePayer = senderKeypair.publicKey;
    
    // Sign and send transaction
    const signature = await connection.sendTransaction(
      transaction,
      [senderKeypair]
    );
    
    // Wait for confirmation
    const confirmation = await connection.confirmTransaction(signature, 'confirmed');
    
    if (confirmation.value.err) {
      throw new Error('Transaction failed to confirm');
    }
    
    // Return success response with transaction signature
    sendApiResponse(res, 200, {
      success: true,
      signature
    });
  } catch (error) {
    console.error('Error processing Solana transfer:', error);
    
    const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
    sendErrorResponse(
      res,
      500,
      createApiError(ApiErrorCode.INTERNAL_ERROR, `Failed to process Solana transfer: ${errorMessage}`)
    );
  }
}