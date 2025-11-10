import { RampApiClient } from '../api-client';
import type {
    OnOffRamp,
    OnRampRequest,
    OffRampRequest,
    RampStats,
} from '../types';

/**
 * Ramp service for handling onramp/offramp logic
 * Uses RampApiClient for API calls and manages local state
 */
export class RampService {
    /**
     * Initiate on-ramp (fiat to crypto)
     */
    static async initiateOnRamp(
        userId: string,
        walletId: string,
        data: OnRampRequest
    ): Promise<OnOffRamp> {
        try {
            const token = localStorage.getItem('accessToken');
            if (!token) {
                throw new Error('No authentication token available');
            }

            const response = await RampApiClient.initiateOnRamp(data, token);

            return {
                id: response.id,
                userId,
                walletId,
                type: 'onramp',
                amount: response.amount,
                fiatAmount: response.fiatAmount,
                fiatCurrency: response.fiatCurrency,
                tokenType: response.tokenType,
                status: response.status,
                provider: response.provider,
                providerTransactionId:
                    response.providerTransactionId || undefined,
                exchangeRate: response.exchangeRate,
                fee: response.fee,
                createdAt: response.createdAt,
                completedAt: response.completedAt || undefined,
                failedAt: response.failedAt || undefined,
                failureReason: response.failureReason || undefined,
            };
        } catch (error) {
            console.error('Failed to initiate on-ramp:', error);
            throw error;
        }
    }

    /**
     * Initiate off-ramp (crypto to fiat)
     */
    static async initiateOffRamp(
        userId: string,
        walletId: string,
        data: OffRampRequest
    ): Promise<OnOffRamp> {
        try {
            const token = localStorage.getItem('accessToken');
            if (!token) {
                throw new Error('No authentication token available');
            }

            const response = await RampApiClient.initiateOffRamp(data, token);

            return {
                id: response.id,
                userId,
                walletId,
                type: 'offramp',
                amount: response.amount,
                fiatAmount: response.fiatAmount,
                fiatCurrency: response.fiatCurrency,
                tokenType: response.tokenType,
                status: response.status,
                provider: 'bank_provider', // Default provider
                providerTransactionId: undefined,
                exchangeRate: response.exchangeRate,
                fee: response.fee,
                createdAt: response.createdAt,
                completedAt: undefined,
                failedAt: undefined,
                failureReason: undefined,
            };
        } catch (error) {
            console.error('Failed to initiate off-ramp:', error);
            throw error;
        }
    }

    /**
     * Get on-ramps for a user
     */
    static async getOnRamps(
        userId: string,
        status?: string,
        limit?: number,
        offset?: number
    ): Promise<OnOffRamp[]> {
        try {
            const token = localStorage.getItem('accessToken');
            if (!token) {
                throw new Error('No authentication token available');
            }

            const response = await RampApiClient.getOnRamps(
                status,
                limit,
                offset,
                token
            );

            return response.map(ramp => ({
                id: ramp.id,
                userId,
                walletId: ramp.walletId,
                type: 'onramp',
                amount: ramp.amount,
                fiatAmount: ramp.fiatAmount,
                fiatCurrency: ramp.fiatCurrency,
                tokenType: ramp.tokenType,
                status: ramp.status,
                provider: ramp.provider,
                providerTransactionId: ramp.providerTransactionId,
                exchangeRate: ramp.exchangeRate,
                fee: ramp.fee,
                createdAt: ramp.createdAt,
                completedAt: ramp.completedAt,
                failedAt: ramp.failedAt,
                failureReason: ramp.failureReason,
            }));
        } catch (error) {
            console.error('Failed to get on-ramps:', error);
            throw error;
        }
    }

    /**
     * Get off-ramps for a user
     */
    static async getOffRamps(
        userId: string,
        status?: string,
        limit?: number,
        offset?: number
    ): Promise<OnOffRamp[]> {
        try {
            const token = localStorage.getItem('accessToken');
            if (!token) {
                throw new Error('No authentication token available');
            }

            const response = await RampApiClient.getOffRamps(
                status,
                limit,
                offset,
                token
            );

            return response.map(ramp => ({
                id: ramp.id,
                userId,
                walletId: 'current_wallet', // Would be actual wallet ID
                type: 'offramp',
                amount: ramp.amount,
                fiatAmount: ramp.fiatAmount,
                fiatCurrency: ramp.fiatCurrency,
                tokenType: ramp.tokenType,
                status: ramp.status,
                provider: 'bank_provider',
                providerTransactionId: undefined,
                exchangeRate: ramp.exchangeRate,
                fee: ramp.fee,
                createdAt: ramp.createdAt,
                completedAt: undefined,
                failedAt: undefined,
                failureReason: undefined,
            }));
        } catch (error) {
            console.error('Failed to get off-ramps:', error);
            throw error;
        }
    }

    /**
     * Get pending on-ramps
     */
    static async getPendingOnRamps(userId: string): Promise<OnOffRamp[]> {
        try {
            const token = localStorage.getItem('accessToken');
            if (!token) {
                throw new Error('No authentication token available');
            }

            const response = await RampApiClient.getPendingOnRamps(token);

            return response.map(ramp => ({
                id: ramp.id,
                userId,
                walletId: ramp.walletId,
                type: 'onramp',
                amount: ramp.amount,
                fiatAmount: ramp.fiatAmount,
                fiatCurrency: ramp.fiatCurrency,
                tokenType: ramp.tokenType,
                status: ramp.status,
                provider: ramp.provider,
                providerTransactionId: ramp.providerTransactionId,
                exchangeRate: ramp.exchangeRate,
                fee: ramp.fee,
                createdAt: ramp.createdAt,
                completedAt: ramp.completedAt,
                failedAt: ramp.failedAt,
                failureReason: ramp.failureReason,
            }));
        } catch (error) {
            console.error('Failed to get pending on-ramps:', error);
            throw error;
        }
    }

    /**
     * Get pending off-ramps
     */
    static async getPendingOffRamps(userId: string): Promise<OnOffRamp[]> {
        try {
            const token = localStorage.getItem('accessToken');
            if (!token) {
                throw new Error('No authentication token available');
            }

            const response = await RampApiClient.getPendingOffRamps(token);

            return response.map(ramp => ({
                id: ramp.id,
                userId,
                walletId: 'current_wallet',
                type: 'offramp',
                amount: ramp.amount,
                fiatAmount: ramp.fiatAmount,
                fiatCurrency: ramp.fiatCurrency,
                tokenType: ramp.tokenType,
                status: ramp.status,
                provider: 'bank_provider',
                providerTransactionId: undefined,
                exchangeRate: ramp.exchangeRate,
                fee: ramp.fee,
                createdAt: ramp.createdAt,
                completedAt: undefined,
                failedAt: undefined,
                failureReason: undefined,
            }));
        } catch (error) {
            console.error('Failed to get pending off-ramps:', error);
            throw error;
        }
    }

    /**
     * Get ramp statistics
     */
    static async getRampStats(
        _userId: string,
        startDate?: string,
        endDate?: string
    ): Promise<RampStats> {
        try {
            const token = localStorage.getItem('accessToken');
            if (!token) {
                throw new Error('No authentication token available');
            }

            // Get both on-ramp and off-ramp stats
            const [onRampStats, offRampStats] = await Promise.all([
                RampApiClient.getOnRampStats(startDate, endDate, token),
                RampApiClient.getOffRampStats(startDate, endDate, token),
            ]);

            return {
                totalOnRamp: onRampStats.totalOnRamp,
                totalOffRamp: offRampStats.totalOffRamp,
                totalFees: onRampStats.totalFees + offRampStats.totalFees,
                completedOnRamp: onRampStats.completedOnRamp,
                completedOffRamp: offRampStats.completedOffRamp,
                failedOnRamp: onRampStats.failedOnRamp,
                failedOffRamp: offRampStats.failedOffRamp,
            };
        } catch (error) {
            console.error('Failed to get ramp stats:', error);
            throw error;
        }
    }

    /**
     * Process on-ramp
     */
    static async processOnRamp(
        rampId: string,
        providerTransactionId: string
    ): Promise<void> {
        try {
            const token = localStorage.getItem('accessToken');
            if (!token) {
                throw new Error('No authentication token available');
            }

            await RampApiClient.processOnRamp(
                rampId,
                providerTransactionId,
                token
            );
        } catch (error) {
            console.error('Failed to process on-ramp:', error);
            throw error;
        }
    }

    /**
     * Process off-ramp
     */
    static async processOffRamp(
        rampId: string,
        providerTransactionId: string
    ): Promise<void> {
        try {
            const token = localStorage.getItem('accessToken');
            if (!token) {
                throw new Error('No authentication token available');
            }

            await RampApiClient.processOffRamp(
                rampId,
                providerTransactionId,
                token
            );
        } catch (error) {
            console.error('Failed to process off-ramp:', error);
            throw error;
        }
    }
}
