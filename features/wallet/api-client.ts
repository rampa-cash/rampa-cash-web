import { serverRequest } from '../../lib/api-client';
import { API_ENDPOINTS } from '../../lib/constants';
import type {
    CreateWalletRequest,
    UpdateWalletRequest,
    ConnectWalletRequest,
    WalletResponse,
    WalletBalanceResponse,
    TransferRequest,
} from './types';

/**
 * Wallet feature-specific API client
 * Handles all wallet-related API calls to the backend
 * Aligned with OpenAPI specification
 */
export class WalletApiClient {
    /**
     * Create new wallet
     * POST /wallet
     */
    static async createWallet(
        data: CreateWalletRequest,
        token: string
    ): Promise<WalletResponse> {
        return serverRequest<WalletResponse>(
            'POST',
            API_ENDPOINTS.wallet.create,
            token,
            data
        );
    }

    /**
     * Get wallet details
     * GET /wallet
     */
    static async getWallet(token: string): Promise<WalletResponse> {
        return serverRequest<WalletResponse>(
            'GET',
            API_ENDPOINTS.wallet.get,
            token
        );
    }

    /**
     * Update wallet
     * PUT /wallet
     */
    static async updateWallet(
        data: UpdateWalletRequest,
        token: string
    ): Promise<WalletResponse> {
        return serverRequest<WalletResponse>(
            'PUT',
            API_ENDPOINTS.wallet.update,
            token,
            data
        );
    }

    /**
     * Disconnect wallet
     * DELETE /wallet
     */
    static async deleteWallet(token: string): Promise<{ message: string }> {
        return serverRequest<{ message: string }>(
            'DELETE',
            API_ENDPOINTS.wallet.delete,
            token
        );
    }

    /**
     * Get specific wallet balance
     * GET /wallet/balance
     */
    static async getWalletBalance(
        tokenType: 'USDC' | 'EURC' | 'SOL',
        token: string
    ): Promise<{
        walletId: string;
        tokenType: 'USDC' | 'EURC' | 'SOL';
        balance: string;
    }> {
        return serverRequest<{
            walletId: string;
            tokenType: 'USDC' | 'EURC' | 'SOL';
            balance: string;
        }>('GET', API_ENDPOINTS.wallet.balance, token, { tokenType });
    }

    /**
     * Get all wallet balances
     * GET /wallet/balances
     */
    static async getWalletBalances(
        token: string
    ): Promise<WalletBalanceResponse> {
        return serverRequest<WalletBalanceResponse>(
            'GET',
            API_ENDPOINTS.wallet.balances,
            token
        );
    }

    /**
     * Connect existing wallet
     * POST /wallet/connect
     */
    static async connectWallet(
        data: ConnectWalletRequest,
        token: string
    ): Promise<WalletResponse> {
        return serverRequest<WalletResponse>(
            'POST',
            API_ENDPOINTS.wallet.connect,
            token,
            data
        );
    }

    /**
     * Transfer funds
     * POST /wallet/transfer
     */
    static async transfer(
        data: TransferRequest,
        token: string
    ): Promise<{
        message: string;
        fromWallet: string;
        toAddress: string;
        amount: string;
        tokenType: 'USDC' | 'EURC' | 'SOL';
    }> {
        return serverRequest<{
            message: string;
            fromWallet: string;
            toAddress: string;
            amount: string;
            tokenType: 'USDC' | 'EURC' | 'SOL';
        }>('POST', API_ENDPOINTS.wallet.transfer, token, data);
    }

    /**
     * Suspend wallet
     * POST /wallet/suspend
     */
    static async suspendWallet(token: string): Promise<{
        message: string;
        wallet: {
            id: string;
            status: string;
        };
    }> {
        return serverRequest<{
            message: string;
            wallet: {
                id: string;
                status: string;
            };
        }>('POST', API_ENDPOINTS.wallet.suspend, token);
    }

    /**
     * Activate wallet
     * POST /wallet/activate
     */
    static async activateWallet(token: string): Promise<{
        message: string;
        wallet: {
            id: string;
            status: string;
        };
    }> {
        return serverRequest<{
            message: string;
            wallet: {
                id: string;
                status: string;
            };
        }>('POST', API_ENDPOINTS.wallet.activate, token);
    }
}
