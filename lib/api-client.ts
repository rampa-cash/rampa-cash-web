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
        const baseURL = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:3001';
        const fullUrl = `${baseURL}${url}`;
        
        if (process.env.NODE_ENV === 'development') {
            console.log(`🚀 API Request: ${method.toUpperCase()} ${fullUrl}`);
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
        
        if (process.env.NODE_ENV === 'development') {
            console.log(`✅ API Response: ${response.status} ${response.config.url}`, response.data);
        }
        
        return response.data as T;
    } catch (error: any) {
        if (process.env.NODE_ENV === 'development') {
            console.error('❌ API Error Details:', {
                message: error.message,
                response: error.response?.data,
                status: error.response?.status,
                config: error.config?.url
            });
        }
        
        if (error.response) {
            const errMsg = error.response?.data || error.message;
            const errCode = error.response?.status || 500;
            throw new APIException(errMsg, errCode);
        } else {
            throw new APIException('An unknown error occurred', 500);
        }
    }
};