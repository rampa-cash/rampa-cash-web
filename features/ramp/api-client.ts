import { serverRequest } from '../../lib/api-client';
import { API_ENDPOINTS } from '../../lib/constants';
import type { 
    OnRampRequest,
    OffRampRequest,
    OnRampResponse,
    OffRampResponse,
    RampStats
} from './types';

/**
 * Ramp feature-specific API client
 * Handles all onramp/offramp-related API calls to the backend
 * Aligned with OpenAPI specification
 */
export class RampApiClient {
    /**
     * Initiate fiat to crypto conversion
     * POST /onramp/initiate
     */
    static async initiateOnRamp(data: OnRampRequest, token: string): Promise<OnRampResponse> {
        return serverRequest<OnRampResponse>(
            'POST',
            API_ENDPOINTS.onramp.initiate,
            token,
            data
        );
    }

    /**
     * Get all on-ramps
     * GET /onramp
     */
    static async getOnRamps(status?: string, limit?: number, offset?: number, token?: string): Promise<OnRampResponse[]> {
        const queryParams = new URLSearchParams();
        if (status) queryParams.append('status', status);
        if (limit) queryParams.append('limit', limit.toString());
        if (offset) queryParams.append('offset', offset.toString());

        const url = `${API_ENDPOINTS.onramp.list}${queryParams.toString() ? `?${queryParams.toString()}` : ''}`;
        
        return serverRequest<OnRampResponse[]>(
            'GET',
            url,
            token
        );
    }

    /**
     * Get pending on-ramps
     * GET /onramp/pending
     */
    static async getPendingOnRamps(token: string): Promise<OnRampResponse[]> {
        return serverRequest<OnRampResponse[]>(
            'GET',
            API_ENDPOINTS.onramp.pending,
            token
        );
    }

    /**
     * Get on-ramp statistics
     * GET /onramp/stats/summary
     */
    static async getOnRampStats(startDate?: string, endDate?: string, token?: string): Promise<RampStats> {
        const queryParams = new URLSearchParams();
        if (startDate) queryParams.append('startDate', startDate);
        if (endDate) queryParams.append('endDate', endDate);

        const url = `${API_ENDPOINTS.onramp.stats}${queryParams.toString() ? `?${queryParams.toString()}` : ''}`;
        
        return serverRequest<RampStats>(
            'GET',
            url,
            token
        );
    }

    /**
     * Get specific on-ramp
     * GET /onramp/{id}
     */
    static async getOnRamp(id: string, token: string): Promise<OnRampResponse> {
        return serverRequest<OnRampResponse>(
            'GET',
            `${API_ENDPOINTS.onramp.get}/${id}`,
            token
        );
    }

    /**
     * Process on-ramp
     * POST /onramp/{id}
     */
    static async processOnRamp(id: string, providerTransactionId: string, token: string): Promise<{
        id: string;
        status: string;
        providerTransactionId: string;
        completedAt: string;
    }> {
        return serverRequest<{
            id: string;
            status: string;
            providerTransactionId: string;
            completedAt: string;
        }>(
            'POST',
            `${API_ENDPOINTS.onramp.process}/${id}`,
            token,
            { providerTransactionId }
        );
    }

    /**
     * Fail on-ramp
     * POST /onramp/{id}/fail
     */
    static async failOnRamp(id: string, failureReason: string, token: string): Promise<{
        id: string;
        status: string;
        failureReason: string;
        failedAt: string;
    }> {
        return serverRequest<{
            id: string;
            status: string;
            failureReason: string;
            failedAt: string;
        }>(
            'POST',
            `${API_ENDPOINTS.onramp.fail}/${id}`,
            token,
            { failureReason }
        );
    }

    /**
     * Get on-ramp by provider
     * GET /onramp/providers/{provider}/transaction/{providerTransactionId}
     */
    static async getOnRampByProvider(provider: string, providerTransactionId: string, token: string): Promise<OnRampResponse> {
        return serverRequest<OnRampResponse>(
            'GET',
            `${API_ENDPOINTS.onramp.byProvider}/${provider}/transaction/${providerTransactionId}`,
            token
        );
    }

    /**
     * Initiate crypto to fiat conversion
     * POST /offramp/initiate
     */
    static async initiateOffRamp(data: OffRampRequest, token: string): Promise<OffRampResponse> {
        return serverRequest<OffRampResponse>(
            'POST',
            API_ENDPOINTS.offramp.initiate,
            token,
            data
        );
    }

    /**
     * Get all off-ramps
     * GET /offramp
     */
    static async getOffRamps(status?: string, limit?: number, offset?: number, token?: string): Promise<OffRampResponse[]> {
        const queryParams = new URLSearchParams();
        if (status) queryParams.append('status', status);
        if (limit) queryParams.append('limit', limit.toString());
        if (offset) queryParams.append('offset', offset.toString());

        const url = `${API_ENDPOINTS.offramp.list}${queryParams.toString() ? `?${queryParams.toString()}` : ''}`;
        
        return serverRequest<OffRampResponse[]>(
            'GET',
            url,
            token
        );
    }

    /**
     * Get pending off-ramps
     * GET /offramp/pending
     */
    static async getPendingOffRamps(token: string): Promise<OffRampResponse[]> {
        return serverRequest<OffRampResponse[]>(
            'GET',
            API_ENDPOINTS.offramp.pending,
            token
        );
    }

    /**
     * Get off-ramp statistics
     * GET /offramp/stats/summary
     */
    static async getOffRampStats(startDate?: string, endDate?: string, token?: string): Promise<RampStats> {
        const queryParams = new URLSearchParams();
        if (startDate) queryParams.append('startDate', startDate);
        if (endDate) queryParams.append('endDate', endDate);

        const url = `${API_ENDPOINTS.offramp.stats}${queryParams.toString() ? `?${queryParams.toString()}` : ''}`;
        
        return serverRequest<RampStats>(
            'GET',
            url,
            token
        );
    }

    /**
     * Get specific off-ramp
     * GET /offramp/{id}
     */
    static async getOffRamp(id: string, token: string): Promise<OffRampResponse> {
        return serverRequest<OffRampResponse>(
            'GET',
            `${API_ENDPOINTS.offramp.get}/${id}`,
            token
        );
    }

    /**
     * Process off-ramp
     * POST /offramp/{id}
     */
    static async processOffRamp(id: string, providerTransactionId: string, token: string): Promise<{
        id: string;
        status: string;
        providerTransactionId: string;
        completedAt: string;
    }> {
        return serverRequest<{
            id: string;
            status: string;
            providerTransactionId: string;
            completedAt: string;
        }>(
            'POST',
            `${API_ENDPOINTS.offramp.process}/${id}`,
            token,
            { providerTransactionId }
        );
    }

    /**
     * Fail off-ramp
     * POST /offramp/{id}/fail
     */
    static async failOffRamp(id: string, failureReason: string, token: string): Promise<{
        id: string;
        status: string;
        failureReason: string;
        failedAt: string;
    }> {
        return serverRequest<{
            id: string;
            status: string;
            failureReason: string;
            failedAt: string;
        }>(
            'POST',
            `${API_ENDPOINTS.offramp.fail}/${id}`,
            token,
            { failureReason }
        );
    }

    /**
     * Get off-ramp by provider
     * GET /offramp/providers/{provider}/transaction/{providerTransactionId}
     */
    static async getOffRampByProvider(provider: string, providerTransactionId: string, token: string): Promise<OffRampResponse> {
        return serverRequest<OffRampResponse>(
            'GET',
            `${API_ENDPOINTS.offramp.byProvider}/${provider}/transaction/${providerTransactionId}`,
            token
        );
    }
}
