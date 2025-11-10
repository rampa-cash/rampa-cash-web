import { useState, useEffect, useCallback } from 'react';
import { WalletService } from '../services/wallet.service';
import type { WalletBalance, TransactionFee } from '../types';

interface UseWalletReturn {
    // State
    balances: { [key: string]: WalletBalance };
    isLoading: boolean;
    error: string | null;

    // Actions
    fetchBalances: () => Promise<void>;
    connectWallet: (walletAddress: string) => Promise<void>;
    disconnectWallet: (walletAddress: string) => Promise<void>;
    swapCurrencies: (
        fromCurrency: string,
        toCurrency: string,
        amount: number
    ) => Promise<void>;
    getTransactionFees: (
        amount: number,
        currency: string
    ) => Promise<TransactionFee>;
    clearError: () => void;
}

export const useWallet = (userId: string): UseWalletReturn => {
    const [balances, setBalances] = useState<{ [key: string]: WalletBalance }>(
        {}
    );
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    /**
     * Fetch wallet balances
     */
    const fetchBalances = useCallback(async () => {
        try {
            setIsLoading(true);
            setError(null);

            const fetchedBalances = await WalletService.getBalances(userId);
            setBalances(fetchedBalances);
        } catch (err: any) {
            setError(err.message || 'Failed to fetch balances');
        } finally {
            setIsLoading(false);
        }
    }, [userId]);

    /**
     * Connect wallet
     */
    const connectWallet = useCallback(
        async (walletAddress: string) => {
            try {
                setIsLoading(true);
                setError(null);

                await WalletService.connectWallet(userId, walletAddress);
                await fetchBalances(); // Refresh balances after connecting
            } catch (err: any) {
                setError(err.message || 'Failed to connect wallet');
                throw err;
            } finally {
                setIsLoading(false);
            }
        },
        [userId, fetchBalances]
    );

    /**
     * Disconnect wallet
     */
    const disconnectWallet = useCallback(
        async (walletAddress: string) => {
            try {
                setIsLoading(true);
                setError(null);

                await WalletService.disconnectWallet(userId, walletAddress);
                await fetchBalances(); // Refresh balances after disconnecting
            } catch (err: any) {
                setError(err.message || 'Failed to disconnect wallet');
                throw err;
            } finally {
                setIsLoading(false);
            }
        },
        [userId, fetchBalances]
    );

    /**
     * Swap currencies
     */
    const swapCurrencies = useCallback(
        async (fromCurrency: string, toCurrency: string, amount: number) => {
            try {
                setIsLoading(true);
                setError(null);

                await WalletService.swapCurrencies(
                    userId,
                    fromCurrency,
                    toCurrency,
                    amount
                );
                await fetchBalances(); // Refresh balances after swap
            } catch (err: any) {
                setError(err.message || 'Failed to swap currencies');
                throw err;
            } finally {
                setIsLoading(false);
            }
        },
        [userId, fetchBalances]
    );

    /**
     * Get transaction fees
     */
    const getTransactionFees = useCallback(
        async (amount: number, currency: string): Promise<TransactionFee> => {
            try {
                return await WalletService.getTransactionFees(amount, currency);
            } catch (err: any) {
                console.error('Failed to get transaction fees:', err);
                throw err;
            }
        },
        []
    );

    /**
     * Clear error
     */
    const clearError = useCallback(() => {
        setError(null);
    }, []);

    /**
     * Initialize wallet on mount
     */
    useEffect(() => {
        if (userId) {
            fetchBalances();
        }
    }, [userId, fetchBalances]);

    return {
        balances,
        isLoading,
        error,
        fetchBalances,
        connectWallet,
        disconnectWallet,
        swapCurrencies,
        getTransactionFees,
        clearError,
    };
};
