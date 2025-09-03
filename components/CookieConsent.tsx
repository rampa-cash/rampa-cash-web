import { useState, useEffect } from 'react'
import { useTranslation } from 'next-i18next'
import { acceptAllCookies, acceptEssentialOnly, hasConsent } from '../lib/cookie-utils'

const CookieConsent = (): JSX.Element | null => {
  const { t } = useTranslation('common')
  const [showBanner, setShowBanner] = useState(false)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // Check if user has already given consent
    if (!hasConsent()) {
      setShowBanner(true)
    }
    setIsLoading(false)
  }, [])

  const handleAcceptAll = (): void => {
    acceptAllCookies()
    setShowBanner(false)
  }

  const handleAcceptEssential = (): void => {
    acceptEssentialOnly()
    setShowBanner(false)
  }

  const handleShowDetails = (): void => {
    // You can implement a detailed cookie policy modal here
    window.open('/cookie-policy', '_blank')
  }

  if (isLoading || !showBanner) {
    return null
  }

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 bg-white border-t-2 border-gray-200 shadow-2xl">
      <div className="container mx-auto px-4 py-6">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div className="flex-1">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              {t('cookies.title')}
            </h3>
            <p className="text-gray-600 text-sm leading-relaxed">
              {t('cookies.description')}
            </p>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-3 min-w-fit">
            <button
              onClick={handleShowDetails}
              className="text-sm text-indigo-600 hover:text-indigo-700 underline transition-colors"
            >
              {t('cookies.learnMore')}
            </button>
            
            <button
              onClick={handleAcceptEssential}
              className="px-4 py-2 text-sm border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 transition-colors"
            >
              {t('cookies.essentialOnly')}
            </button>
            
            <button
              onClick={handleAcceptAll}
              className="px-6 py-2 text-sm bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition-colors font-medium"
            >
              {t('cookies.acceptAll')}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default CookieConsent
