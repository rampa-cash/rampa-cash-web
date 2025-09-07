export interface WaitlistEntry {
    id: number;
    name: string;
    email: string;
    createdAt: string;
}

export interface WaitlistRequest {
    name: string;
    email: string;
}

export interface WaitlistResponse {
    success: boolean;
    message?: string | undefined;
    error?: string | undefined;
    count?: number | undefined;
}


export interface WaitlistSignupProps {
    title?: string;
    description?: string;
    className?: string;
    onSuccess?: () => void;
    onError?: (error: string) => void;
}