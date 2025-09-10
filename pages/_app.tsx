import type { AppProps } from 'next/app'
import { appWithTranslation } from 'next-i18next'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { useState } from 'react'
import Layout from '../components/layout/Layout'
import '../styles/globals.css'

const App = ({ Component, pageProps }: AppProps): JSX.Element => {
    const [queryClient] = useState(() => new QueryClient({
        defaultOptions: {
            queries: {
                staleTime: 5 * 60 * 1000, // 5 minutes
                refetchOnWindowFocus: false,
                retry: 1,
            },
        },
    }))

    return (
        <QueryClientProvider client={queryClient}>
            <Layout>
                <Component {...pageProps} />
            </Layout>
        </QueryClientProvider>
    )
}

export default appWithTranslation(App)
