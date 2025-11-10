import type { AppProps } from 'next/app';
import { appWithTranslation } from 'next-i18next';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useState, useMemo } from 'react';
import Layout from '../components/layout/Layout';
import { ThemeProvider } from '../contexts/ThemeContext';
import { ParaProvider, Environment } from '@getpara/react-sdk';
import {
    getParaConfig,
    getParaModalConfig,
    ParaContextProvider,
} from '@/lib/adapters/auth/para';
import { AuthProviderFactory } from '@/lib/adapters/auth/factory';
import { AuthProviderWrapper } from '../domain/auth/contexts/AuthContext';
import '../styles/globals.css';
import '@getpara/react-sdk/styles.css';

const App = ({ Component, pageProps }: AppProps): JSX.Element => {
    const [queryClient] = useState(
        () =>
            new QueryClient({
                defaultOptions: {
                    queries: {
                        staleTime: 5 * 60 * 1000, // 5 minutes
                        refetchOnWindowFocus: false,
                        retry: 1,
                    },
                },
            })
    );

    // Determine which auth provider to use
    const isParaProvider = AuthProviderFactory.isParaProvider();
    const isMockProvider = AuthProviderFactory.isMockProvider();

    // Para-specific configuration (only if using Para)
    const paraConfig = useMemo(() => {
        if (isParaProvider) {
            return getParaConfig();
        }
        return null;
    }, [isParaProvider]);

    const paraModalConfig = useMemo(() => {
        if (isParaProvider) {
            return getParaModalConfig();
        }
        return null;
    }, [isParaProvider]);

    const paraEnvironment = useMemo(() => {
        if (paraConfig) {
            return paraConfig.environment === 'beta'
                ? Environment.BETA
                : Environment.PROD;
        }
        return null;
    }, [paraConfig]);

    // Create auth adapter based on provider type
    const authAdapter = useMemo(() => {
        if (isMockProvider) {
            // For mock, create directly
            return AuthProviderFactory.createAuthProvider();
        }
        // For Para, we need to create it through ParaContextProvider
        // Return null here, ParaContextProvider will create it
        return null;
    }, [isMockProvider]);

    // Render Para provider setup if using Para
    if (isParaProvider && paraConfig && paraModalConfig && paraEnvironment) {
        return (
            <ThemeProvider>
                <QueryClientProvider client={queryClient}>
                    <ParaProvider
                        paraClientConfig={{
                            env: paraEnvironment,
                            apiKey: paraConfig.apiKey,
                        }}
                        config={{
                            appName: paraConfig.appName,
                        }}
                        paraModalConfig={paraModalConfig}
                    >
                        <ParaContextProvider>
                            <Layout>
                                <Component {...pageProps} />
                            </Layout>
                        </ParaContextProvider>
                    </ParaProvider>
                </QueryClientProvider>
            </ThemeProvider>
        );
    }

    // Render mock provider setup
    if (isMockProvider && authAdapter) {
        return (
            <ThemeProvider>
                <QueryClientProvider client={queryClient}>
                    <AuthProviderWrapper adapter={authAdapter}>
                        <Layout>
                            <Component {...pageProps} />
                        </Layout>
                    </AuthProviderWrapper>
                </QueryClientProvider>
            </ThemeProvider>
        );
    }

    // Fallback: should not reach here
    return (
        <ThemeProvider>
            <QueryClientProvider client={queryClient}>
                <Layout>
                    <Component {...pageProps} />
                </Layout>
            </QueryClientProvider>
        </ThemeProvider>
    );
};

export default appWithTranslation(App);
