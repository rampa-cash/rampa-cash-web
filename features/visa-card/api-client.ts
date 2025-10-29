import { serverRequest } from '../../lib/api-client';
import { API_ENDPOINTS } from '../../lib/constants';
import type {
    CreateVISACardRequest,
    UpdateVISACardRequest,
    VISACardResponse,
    VISACardStats,
    SpendingLimitsCheck,
} from './types';

/**
 * VISA Card feature-specific API client
 * Handles all VISA card-related API calls to the backend
 * Aligned with OpenAPI specification
 */
export class VISACardApiClient {
    /**
     * Get VISA card details
     * GET /visa-card
     */
    static async getVISACard(token: string): Promise<VISACardResponse> {
        return serverRequest<VISACardResponse>(
            'GET',
            API_ENDPOINTS.visaCard.get,
            token
        );
    }

    /**
     * Create VISA card
     * POST /visa-card
     */
    static async createVISACard(
        data: CreateVISACardRequest,
        token: string
    ): Promise<VISACardResponse> {
        return serverRequest<VISACardResponse>(
            'POST',
            API_ENDPOINTS.visaCard.create,
            token,
            data
        );
    }

    /**
     * Get all VISA cards
     * GET /visa-card/all
     */
    static async getAllVISACards(token: string): Promise<VISACardResponse[]> {
        return serverRequest<VISACardResponse[]>(
            'GET',
            API_ENDPOINTS.visaCard.all,
            token
        );
    }

    /**
     * Get VISA cards by status
     * GET /visa-card/by-status/{status}
     */
    static async getVISACardsByStatus(
        status: 'pending' | 'active' | 'suspended' | 'cancelled',
        token: string
    ): Promise<VISACardResponse[]> {
        return serverRequest<VISACardResponse[]>(
            'GET',
            `${API_ENDPOINTS.visaCard.byStatus}/${status}`,
            token
        );
    }

    /**
     * Get expired VISA cards
     * GET /visa-card/expired
     */
    static async getExpiredVISACards(
        token: string
    ): Promise<VISACardResponse[]> {
        return serverRequest<VISACardResponse[]>(
            'GET',
            API_ENDPOINTS.visaCard.expired,
            token
        );
    }

    /**
     * Get VISA card statistics
     * GET /visa-card/stats
     */
    static async getVISACardStats(token: string): Promise<VISACardStats> {
        return serverRequest<VISACardStats>(
            'GET',
            API_ENDPOINTS.visaCard.stats,
            token
        );
    }

    /**
     * Get specific VISA card
     * GET /visa-card/{id}
     */
    static async getVISACardById(
        id: string,
        token: string
    ): Promise<VISACardResponse> {
        return serverRequest<VISACardResponse>(
            'GET',
            `${API_ENDPOINTS.visaCard.getById}/${id}`,
            token
        );
    }

    /**
     * Update VISA card
     * PUT /visa-card/{id}
     */
    static async updateVISACard(
        id: string,
        data: UpdateVISACardRequest,
        token: string
    ): Promise<VISACardResponse> {
        return serverRequest<VISACardResponse>(
            'PUT',
            `${API_ENDPOINTS.visaCard.update}/${id}`,
            token,
            data
        );
    }

    /**
     * Activate VISA card
     * POST /visa-card/{id}/activate
     */
    static async activateVISACard(
        id: string,
        token: string
    ): Promise<{
        id: string;
        status: string;
        activatedAt: string;
    }> {
        return serverRequest<{
            id: string;
            status: string;
            activatedAt: string;
        }>('POST', `${API_ENDPOINTS.visaCard.activate}/${id}`, token);
    }

    /**
     * Suspend VISA card
     * POST /visa-card/{id}/suspend
     */
    static async suspendVISACard(
        id: string,
        token: string
    ): Promise<{
        id: string;
        status: string;
    }> {
        return serverRequest<{
            id: string;
            status: string;
        }>('POST', `${API_ENDPOINTS.visaCard.suspend}/${id}`, token);
    }

    /**
     * Reactivate VISA card
     * POST /visa-card/{id}/reactivate
     */
    static async reactivateVISACard(
        id: string,
        token: string
    ): Promise<{
        id: string;
        status: string;
    }> {
        return serverRequest<{
            id: string;
            status: string;
        }>('POST', `${API_ENDPOINTS.visaCard.reactivate}/${id}`, token);
    }

    /**
     * Cancel VISA card
     * POST /visa-card/{id}/cancel
     */
    static async cancelVISACard(
        id: string,
        token: string
    ): Promise<{
        id: string;
        status: string;
    }> {
        return serverRequest<{
            id: string;
            status: string;
        }>('POST', `${API_ENDPOINTS.visaCard.cancel}/${id}`, token);
    }

    /**
     * Update VISA card balance
     * POST /visa-card/{id}/update-balance
     */
    static async updateVISACardBalance(
        id: string,
        amount: string,
        token: string
    ): Promise<{
        id: string;
        balance: string;
    }> {
        return serverRequest<{
            id: string;
            balance: string;
        }>('POST', `${API_ENDPOINTS.visaCard.updateBalance}/${id}`, token, {
            amount,
        });
    }

    /**
     * Check VISA card spending limits
     * POST /visa-card/{id}/check-spending-limits
     */
    static async checkVISACardSpendingLimits(
        id: string,
        amount: string,
        token: string
    ): Promise<SpendingLimitsCheck> {
        return serverRequest<SpendingLimitsCheck>(
            'POST',
            `${API_ENDPOINTS.visaCard.checkLimits}/${id}`,
            token,
            { amount }
        );
    }
}
