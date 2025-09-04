import type { AppProps } from 'next/app'
import { appWithTranslation } from 'next-i18next'
import Layout from '../components/layout/Layout'
import '../styles/globals.css'

const App = ({ Component, pageProps }: AppProps): JSX.Element => {
    return (
        <Layout>
            <Component {...pageProps} />
        </Layout>
    )
}

export default appWithTranslation(App)
