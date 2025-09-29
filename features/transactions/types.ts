export interface Transaction {
    id: string;
    senderId: string;
    recipientId: string;
    senderWalletId: string;
    recipientWalletId: string;
    amount: string;
    tokenType: 'USDC' | 'EURC' | 'SOL';
    status: 'pending' | 'confirmed' | 'failed' | 'cancelled';
    solanaTransactionHash?: string | undefined;
    description?: string | undefined;
    fee: string;
    createdAt: string;
    confirmedAt?: string | undefined;
    failedAt?: string | undefined;
    failureReason?: string | undefined;
}

export interface CreateTransactionRequest {
    senderId: string;
    recipientId: string;
    senderWalletId: string;
    recipientWalletId: string;
    amount: string;
    tokenType: 'USDC' | 'EURC' | 'SOL';
    description?: string | undefined;
    fee?: string | undefined;
}

export interface TransactionResponse {
    id: string;
    senderId: string;
    recipientId: string;
    amount: string;
    tokenType: 'USDC' | 'EURC' | 'SOL';
    status: 'pending' | 'confirmed' | 'failed' | 'cancelled';
    description?: string;
    fee: string;
    createdAt: string;
    confirmedAt?: string;
    failedAt?: string;
    failureReason?: string;
    solanaTransactionHash?: string;
}

export interface TransactionHistoryResponse {
    transactions: TransactionResponse[];
    pagination: {
        page: number;
        limit: number;
        total: number;
        totalPages: number;
    };
}

export interface SendMoneyRequest {
    recipientId: string;
    amount: string;
    tokenType: 'USDC' | 'EURC' | 'SOL';
    description?: string;
}

export interface TransactionFilters {
    status?: 'pending' | 'confirmed' | 'failed' | 'cancelled';
    tokenType?: 'USDC' | 'EURC' | 'SOL';
    limit?: number;
    offset?: number;
    startDate?: string;
    endDate?: string;
}

export interface TransactionStats {
    totalSent: number;
    totalReceived: number;
    totalFees: number;
    transactionCount: number;
}

export interface TransactionState {
    transactions: Transaction[];
    isLoading: boolean;
    error: string | null;
    filters: {
        type: 'all' | 'send' | 'receive' | 'onramp' | 'offramp';
        status: 'all' | 'pending' | 'completed' | 'failed';
        search: string;
    };
    sort: {
        key: 'date' | 'amount' | 'recipient';
        order: 'asc' | 'desc';
    };
}

export interface SendMoneyProps {
    onSuccess?: (transactionId: string) => void;
    onError?: (error: string) => void;
    className?: string;
}

export interface TransactionHistoryProps {
    filters?: TransactionFilters;
    onTransactionClick?: (transaction: Transaction) => void;
    className?: string;
}

export interface ReceiveMoneyProps {
    onSuccess?: (transactionId: string) => void;
    onError?: (error: string) => void;
    className?: string;
}
