/**
 * Auth Provider Factory
 *
 * Creates authentication adapters based on configuration.
 * This follows the Factory Pattern to decouple adapter creation from usage.
 */

import { IAuthPort } from '@/domain/auth/interfaces/authentication-service.interface';
import { ParaAdapter } from '../para/ParaAdapter';
import { MockAdapter } from '../mock/MockAdapter';

export type AuthProviderType = 'para' | 'mock';

/**
 * Factory to create authentication adapters
 */
export class AuthProviderFactory {
    /**
     * Create an authentication adapter based on configuration
     *
     * Reads NEXT_PUBLIC_AUTH_PROVIDER environment variable:
     * - 'para' (default): Creates ParaAdapter
     * - 'mock': Creates MockAdapter for testing
     *
     * @returns An instance of IAuthPort (adapter-agnostic)
     */
    static createAuthProvider(): IAuthPort {
        const providerType =
            (process.env.NEXT_PUBLIC_AUTH_PROVIDER as AuthProviderType) ??
            'para';

        switch (providerType) {
            case 'mock':
                return new MockAdapter();

            case 'para':
            default:
                // ParaAdapter requires ParaContext to be set up
                // We'll create a placeholder that will be initialized by ParaContextProvider
                // This is a limitation of React hooks - we need the context to provide the SDK
                // The actual adapter will be created in ParaContextProvider
                throw new Error(
                    'ParaAdapter must be created through ParaContextProvider. Use createAuthProviderWithContext() instead.'
                );
        }
    }

    /**
     * Create Para adapter with context (used by ParaContextProvider)
     *
     * @param paraSDK - The Para SDK instance from ParaContext
     * @returns ParaAdapter instance
     */
    static createParaAdapter(paraSDK: unknown): ParaAdapter {
        return new ParaAdapter(paraSDK as Parameters<typeof ParaAdapter>[0]);
    }

    /**
     * Get the configured provider type
     */
    static getProviderType(): AuthProviderType {
        return (
            (process.env.NEXT_PUBLIC_AUTH_PROVIDER as AuthProviderType) ??
            'para'
        );
    }

    /**
     * Check if using Para provider
     */
    static isParaProvider(): boolean {
        return this.getProviderType() === 'para';
    }

    /**
     * Check if using Mock provider
     */
    static isMockProvider(): boolean {
        return this.getProviderType() === 'mock';
    }
}
