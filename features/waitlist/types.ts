export interface WaitlistEntry {
    id: number;
    name: string;
    email: string;
    inquiry?: string;
    type: 'WAITLIST';
    createdAt: string;
    updatedAt: string;
}

export interface WaitlistRequest {
    name: string;
    email: string;
    inquiry?: string | undefined;
}

export interface WaitlistResponse {
    success: boolean;
    message?: string | undefined;
    error?: string | undefined;
}

// Aligned with OpenAPI InquiryResponse schema
export interface InquiryResponse {
    id: number;
    name: string;
    email: string;
    inquiry?: string;
    type: 'WAITLIST' | 'GENERAL' | 'SUPPORT' | 'FEATURE_REQUEST' | 'BUG_REPORT';
    status: 'PENDING' | 'IN_PROGRESS' | 'RESOLVED' | 'CLOSED';
    createdAt: string;
    updatedAt: string;
}

export interface WaitlistSignupProps {
    title?: string;
    description?: string;
    className?: string;
    onSuccess?: () => void;
    onError?: (error: string) => void;
}