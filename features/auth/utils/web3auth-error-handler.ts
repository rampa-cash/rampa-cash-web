// Web3Auth Error Handling Utilities

export interface Web3AuthError {
    code: string;
    message: string;
    details?: any;
    userFriendlyMessage: string;
    shouldRetry: boolean;
    requiresReauth: boolean;
}

export class Web3AuthErrorHandler {
    /**
     * Parse Web3Auth error and return structured error info
     */
    static parseError(error: any): Web3AuthError {
        // Default error
        const defaultError: Web3AuthError = {
            code: 'UNKNOWN_ERROR',
            message: 'An unexpected error occurred',
            userFriendlyMessage: 'Something went wrong. Please try again.',
            shouldRetry: true,
            requiresReauth: false,
        };

        if (!error) return defaultError;

        // Handle different error types
        if (typeof error === 'string') {
            return {
                code: 'STRING_ERROR',
                message: error,
                userFriendlyMessage: this.getUserFriendlyMessage(error),
                shouldRetry: true,
                requiresReauth: false,
            };
        }

        if (error instanceof Error) {
            return this.parseErrorFromError(error);
        }

        if (error.code) {
            return this.parseErrorByCode(error);
        }

        return defaultError;
    }

    /**
     * Parse error from Error instance
     */
    private static parseErrorFromError(error: Error): Web3AuthError {
        const message = error.message.toLowerCase();

        // Network errors
        if (message.includes('network') || message.includes('fetch')) {
            return {
                code: 'NETWORK_ERROR',
                message: error.message,
                userFriendlyMessage:
                    'Network connection failed. Please check your internet connection and try again.',
                shouldRetry: true,
                requiresReauth: false,
            };
        }

        // Authentication errors
        if (
            message.includes('auth') ||
            message.includes('login') ||
            message.includes('token')
        ) {
            return {
                code: 'AUTH_ERROR',
                message: error.message,
                userFriendlyMessage:
                    'Authentication failed. Please log in again.',
                shouldRetry: false,
                requiresReauth: true,
            };
        }

        // User cancellation
        if (
            message.includes('cancel') ||
            message.includes('user') ||
            message.includes('denied')
        ) {
            return {
                code: 'USER_CANCELLED',
                message: error.message,
                userFriendlyMessage: 'Operation was cancelled.',
                shouldRetry: true,
                requiresReauth: false,
            };
        }

        // Timeout errors
        if (message.includes('timeout')) {
            return {
                code: 'TIMEOUT_ERROR',
                message: error.message,
                userFriendlyMessage: 'Request timed out. Please try again.',
                shouldRetry: true,
                requiresReauth: false,
            };
        }

        // Default error handling
        return {
            code: 'UNKNOWN_ERROR',
            message: error.message,
            userFriendlyMessage: this.getUserFriendlyMessage(error.message),
            shouldRetry: true,
            requiresReauth: false,
        };
    }

    /**
     * Parse error by error code
     */
    private static parseErrorByCode(error: any): Web3AuthError {
        const code = error.code;
        const message = error.message || 'Unknown error';

        switch (code) {
            case 'USER_CANCELLED':
                return {
                    code,
                    message,
                    userFriendlyMessage: 'Operation was cancelled by user.',
                    shouldRetry: true,
                    requiresReauth: false,
                };

            case 'NETWORK_ERROR':
                return {
                    code,
                    message,
                    userFriendlyMessage:
                        'Network error. Please check your connection.',
                    shouldRetry: true,
                    requiresReauth: false,
                };

            case 'AUTH_ERROR':
            case 'INVALID_TOKEN':
            case 'TOKEN_EXPIRED':
                return {
                    code,
                    message,
                    userFriendlyMessage:
                        'Authentication failed. Please log in again.',
                    shouldRetry: false,
                    requiresReauth: true,
                };

            case 'WALLET_NOT_FOUND':
                return {
                    code,
                    message,
                    userFriendlyMessage:
                        'Wallet not found. Please connect your wallet.',
                    shouldRetry: false,
                    requiresReauth: true,
                };

            case 'INSUFFICIENT_FUNDS':
                return {
                    code,
                    message,
                    userFriendlyMessage:
                        'Insufficient funds for this transaction.',
                    shouldRetry: false,
                    requiresReauth: false,
                };

            case 'RATE_LIMITED':
                return {
                    code,
                    message,
                    userFriendlyMessage:
                        'Too many requests. Please wait a moment and try again.',
                    shouldRetry: true,
                    requiresReauth: false,
                };

            default:
                return {
                    code,
                    message,
                    userFriendlyMessage: this.getUserFriendlyMessage(message),
                    shouldRetry: true,
                    requiresReauth: false,
                };
        }
    }

    /**
     * Get user-friendly message from error message
     */
    private static getUserFriendlyMessage(message: string): string {
        const lowerMessage = message.toLowerCase();

        if (
            lowerMessage.includes('network') ||
            lowerMessage.includes('fetch')
        ) {
            return 'Network connection failed. Please check your internet connection.';
        }

        if (lowerMessage.includes('timeout')) {
            return 'Request timed out. Please try again.';
        }

        if (lowerMessage.includes('auth') || lowerMessage.includes('login')) {
            return 'Authentication failed. Please log in again.';
        }

        if (
            lowerMessage.includes('cancel') ||
            lowerMessage.includes('denied')
        ) {
            return 'Operation was cancelled.';
        }

        if (lowerMessage.includes('insufficient')) {
            return 'Insufficient funds for this transaction.';
        }

        if (lowerMessage.includes('rate') || lowerMessage.includes('limit')) {
            return 'Too many requests. Please wait a moment and try again.';
        }

        return 'Something went wrong. Please try again.';
    }

    /**
     * Check if error requires re-authentication
     */
    static requiresReauth(error: any): boolean {
        const parsedError = this.parseError(error);
        return parsedError.requiresReauth;
    }

    /**
     * Check if error should be retried
     */
    static shouldRetry(error: any): boolean {
        const parsedError = this.parseError(error);
        return parsedError.shouldRetry;
    }

    /**
     * Get user-friendly error message from error
     */
    static getUserFriendlyMessageFromError(error: any): string {
        const parsedError = this.parseError(error);
        return parsedError.userFriendlyMessage;
    }

    /**
     * Log error for debugging
     */
    static logError(error: any, context?: string): void {
        const parsedError = this.parseError(error);

        console.error(`Web3Auth Error${context ? ` (${context})` : ''}:`, {
            code: parsedError.code,
            message: parsedError.message,
            details: parsedError.details,
            userFriendlyMessage: parsedError.userFriendlyMessage,
            shouldRetry: parsedError.shouldRetry,
            requiresReauth: parsedError.requiresReauth,
        });
    }
}

export default Web3AuthErrorHandler;
