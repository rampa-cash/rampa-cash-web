/**
 * Para SDK Configuration
 */

export type ParaEnvironment = 'beta' | 'prod';

export interface ParaConfig {
    apiKey: string;
    appName: string;
    environment?: ParaEnvironment;
    network?: 'mainnet' | 'testnet';
    theme?: 'light' | 'dark' | 'auto';
}

export interface ParaModalConfig {
    oAuthMethods?: ('GOOGLE' | 'TWITTER' | 'APPLE' | 'DISCORD' | 'FACEBOOK' | 'FARCASTER' | 'TELEGRAM')[];
    authLayout?: ('AUTH:FULL' | 'AUTH:CONDENSED' | 'EXTERNAL:FULL' | 'EXTERNAL:CONDENSED')[];
    recoverySecretStepEnabled?: boolean;
    hideWallets?: boolean;
    onRampTestMode?: boolean;
    onModalStepChange?: (stepInfo: unknown) => void;
    onClose?: () => void;
}

export const getParaConfig = (): ParaConfig => {
    const apiKey = process.env.NEXT_PUBLIC_PARA_API_KEY ?? '';
    const appName = process.env.NEXT_PUBLIC_PARA_APP_NAME ?? 'Rampa Cash';

    if (!apiKey) {
        throw new Error('NEXT_PUBLIC_PARA_API_KEY is required');
    }

    // Determine environment from API key prefix
    const environment: ParaEnvironment =
        apiKey.startsWith('beta_') || apiKey.startsWith('sk_beta_')
            ? 'beta'
            : 'prod';

    return {
        apiKey,
        appName,
        environment,
        network:
            (process.env.NEXT_PUBLIC_PARA_NETWORK as 'mainnet' | 'testnet') ??
            'testnet',
        theme:
            (process.env.NEXT_PUBLIC_PARA_THEME as 'light' | 'dark' | 'auto') ??
            'auto',
    };
};

export const getParaModalConfig = (): ParaModalConfig => {
    return {
        oAuthMethods: ['GOOGLE', 'APPLE'] as ('GOOGLE' | 'APPLE')[],
        authLayout: ['AUTH:FULL'] as ('AUTH:FULL' | 'AUTH:CONDENSED' | 'EXTERNAL:FULL' | 'EXTERNAL:CONDENSED')[],
        recoverySecretStepEnabled: true,
        hideWallets: true,
        onRampTestMode: true,
        onModalStepChange: (stepInfo: unknown): void => {
            const step = stepInfo as {
                previousStep?: string;
                currentStep?: string;
                canGoBack?: boolean;
            };
            // eslint-disable-next-line no-console
            console.log('Para Modal Step Changed:', step);

            // Log specific step information
            if (step.currentStep === 'BIOMETRIC_CREATION') {
                // eslint-disable-next-line no-console
                console.log(
                    '⚠️ Passkey creation is required for Para security. This step cannot be skipped.'
                );
                // eslint-disable-next-line no-console
                console.log(
                    '📖 Learn more: https://docs.getpara.com/v2/concepts/key-management#passkey'
                );
            }

            if (step.currentStep === 'AWAITING_OAUTH') {
                // eslint-disable-next-line no-console
                console.log(
                    '⏳ Waiting for OAuth callback. Make sure OAuth is configured in Para Developer Portal.'
                );
            }
        },
        onClose: (): void => {
            // eslint-disable-next-line no-console
            console.log('Para Modal Closed');
        },
    };
};
