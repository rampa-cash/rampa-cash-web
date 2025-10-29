import type { AppProps } from 'next/app';
import { appWithTranslation } from 'next-i18next';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useState } from 'react';
import Layout from '../components/layout/Layout';
import { ThemeProvider } from '../contexts/ThemeContext';
import { Web3AuthProvider } from '@web3auth/modal/react';
import { web3AuthConfig } from '../features/auth/config/web3auth.config';
import { Web3AuthProvider as CustomWeb3AuthProvider } from '../features/auth';
import '../styles/globals.css';

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

    return (
        <ThemeProvider>
            <QueryClientProvider client={queryClient}>
                <Web3AuthProvider config={{ web3AuthOptions: web3AuthConfig }}>
                    <CustomWeb3AuthProvider>
                        <Layout>
                            <Component {...pageProps} />
                        </Layout>
                    </CustomWeb3AuthProvider>
                </Web3AuthProvider>
            </QueryClientProvider>
        </ThemeProvider>
    );
};

export default appWithTranslation(App);
