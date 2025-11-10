// Ramp domain types aligned with data model and OpenAPI specification

export interface OnOffRamp {
    id: string;
    userId: string;
    walletId: string;
    type: 'onramp' | 'offramp';
    amount: string;
    fiatAmount: string;
    fiatCurrency: string;
    tokenType: 'USDC' | 'EURC' | 'SOL';
    status: 'pending' | 'processing' | 'completed' | 'failed';
    provider: string;
    providerTransactionId?: string | undefined;
    exchangeRate: string;
    fee: string;
    createdAt: string;
    completedAt?: string | undefined;
    failedAt?: string | undefined;
    failureReason?: string | undefined;
}

export interface OnRampRequest {
    amount: string;
    fiatCurrency: 'EUR' | 'USD';
    tokenType: 'USDC' | 'EURC' | 'SOL';
    paymentMethod?: 'credit_card' | 'sepa_transfer';
}

export interface OffRampRequest {
    amount: string;
    tokenType: 'USDC' | 'EURC' | 'SOL';
    bankAccount: {
        iban: string;
        accountHolderName: string;
        bankName?: string;
    };
}

export interface OnRampResponse {
    id: string;
    userId: string;
    walletId: string;
    type: 'onramp' | 'offramp';
    amount: string;
    fiatAmount: string;
    fiatCurrency: string;
    tokenType: 'USDC' | 'EURC' | 'SOL';
    status: 'pending' | 'processing' | 'completed' | 'failed';
    provider: string;
    providerTransactionId?: string;
    exchangeRate: string;
    fee: string;
    createdAt: string;
    completedAt?: string;
    failedAt?: string;
    failureReason?: string;
}

export interface OffRampResponse {
    id: string;
    amount: string;
    fiatAmount: string;
    fiatCurrency: string;
    tokenType: 'USDC' | 'EURC' | 'SOL';
    status: 'pending' | 'processing' | 'completed' | 'failed';
    exchangeRate: string;
    fee: string;
    estimatedDelivery: string;
    createdAt: string;
}

export interface BankAccount {
    iban: string;
    accountHolderName: string;
    bankName?: string;
}

export interface RampStats {
    totalOnRamp: number;
    totalOffRamp: number;
    totalFees: number;
    completedOnRamp: number;
    completedOffRamp: number;
    failedOnRamp: number;
    failedOffRamp: number;
}

export interface RampState {
    onRamps: OnOffRamp[];
    offRamps: OnOffRamp[];
    isLoading: boolean;
    error: string | null;
}

export interface OnRampProps {
    onSuccess?: (response: OnRampResponse) => void;
    onError?: (error: string) => void;
    className?: string;
}

export interface OffRampProps {
    onSuccess?: (response: OffRampResponse) => void;
    onError?: (error: string) => void;
    className?: string;
}
