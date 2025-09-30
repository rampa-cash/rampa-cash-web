import { TransactionApiClient } from '../api-client';
import type { 
    Transaction, 
    TransactionFilters,
    TransactionStats
} from '../types';

/**
 * Transaction service for handling transaction logic
 * Uses TransactionApiClient for API calls and manages local state
 */
export class TransactionService {
    /**
     * Send money to a recipient
     */
    static async sendMoney(senderId: string, recipient: any, amount: number, currency: string, memo?: string): Promise<{ transactionId: string; status: string }> {
        try {
            const token = localStorage.getItem('accessToken');
            if (!token) {
                throw new Error('No authentication token available');
            }

            const response = await TransactionApiClient.createTransaction({
                senderId,
                recipientId: recipient.id,
                senderWalletId: 'current_wallet', // Would be actual wallet ID
                recipientWalletId: recipient.walletId || 'recipient_wallet',
                amount: amount.toString(),
                tokenType: currency as 'USDC' | 'EURC' | 'SOL',
                description: memo || undefined,
                fee: '0.01', // Mock fee
            }, token);

            return {
                transactionId: response.id,
                status: response.status,
            };
        } catch (error) {
            console.error('Failed to send money:', error);
            throw error;
        }
    }

    /**
     * Get transactions for a user
     */
    static async getTransactions(_userId: string, filters?: TransactionFilters): Promise<Transaction[]> {
        try {
            const token = localStorage.getItem('accessToken');
            if (!token) {
                throw new Error('No authentication token available');
            }

            const response = await TransactionApiClient.getTransactions(filters || {}, token);
            
            // Convert API response to internal format
            return response.map(tx => ({
                id: tx.id,
                senderId: tx.senderId,
                recipientId: tx.recipientId,
                senderWalletId: 'sender_wallet', // Would be actual wallet ID
                recipientWalletId: 'recipient_wallet', // Would be actual wallet ID
                amount: tx.amount,
                tokenType: tx.tokenType,
                status: tx.status,
                solanaTransactionHash: tx.solanaTransactionHash || undefined,
                description: tx.description || undefined,
                fee: tx.fee,
                createdAt: tx.createdAt,
                confirmedAt: tx.confirmedAt || undefined,
                failedAt: tx.failedAt || undefined,
                failureReason: tx.failureReason || undefined,
            }));
        } catch (error) {
            console.error('Failed to get transactions:', error);
            throw error;
        }
    }

    /**
     * Get transaction details
     */
    static async getTransactionDetails(transactionId: string): Promise<Transaction> {
        try {
            const token = localStorage.getItem('accessToken');
            if (!token) {
                throw new Error('No authentication token available');
            }

            const response = await TransactionApiClient.getTransaction(transactionId, token);
            
            return {
                id: response.id,
                senderId: response.senderId,
                recipientId: response.recipientId,
                senderWalletId: 'sender_wallet',
                recipientWalletId: 'recipient_wallet',
                amount: response.amount,
                tokenType: response.tokenType,
                status: response.status,
                solanaTransactionHash: response.solanaTransactionHash || undefined,
                description: response.description || undefined,
                fee: response.fee,
                createdAt: response.createdAt,
                confirmedAt: response.confirmedAt || undefined,
                failedAt: response.failedAt || undefined,
                failureReason: response.failureReason || undefined,
            };
        } catch (error) {
            console.error('Failed to get transaction details:', error);
            throw error;
        }
    }

    /**
     * Get sent transactions
     */
    static async getSentTransactions(_userId: string, limit?: number, offset?: number): Promise<Transaction[]> {
        try {
            const token = localStorage.getItem('accessToken');
            if (!token) {
                throw new Error('No authentication token available');
            }

            const response = await TransactionApiClient.getSentTransactions(limit, offset, token);
            
            return response.map(tx => ({
                id: tx.id,
                senderId: tx.senderId,
                recipientId: tx.recipientId,
                senderWalletId: 'sender_wallet',
                recipientWalletId: 'recipient_wallet',
                amount: tx.amount,
                tokenType: tx.tokenType,
                status: tx.status,
                solanaTransactionHash: tx.solanaTransactionHash || undefined,
                description: tx.description || undefined,
                fee: tx.fee,
                createdAt: tx.createdAt,
                confirmedAt: tx.confirmedAt || undefined,
                failedAt: tx.failedAt || undefined,
                failureReason: tx.failureReason || undefined,
            }));
        } catch (error) {
            console.error('Failed to get sent transactions:', error);
            throw error;
        }
    }

    /**
     * Get received transactions
     */
    static async getReceivedTransactions(_userId: string, limit?: number, offset?: number): Promise<Transaction[]> {
        try {
            const token = localStorage.getItem('accessToken');
            if (!token) {
                throw new Error('No authentication token available');
            }

            const response = await TransactionApiClient.getReceivedTransactions(limit, offset, token);
            
            return response.map(tx => ({
                id: tx.id,
                senderId: tx.senderId,
                recipientId: tx.recipientId,
                senderWalletId: 'sender_wallet',
                recipientWalletId: 'recipient_wallet',
                amount: tx.amount,
                tokenType: tx.tokenType,
                status: tx.status,
                solanaTransactionHash: tx.solanaTransactionHash || undefined,
                description: tx.description || undefined,
                fee: tx.fee,
                createdAt: tx.createdAt,
                confirmedAt: tx.confirmedAt || undefined,
                failedAt: tx.failedAt || undefined,
                failureReason: tx.failureReason || undefined,
            }));
        } catch (error) {
            console.error('Failed to get received transactions:', error);
            throw error;
        }
    }

    /**
     * Get pending transactions
     */
    static async getPendingTransactions(_userId: string): Promise<Transaction[]> {
        try {
            const token = localStorage.getItem('accessToken');
            if (!token) {
                throw new Error('No authentication token available');
            }

            const response = await TransactionApiClient.getPendingTransactions(token);
            
            return response.map(tx => ({
                id: tx.id,
                senderId: tx.senderId,
                recipientId: tx.recipientId,
                senderWalletId: 'sender_wallet',
                recipientWalletId: 'recipient_wallet',
                amount: tx.amount,
                tokenType: tx.tokenType,
                status: tx.status,
                solanaTransactionHash: tx.solanaTransactionHash || undefined,
                description: tx.description || undefined,
                fee: tx.fee,
                createdAt: tx.createdAt,
                confirmedAt: tx.confirmedAt || undefined,
                failedAt: tx.failedAt || undefined,
                failureReason: tx.failureReason || undefined,
            }));
        } catch (error) {
            console.error('Failed to get pending transactions:', error);
            throw error;
        }
    }

    /**
     * Get transaction statistics
     */
    static async getTransactionStats(_userId: string, startDate?: string, endDate?: string): Promise<TransactionStats> {
        try {
            const token = localStorage.getItem('accessToken');
            if (!token) {
                throw new Error('No authentication token available');
            }

            return await TransactionApiClient.getTransactionStats(startDate, endDate, token);
        } catch (error) {
            console.error('Failed to get transaction stats:', error);
            throw error;
        }
    }

    /**
     * Confirm transaction
     */
    static async confirmTransaction(transactionId: string, solanaTransactionHash: string): Promise<void> {
        try {
            const token = localStorage.getItem('accessToken');
            if (!token) {
                throw new Error('No authentication token available');
            }

            await TransactionApiClient.confirmTransaction(transactionId, solanaTransactionHash, token);
        } catch (error) {
            console.error('Failed to confirm transaction:', error);
            throw error;
        }
    }

    /**
     * Cancel transaction
     */
    static async cancelTransaction(transactionId: string): Promise<void> {
        try {
            const token = localStorage.getItem('accessToken');
            if (!token) {
                throw new Error('No authentication token available');
            }

            await TransactionApiClient.cancelTransaction(transactionId, token);
        } catch (error) {
            console.error('Failed to cancel transaction:', error);
            throw error;
        }
    }
}