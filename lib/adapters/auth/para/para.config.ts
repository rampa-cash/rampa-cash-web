/**
 * Para SDK Configuration
 */

export interface ParaConfig {
    apiKey: string;
    appName: string;
    network?: 'mainnet' | 'testnet';
    theme?: 'light' | 'dark' | 'auto';
}

export const getParaConfig = (): ParaConfig => {
    const apiKey = process.env.NEXT_PUBLIC_PARA_API_KEY ?? '';
    const appName = process.env.NEXT_PUBLIC_PARA_APP_NAME ?? 'Rampa Cash';

    if (!apiKey) {
        throw new Error('NEXT_PUBLIC_PARA_API_KEY is required');
    }

    return {
        apiKey,
        appName,
        network:
            (process.env.NEXT_PUBLIC_PARA_NETWORK as 'mainnet' | 'testnet') ??
            'testnet',
        theme:
            (process.env.NEXT_PUBLIC_PARA_THEME as 'light' | 'dark' | 'auto') ??
            'auto',
    };
};
