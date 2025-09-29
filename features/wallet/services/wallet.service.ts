import { WalletApiClient } from '../api-client';
import type { 
    Wallet, 
    WalletBalance, 
    SwapResponse,
    TransactionFee
} from '../types';

/**
 * Wallet service for handling wallet logic
 * Uses WalletApiClient for API calls and manages local state
 */
export class WalletService {
    /**
     * Get wallet balances for a user
     */
    static async getBalances(_userId: string): Promise<{ [key: string]: WalletBalance }> {
        try {
            // In a real app, you'd get the token from auth context
            const token = localStorage.getItem('accessToken');
            if (!token) {
                throw new Error('No authentication token available');
            }

            const response = await WalletApiClient.getWalletBalances(token);
            
            // Convert API response to internal format
            const balances: { [key: string]: WalletBalance } = {};
            response.balances.forEach(balance => {
                balances[balance.tokenType] = {
                    id: `${balance.tokenType}_${Date.now()}`, // Generate ID
                    walletId: 'current_wallet', // Would be actual wallet ID
                    tokenType: balance.tokenType,
                    balance: balance.balance,
                    lastUpdated: balance.lastUpdated,
                    createdAt: balance.lastUpdated,
                    updatedAt: balance.lastUpdated,
                };
            });

            return balances;
        } catch (error) {
            console.error('Failed to get wallet balances:', error);
            throw error;
        }
    }

    /**
     * Connect wallet
     */
    static async connectWallet(userId: string, walletAddress: string): Promise<Wallet> {
        try {
            const token = localStorage.getItem('accessToken');
            if (!token) {
                throw new Error('No authentication token available');
            }

            const response = await WalletApiClient.connectWallet({
                walletType: 'phantom', // Default, would be determined by wallet provider
                address: walletAddress,
                publicKey: walletAddress, // Would be actual public key
            }, token);

            return {
                id: response.id,
                userId,
                address: response.address,
                publicKey: response.publicKey,
                walletType: response.walletType,
                isActive: true,
                status: 'active',
                createdAt: response.createdAt,
                updatedAt: response.createdAt,
            };
        } catch (error) {
            console.error('Failed to connect wallet:', error);
            throw error;
        }
    }

    /**
     * Disconnect wallet
     */
    static async disconnectWallet(_userId: string, _walletAddress: string): Promise<void> {
        try {
            const token = localStorage.getItem('accessToken');
            if (!token) {
                throw new Error('No authentication token available');
            }

            await WalletApiClient.deleteWallet(token);
        } catch (error) {
            console.error('Failed to disconnect wallet:', error);
            throw error;
        }
    }

    /**
     * Swap currencies
     */
    static async swapCurrencies(_userId: string, _fromCurrency: string, _toCurrency: string, amount: number): Promise<SwapResponse> {
        try {
            // This would be implemented based on the actual swap API
            // For now, return a mock response
            return {
                transactionId: `swap_${Date.now()}`,
                fromAmount: amount.toString(),
                toAmount: (amount * 0.95).toString(), // Mock exchange rate
                exchangeRate: '0.95',
                fee: (amount * 0.01).toString(),
                estimatedTime: '2-5 minutes',
            };
        } catch (error) {
            console.error('Failed to swap currencies:', error);
            throw error;
        }
    }

    /**
     * Get transaction fees
     */
    static async getTransactionFees(amount: number, currency: string): Promise<TransactionFee> {
        try {
            // Mock implementation - would call actual fee calculation API
            return {
                currency,
                amount: (amount * 0.01).toString(), // 1% fee
                usdValue: (amount * 0.01 * 1.0).toString(), // Mock USD conversion
            };
        } catch (error) {
            console.error('Failed to get transaction fees:', error);
            throw error;
        }
    }

    /**
     * Create new wallet
     */
    static async createWallet(_userId: string, walletData: {
        address: string;
        publicKey: string;
        walletType: 'web3auth_mpc' | 'phantom' | 'solflare';
    }): Promise<Wallet> {
        try {
            const token = localStorage.getItem('accessToken');
            if (!token) {
                throw new Error('No authentication token available');
            }

            const response = await WalletApiClient.createWallet(walletData, token);

            return {
                id: response.id,
                userId: _userId,
                address: response.address,
                publicKey: response.publicKey,
                walletType: response.walletType,
                isActive: true,
                status: 'active',
                createdAt: response.createdAt,
                updatedAt: response.createdAt,
            };
        } catch (error) {
            console.error('Failed to create wallet:', error);
            throw error;
        }
    }

    /**
     * Transfer funds
     */
    static async transferFunds(transferData: {
        toAddress: string;
        amount: string;
        tokenType: 'USDC' | 'EURC' | 'SOL';
        description?: string;
    }): Promise<{ transactionId: string }> {
        try {
            const token = localStorage.getItem('accessToken');
            if (!token) {
                throw new Error('No authentication token available');
            }

            await WalletApiClient.transfer(transferData, token);

            return {
                transactionId: `transfer_${Date.now()}`,
            };
        } catch (error) {
            console.error('Failed to transfer funds:', error);
            throw error;
        }
    }
}