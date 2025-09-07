// Cookie consent management utilities
export interface CookiePreferences {
    essential: boolean
    functional: boolean
    analytics: boolean
    marketing: boolean
}

export const defaultPreferences: CookiePreferences = {
    essential: true,
    functional: false,
    analytics: false,
    marketing: false
}

export const getCookieConsent = (): string | null => {
    if (typeof window === 'undefined') return null
    return localStorage.getItem('cookie-consent')
}

export const getCookiePreferences = (): CookiePreferences => {
    if (typeof window === 'undefined') return defaultPreferences

    const stored = localStorage.getItem('cookie-preferences')
    if (!stored) return defaultPreferences

    try {
        return { ...defaultPreferences, ...JSON.parse(stored) }
    } catch {
        return defaultPreferences
    }
}

export const setCookiePreferences = (preferences: CookiePreferences): void => {
    if (typeof window === 'undefined') return

    localStorage.setItem('cookie-preferences', JSON.stringify(preferences))
    localStorage.setItem('cookie-consent', 'custom')

    // Apply preferences (for future use when you add analytics)
    applyPreferences(preferences)
}

export const acceptAllCookies = (): void => {
    const allAccepted: CookiePreferences = {
        essential: true,
        functional: true,
        analytics: false, // Set to true when you add analytics
        marketing: false
    }

    setCookiePreferences(allAccepted)
}

export const acceptEssentialOnly = (): void => {
    setCookiePreferences(defaultPreferences)
}

const applyPreferences = (preferences: CookiePreferences): void => {
    // This function will be used to enable/disable various features
    // based on cookie preferences. For example:

    if (preferences.functional) {
        // Enable functional cookies (language preferences, etc.)
        // Future implementation for functional cookies
    }

    if (preferences.analytics) {
        // Enable analytics tracking when you add it
        // Future implementation for analytics
    }

    if (preferences.marketing) {
        // Enable marketing cookies when you add them
        // Future implementation for marketing cookies
    }
}

// Check if user has given any form of consent
export const hasConsent = (): boolean => {
    const consent = getCookieConsent()
    return consent !== null
}

// Check if specific cookie type is allowed
export const isCookieTypeAllowed = (type: keyof CookiePreferences): boolean => {
    const preferences = getCookiePreferences()
    return preferences[type]
}
