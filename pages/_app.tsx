import type { AppProps } from 'next/app';
import { appWithTranslation } from 'next-i18next';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useState } from 'react';
import Layout from '../components/layout/Layout';
import { ThemeProvider } from '../contexts/ThemeContext';
import { ParaProvider } from '@getpara/react-sdk';
import { getParaConfig, ParaContextProvider } from '@/lib/adapters/auth/para';
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

    const paraConfig = getParaConfig();

    return (
        <ThemeProvider>
            <QueryClientProvider client={queryClient}>
                <ParaProvider
                    paraClientConfig={{
                        apiKey: paraConfig.apiKey,
                    }}
                    config={{
                        appName: paraConfig.appName,
                    }}
                >
                    <ParaContextProvider>
                        <AuthProviderWrapper>
                            <Layout>
                                <Component {...pageProps} />
                            </Layout>
                        </AuthProviderWrapper>
                    </ParaContextProvider>
                </ParaProvider>
            </QueryClientProvider>
        </ThemeProvider>
    );
};

export default appWithTranslation(App);
