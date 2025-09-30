import { VISACardApiClient } from '../api-client';
import type { 
    VISACard, 
    CreateVISACardRequest,
    UpdateVISACardRequest,
    VISACardStats,
    SpendingLimitsCheck
} from '../types';

/**
 * VISA Card service for handling VISA card logic
 * Uses VISACardApiClient for API calls and manages local state
 */
export class VISACardService {
    /**
     * Get VISA card for a user
     */
    static async getVISACard(_userId: string): Promise<VISACard | null> {
        try {
            const token = localStorage.getItem('accessToken');
            if (!token) {
                throw new Error('No authentication token available');
            }

            const response = await VISACardApiClient.getVISACard(token);
            
            return {
                id: response.id,
                userId: _userId,
                cardNumber: response.cardNumber,
                cardType: response.cardType,
                status: response.status,
                balance: response.balance,
                dailyLimit: response.dailyLimit,
                monthlyLimit: response.monthlyLimit,
                createdAt: response.createdAt,
                activatedAt: response.activatedAt || undefined,
                expiresAt: response.expiresAt,
            };
        } catch (error) {
            console.error('Failed to get VISA card:', error);
            return null;
        }
    }

    /**
     * Create VISA card
     */
    static async createVISACard(_userId: string, data: CreateVISACardRequest): Promise<VISACard> {
        try {
            const token = localStorage.getItem('accessToken');
            if (!token) {
                throw new Error('No authentication token available');
            }

            const response = await VISACardApiClient.createVISACard(data, token);
            
            return {
                id: response.id,
                userId: _userId,
                cardNumber: response.cardNumber,
                cardType: response.cardType,
                status: response.status,
                balance: response.balance,
                dailyLimit: response.dailyLimit,
                monthlyLimit: response.monthlyLimit,
                createdAt: response.createdAt,
                activatedAt: response.activatedAt || undefined,
                expiresAt: response.expiresAt,
            };
        } catch (error) {
            console.error('Failed to create VISA card:', error);
            throw error;
        }
    }

    /**
     * Get all VISA cards for a user
     */
    static async getAllVISACards(_userId: string): Promise<VISACard[]> {
        try {
            const token = localStorage.getItem('accessToken');
            if (!token) {
                throw new Error('No authentication token available');
            }

            const response = await VISACardApiClient.getAllVISACards(token);
            
            return response.map(card => ({
                id: card.id,
                userId: _userId,
                cardNumber: card.cardNumber,
                cardType: card.cardType,
                status: card.status,
                balance: card.balance,
                dailyLimit: card.dailyLimit,
                monthlyLimit: card.monthlyLimit,
                createdAt: card.createdAt,
                activatedAt: card.activatedAt,
                expiresAt: card.expiresAt,
            }));
        } catch (error) {
            console.error('Failed to get all VISA cards:', error);
            throw error;
        }
    }

    /**
     * Update VISA card
     */
    static async updateVISACard(_userId: string, cardId: string, data: UpdateVISACardRequest): Promise<VISACard> {
        try {
            const token = localStorage.getItem('accessToken');
            if (!token) {
                throw new Error('No authentication token available');
            }

            const response = await VISACardApiClient.updateVISACard(cardId, data, token);
            
            return {
                id: response.id,
                userId: _userId,
                cardNumber: response.cardNumber,
                cardType: response.cardType,
                status: response.status,
                balance: response.balance,
                dailyLimit: response.dailyLimit,
                monthlyLimit: response.monthlyLimit,
                createdAt: response.createdAt,
                activatedAt: response.activatedAt || undefined,
                expiresAt: response.expiresAt,
            };
        } catch (error) {
            console.error('Failed to update VISA card:', error);
            throw error;
        }
    }

    /**
     * Activate VISA card
     */
    static async activateVISACard(_userId: string, cardId: string): Promise<void> {
        try {
            const token = localStorage.getItem('accessToken');
            if (!token) {
                throw new Error('No authentication token available');
            }

            await VISACardApiClient.activateVISACard(cardId, token);
        } catch (error) {
            console.error('Failed to activate VISA card:', error);
            throw error;
        }
    }

    /**
     * Suspend VISA card
     */
    static async suspendVISACard(_userId: string, cardId: string): Promise<void> {
        try {
            const token = localStorage.getItem('accessToken');
            if (!token) {
                throw new Error('No authentication token available');
            }

            await VISACardApiClient.suspendVISACard(cardId, token);
        } catch (error) {
            console.error('Failed to suspend VISA card:', error);
            throw error;
        }
    }

    /**
     * Reactivate VISA card
     */
    static async reactivateVISACard(_userId: string, cardId: string): Promise<void> {
        try {
            const token = localStorage.getItem('accessToken');
            if (!token) {
                throw new Error('No authentication token available');
            }

            await VISACardApiClient.reactivateVISACard(cardId, token);
        } catch (error) {
            console.error('Failed to reactivate VISA card:', error);
            throw error;
        }
    }

    /**
     * Cancel VISA card
     */
    static async cancelVISACard(_userId: string, cardId: string): Promise<void> {
        try {
            const token = localStorage.getItem('accessToken');
            if (!token) {
                throw new Error('No authentication token available');
            }

            await VISACardApiClient.cancelVISACard(cardId, token);
        } catch (error) {
            console.error('Failed to cancel VISA card:', error);
            throw error;
        }
    }

    /**
     * Update VISA card balance
     */
    static async updateVISACardBalance(_userId: string, cardId: string, amount: string): Promise<{ balance: string }> {
        try {
            const token = localStorage.getItem('accessToken');
            if (!token) {
                throw new Error('No authentication token available');
            }

            const response = await VISACardApiClient.updateVISACardBalance(cardId, amount, token);
            return { balance: response.balance };
        } catch (error) {
            console.error('Failed to update VISA card balance:', error);
            throw error;
        }
    }

    /**
     * Check VISA card spending limits
     */
    static async checkVISACardSpendingLimits(_userId: string, cardId: string, amount: string): Promise<SpendingLimitsCheck> {
        try {
            const token = localStorage.getItem('accessToken');
            if (!token) {
                throw new Error('No authentication token available');
            }

            return await VISACardApiClient.checkVISACardSpendingLimits(cardId, amount, token);
        } catch (error) {
            console.error('Failed to check VISA card spending limits:', error);
            throw error;
        }
    }

    /**
     * Get VISA card statistics
     */
    static async getVISACardStats(_userId: string): Promise<VISACardStats> {
        try {
            const token = localStorage.getItem('accessToken');
            if (!token) {
                throw new Error('No authentication token available');
            }

            return await VISACardApiClient.getVISACardStats(token);
        } catch (error) {
            console.error('Failed to get VISA card stats:', error);
            throw error;
        }
    }
}
