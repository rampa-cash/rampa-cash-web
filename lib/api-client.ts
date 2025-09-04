import axios from 'axios';

const BACKEND_API_URL = process.env.BACKEND_API_URL ?? 'http://localhost:3001';

export interface ApiClientConfig {
    baseURL: string;
    timeout: number;
    headers: Record<string, string>;
}

export const apiConfig: ApiClientConfig = {
    baseURL: BACKEND_API_URL,
    timeout: 10000,
    headers: {
        'Content-Type': 'application/json',
    },
};

export class ApiClient {
    private axiosInstance: ReturnType<typeof axios.create>;

    constructor(config: ApiClientConfig = apiConfig) {
        this.axiosInstance = axios.create({
            baseURL: config.baseURL,
            timeout: config.timeout,
            headers: config.headers,
        });

        this.setupInterceptors();
    }

    private setupInterceptors(): void {
        this.axiosInstance.interceptors.request.use(
            (config: any) => {
                const token = this.getAuthToken();
                if (token && config.headers) {
                    config.headers.Authorization = `Bearer ${token}`;
                }

                if (process.env.NODE_ENV === 'development') {
                    console.log(`🚀 API Request: ${config.method?.toUpperCase()} ${config.url}`);
                }

                return config;
            },
            (error: any) => {
                console.error('❌ Request interceptor error:', error);
                return Promise.reject(error);
            }
        );

        this.axiosInstance.interceptors.response.use(
            (response: any) => {
                if (process.env.NODE_ENV === 'development') {
                    console.log(`✅ API Response: ${response.status} ${response.config.url}`);
                }
                return response;
            },
            (error: any) => {
                if (error.response) {
                    console.error(`❌ API Error: ${error.response.status} ${error.config?.url}`, {
                        status: error.response.status,
                        data: error.response.data,
                        message: error.message,
                    });
                } else if (error.request) {
                    console.error('❌ Network Error: No response received', error.request);
                } else {
                    console.error('❌ Request Error:', error.message);
                }

                return Promise.reject(error);
            }
        );
    }

    private getAuthToken(): string | null {
        return null;
    }

    async get<T>(endpoint: string, config?: any): Promise<T> {
        const response = await this.axiosInstance.get<T>(endpoint, config);
        return response.data;
    }

    async post<T>(endpoint: string, data?: unknown, config?: any): Promise<T> {
        const response = await this.axiosInstance.post<T>(endpoint, data, config);
        return response.data;
    }

    async put<T>(endpoint: string, data?: unknown, config?: any): Promise<T> {
        const response = await this.axiosInstance.put<T>(endpoint, data, config);
        return response.data;
    }

    async patch<T>(endpoint: string, data?: unknown, config?: any): Promise<T> {
        const response = await this.axiosInstance.patch<T>(endpoint, data, config);
        return response.data;
    }

    async delete<T>(endpoint: string, config?: any): Promise<T> {
        const response = await this.axiosInstance.delete<T>(endpoint, config);
        return response.data;
    }

    setAuthToken(token: string): void {
        this.axiosInstance.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    }

    clearAuthToken(): void {
        delete this.axiosInstance.defaults.headers.common['Authorization'];
    }

    getAxiosInstance(): ReturnType<typeof axios.create> {
        return this.axiosInstance;
    }
}

export const apiClient = new ApiClient();
