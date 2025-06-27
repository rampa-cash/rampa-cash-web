import '../styles/globals.css'
import type { AppProps } from 'next/app'
import ErrorBoundary from '../components/ErrorBoundary'

export default function App({ Component, pageProps }: AppProps): JSX.Element {
  return (
    <ErrorBoundary
      onError={(error, errorInfo) => {
        // Log error to console in development
        if (process.env.NODE_ENV === 'development') {
          console.error('App Error:', error, errorInfo)
        }
        
        // In production, you would send this to an error reporting service
        // Example: Sentry.captureException(error, { extra: errorInfo })
      }}
    >
      <Component {...pageProps} />
    </ErrorBoundary>
  )
}
