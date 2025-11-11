import axios from 'axios';
import { BACKEND_CONFIG } from './constants';

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

// Optional token refresh function that can be set globally
let globalTokenRefreshFn: (() => Promise<string | null>) | null = null;

/**
 * Set global token refresh function
 * This allows api-client to refresh tokens on 401 errors
 */
export const setTokenRefreshFunction = (
    refreshFn: () => Promise<string | null>
): void => {
    globalTokenRefreshFn = refreshFn;
};

export const serverRequest = async <T>(
    method: string,
    url: string,
    token: string | undefined,
    data?: unknown,
    retryCount = 0
): Promise<T> => {
    try {
        const axiosConfig = {
            method,
            url,
            baseURL: BACKEND_CONFIG.baseURL,
            headers: {
                Authorization: token ? `Bearer ${token}` : '',
                'Content-Type': 'application/json',
            },
            data,
        };

        const response = await axios.request(axiosConfig);

        return response.data as T;
    } catch (error: unknown) {
        if (error && typeof error === 'object' && 'response' in error) {
            const axiosError = error as {
                response?: { data?: unknown; status?: number };
                message?: string;
            };
            
            // Handle 401 - try to refresh session and retry once
            if (axiosError.response?.status === 401 && retryCount === 0) {
                // Try to refresh token if refresh function is available
                if (globalTokenRefreshFn) {
                    try {
                        const newToken = await globalTokenRefreshFn();
                        if (newToken) {
                            // Retry with new token
                            return serverRequest(method, url, newToken, data, retryCount + 1);
                        }
                    } catch (refreshError) {
                        // eslint-disable-next-line no-console
                        console.error('Failed to refresh token on 401 error:', refreshError);
                    }
                }
            }
            
            const errMsg =
                axiosError.response?.data ??
                axiosError.message ??
                'Unknown error';
            const errCode = axiosError.response?.status ?? 500;
            throw new APIException(errMsg, errCode);
        } else {
            throw new APIException('An unknown error occurred', 500);
        }
    }
};
