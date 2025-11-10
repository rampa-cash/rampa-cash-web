// VISA Card domain types aligned with data model and OpenAPI specification

export interface VISACard {
    id: string;
    userId: string;
    cardNumber: string;
    cardType: 'physical' | 'virtual';
    status: 'pending' | 'active' | 'suspended' | 'cancelled';
    balance: string;
    dailyLimit: string;
    monthlyLimit: string;
    createdAt: string;
    activatedAt?: string | undefined;
    expiresAt: string;
}

export interface CreateVISACardRequest {
    cardType: 'physical' | 'virtual';
    dailyLimit: string;
    monthlyLimit: string;
}

export interface UpdateVISACardRequest {
    cardType?: 'physical' | 'virtual';
    dailyLimit?: string;
    monthlyLimit?: string;
}

export interface VISACardResponse {
    id: string;
    userId: string;
    cardNumber: string;
    cardType: 'physical' | 'virtual';
    status: 'pending' | 'active' | 'suspended' | 'cancelled';
    balance: string;
    dailyLimit: string;
    monthlyLimit: string;
    createdAt: string;
    activatedAt?: string;
    expiresAt: string;
}

export interface VISACardStats {
    totalCards: number;
    activeCards: number;
    suspendedCards: number;
    cancelledCards: number;
    expiredCards: number;
}

export interface SpendingLimitsCheck {
    canSpend: boolean;
    dailyRemaining: string;
    monthlyRemaining: string;
    requestedAmount: string;
}

export interface VISACardState {
    cards: VISACard[];
    currentCard?: VISACard;
    isLoading: boolean;
    error: string | null;
}

export interface VISACardProps {
    onCardSelect?: (card: VISACard) => void;
    onCardUpdate?: (card: VISACard) => void;
    onCardActivate?: (cardId: string) => void;
    onCardSuspend?: (cardId: string) => void;
    onCardCancel?: (cardId: string) => void;
    className?: string;
}
