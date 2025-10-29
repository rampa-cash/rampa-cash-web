import { serverRequest } from '../../lib/api-client';
import { API_ENDPOINTS } from '../../lib/constants';
import type {
    CreateTransactionRequest,
    TransactionResponse,
    TransactionFilters,
    TransactionStats,
} from './types';

/**
 * Transaction feature-specific API client
 * Handles all transaction-related API calls to the backend
 * Aligned with OpenAPI specification
 */
export class TransactionApiClient {
    /**
     * Get transaction history
     * GET /transactions
     */
    static async getTransactions(
        filters: TransactionFilters,
        token: string
    ): Promise<TransactionResponse[]> {
        const queryParams = new URLSearchParams();
        if (filters.status) queryParams.append('status', filters.status);
        if (filters.tokenType)
            queryParams.append('tokenType', filters.tokenType);
        if (filters.limit)
            queryParams.append('limit', filters.limit.toString());
        if (filters.offset)
            queryParams.append('offset', filters.offset.toString());
        if (filters.startDate)
            queryParams.append('startDate', filters.startDate);
        if (filters.endDate) queryParams.append('endDate', filters.endDate);

        const url = `${API_ENDPOINTS.transactions.list}${queryParams.toString() ? `?${queryParams.toString()}` : ''}`;

        return serverRequest<TransactionResponse[]>('GET', url, token);
    }

    /**
     * Create new transaction
     * POST /transactions
     */
    static async createTransaction(
        data: CreateTransactionRequest,
        token: string
    ): Promise<TransactionResponse> {
        return serverRequest<TransactionResponse>(
            'POST',
            API_ENDPOINTS.transactions.create,
            token,
            data
        );
    }

    /**
     * Get sent transactions
     * GET /transactions/sent
     */
    static async getSentTransactions(
        limit?: number,
        offset?: number,
        token?: string
    ): Promise<TransactionResponse[]> {
        const queryParams = new URLSearchParams();
        if (limit) queryParams.append('limit', limit.toString());
        if (offset) queryParams.append('offset', offset.toString());

        const url = `${API_ENDPOINTS.transactions.sent}${queryParams.toString() ? `?${queryParams.toString()}` : ''}`;

        return serverRequest<TransactionResponse[]>('GET', url, token);
    }

    /**
     * Get received transactions
     * GET /transactions/received
     */
    static async getReceivedTransactions(
        limit?: number,
        offset?: number,
        token?: string
    ): Promise<TransactionResponse[]> {
        const queryParams = new URLSearchParams();
        if (limit) queryParams.append('limit', limit.toString());
        if (offset) queryParams.append('offset', offset.toString());

        const url = `${API_ENDPOINTS.transactions.received}${queryParams.toString() ? `?${queryParams.toString()}` : ''}`;

        return serverRequest<TransactionResponse[]>('GET', url, token);
    }

    /**
     * Get pending transactions
     * GET /transactions/pending
     */
    static async getPendingTransactions(
        token: string
    ): Promise<TransactionResponse[]> {
        return serverRequest<TransactionResponse[]>(
            'GET',
            API_ENDPOINTS.transactions.pending,
            token
        );
    }

    /**
     * Get transaction statistics
     * GET /transactions/stats/summary
     */
    static async getTransactionStats(
        startDate?: string,
        endDate?: string,
        token?: string
    ): Promise<TransactionStats> {
        const queryParams = new URLSearchParams();
        if (startDate) queryParams.append('startDate', startDate);
        if (endDate) queryParams.append('endDate', endDate);

        const url = `${API_ENDPOINTS.transactions.stats}${queryParams.toString() ? `?${queryParams.toString()}` : ''}`;

        return serverRequest<TransactionStats>('GET', url, token);
    }

    /**
     * Get transaction details
     * GET /transactions/{transactionId}
     */
    static async getTransaction(
        transactionId: string,
        token: string
    ): Promise<TransactionResponse> {
        return serverRequest<TransactionResponse>(
            'GET',
            `${API_ENDPOINTS.transactions.get}/${transactionId}`,
            token
        );
    }

    /**
     * Confirm transaction
     * POST /transactions/{transactionId}
     */
    static async confirmTransaction(
        transactionId: string,
        solanaTransactionHash: string,
        token: string
    ): Promise<{
        id: string;
        status: string;
        solanaTransactionHash: string;
        confirmedAt: string;
    }> {
        return serverRequest<{
            id: string;
            status: string;
            solanaTransactionHash: string;
            confirmedAt: string;
        }>(
            'POST',
            `${API_ENDPOINTS.transactions.confirm}/${transactionId}`,
            token,
            { solanaTransactionHash }
        );
    }

    /**
     * Cancel transaction
     * POST /transactions/{transactionId}/cancel
     */
    static async cancelTransaction(
        transactionId: string,
        token: string
    ): Promise<{
        id: string;
        status: string;
    }> {
        return serverRequest<{
            id: string;
            status: string;
        }>(
            'POST',
            `${API_ENDPOINTS.transactions.cancel}/${transactionId}`,
            token
        );
    }
}
