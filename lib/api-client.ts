import axios from 'axios';

/**
 * isError: boolean = This is true when the axios service throws an error
 * isLoading: boolean = This is true when we request a new data in the server. This is false when refetching
 * isFetching: boolean = Same with isLoading the difference is that, It's true when refetching
 * refetch: Function = Refetch
 * isPending: boolean = This is true when it's the initial request to the server
 * data: Object = Response from the server
 */
export interface ServerResponseInterface<T> {
    isError: boolean;
    isLoading: boolean;
    isFetching: boolean;
    refetch: () => void;
    isPending?: boolean;
    errorCode?: number;
    data?: T;
}

export class APIException<T> {
    error: T | null = null;
    code: number = 0;

    constructor(error: T, code: number) {
        this.code = code;
        this.error = error;
    }
}

export const serverRequest = async <T>(
    method: string,
    url: string,
    token: string | undefined,
    data?: unknown
): Promise<T> => {
    try {
        let baseURL = process.env.NEXT_PUBLIC_BACKEND_URL ?? 'http://localhost:3001';
        
        // Ensure the baseURL has a protocol
        if (!baseURL.startsWith('http://') && !baseURL.startsWith('https://')) {
            baseURL = `https://${baseURL}`;
        }

        // Debug logging for URL construction
        if (process.env.NODE_ENV === 'development') {
            console.log('🔍 API URL Debug:', {
                originalEnv: process.env.NEXT_PUBLIC_BACKEND_URL,
                baseURL,
                url,
                finalURL: `${baseURL}${url}`
            });
        }

        const axiosConfig = {
            method,
            url,
            baseURL,
            headers: {
                'X-Auth-Token': token ?? '',
                'Content-Type': 'application/json',
            },
            data,
        };

        const response = await axios.request(axiosConfig);
        
        return response.data as T;
    } catch (error: unknown) {
        if (error && typeof error === 'object' && 'response' in error) {
            const axiosError = error as { response?: { data?: unknown; status?: number }; message?: string };
            const errMsg = axiosError.response?.data ?? axiosError.message ?? 'Unknown error';
            const errCode = axiosError.response?.status ?? 500;
            throw new APIException(errMsg, errCode);
        } else {
            throw new APIException('An unknown error occurred', 500);
        }
    }
};