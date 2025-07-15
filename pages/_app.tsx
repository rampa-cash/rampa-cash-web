import type { AppProps } from 'next/app'
import Layout from '../components/layout/Layout'
import '../styles/globals.css'

const App = ({ Component, pageProps }: AppProps): JSX.Element => {
	return (
		<Layout>
      		<Component {...pageProps} />
    	</Layout>
  	)
}

export default App
