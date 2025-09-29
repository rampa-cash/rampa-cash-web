export interface Wallet {
    id: string;
    userId: string;
    address: string;
    publicKey: string;
    walletType: 'web3auth_mpc' | 'phantom' | 'solflare';
    isActive: boolean;
    status: 'active' | 'suspended';
    createdAt: string;
    updatedAt: string;
}

export interface WalletBalance {
    id: string;
    walletId: string;
    tokenType: 'USDC' | 'EURC' | 'SOL';
    balance: string;
    lastUpdated: string;
    createdAt: string;
    updatedAt: string;
}

export interface CreateWalletRequest {
    address: string;
    publicKey: string;
    walletType: 'web3auth_mpc' | 'phantom' | 'solflare';
}

export interface UpdateWalletRequest {
    address?: string;
    publicKey?: string;
    walletType?: 'web3auth_mpc' | 'phantom' | 'solflare';
}

export interface ConnectWalletRequest {
    walletType: 'phantom' | 'solflare';
    address: string;
    publicKey: string;
}

export interface WalletResponse {
    id: string;
    address: string;
    publicKey: string;
    walletType: 'web3auth_mpc' | 'phantom' | 'solflare';
    status: string;
    createdAt: string;
    balances: TokenBalance[];
}

export interface TokenBalance {
    tokenType: 'USDC' | 'EURC' | 'SOL';
    balance: string;
    lastUpdated: string;
}

export interface WalletBalanceResponse {
    balances: TokenBalance[];
}

export interface TransferRequest {
    toAddress: string;
    amount: string;
    tokenType: 'USDC' | 'EURC' | 'SOL';
    description?: string;
}

export interface WalletState {
    wallet: Wallet | null;
    balances: { [key: string]: WalletBalance };
    isLoading: boolean;
    error: string | null;
}

export interface SwapRequest {
    fromCurrency: string;
    toCurrency: string;
    amount: string;
    slippageTolerance?: number;
}

export interface SwapResponse {
    transactionId: string;
    fromAmount: string;
    toAmount: string;
    exchangeRate: string;
    fee: string;
    estimatedTime: string;
}

export interface TransactionFee {
    currency: string;
    amount: string;
    usdValue: string;
}

export interface WalletConnectionRequest {
    network: string;
    signature?: string;
}

export interface WalletConnectionResponse {
    wallet: Wallet;
    balances: WalletBalance[];
}

export interface WalletBalanceProps {
    walletId?: string;
    showDetails?: boolean;
    className?: string;
}

export interface WalletConnectProps {
    onSuccess?: (response: WalletConnectionResponse) => void;
    onError?: (error: string) => void;
    className?: string;
}

export interface WalletTransferProps {
    walletId: string;
    onSuccess?: (transactionId: string) => void;
    onError?: (error: string) => void;
    className?: string;
}
