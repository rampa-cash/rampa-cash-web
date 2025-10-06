/**
 * Utility functions for browser API checks and safe access
 */

/**
 * Check if we're running in a browser environment
 */
export const isBrowser = (): boolean => {
    return typeof window !== 'undefined'
}

/**
 * Safely access navigator API
 */
export const getNavigator = (): Navigator | null => {
    return isBrowser() ? navigator : null
}

/**
 * Safely access window object
 */
export const getWindow = (): Window | null => {
    return isBrowser() ? window : null
}

/**
 * Check if localStorage is available
 */
export const isLocalStorageAvailable = (): boolean => {
    if (!isBrowser()) return false
    
    try {
        const test = '__localStorage_test__'
        localStorage.setItem(test, test)
        localStorage.removeItem(test)
        return true
    } catch {
        return false
    }
}

/**
 * Safely get item from localStorage
 */
export const getLocalStorage = (key: string): string | null => {
    if (!isLocalStorageAvailable()) return null
    
    try {
        return localStorage.getItem(key)
    } catch (error) {
        if (process.env.NODE_ENV === 'development') {
            console.error('Failed to get from localStorage:', error)
        }
        return null
    }
}

/**
 * Safely set item in localStorage
 */
export const setLocalStorage = (key: string, value: string): boolean => {
    if (!isLocalStorageAvailable()) return false
    
    try {
        localStorage.setItem(key, value)
        return true
    } catch (error) {
        if (process.env.NODE_ENV === 'development') {
            console.error('Failed to set in localStorage:', error)
        }
        return false
    }
}

/**
 * Safely remove item from localStorage
 */
export const removeLocalStorage = (key: string): boolean => {
    if (!isLocalStorageAvailable()) return false
    
    try {
        localStorage.removeItem(key)
        return true
    } catch (error) {
        if (process.env.NODE_ENV === 'development') {
            console.error('Failed to remove from localStorage:', error)
        }
        return false
    }
}

/**
 * Safely clear all localStorage
 */
export const clearLocalStorage = (): boolean => {
    if (!isLocalStorageAvailable()) return false
    
    try {
        localStorage.clear()
        return true
    } catch (error) {
        if (process.env.NODE_ENV === 'development') {
            console.error('Failed to clear localStorage:', error)
        }
        return false
    }
}

/**
 * Safely access document object
 */
export const getDocument = (): Document | null => {
    return isBrowser() ? document : null
}

/**
 * Check if clipboard API is available
 */
export const isClipboardAvailable = (): boolean => {
    return isBrowser() && 'clipboard' in navigator
}

/**
 * Check if share API is available
 */
export const isShareAvailable = (): boolean => {
    return isBrowser() && 'share' in navigator
}

/**
 * Safely copy text to clipboard
 */
export const copyToClipboard = async (text: string): Promise<boolean> => {
    if (!isClipboardAvailable()) {
        return false
    }

    try {
        await navigator.clipboard.writeText(text)
        return true
    } catch (error) {
        if (process.env.NODE_ENV === 'development') {
            console.error('Failed to copy to clipboard:', error)
        }
        return false
    }
}

/**
 * Safely share content
 */
export const shareContent = async (data: ShareData): Promise<boolean> => {
    if (!isShareAvailable()) {
        return false
    }

    try {
        await navigator.share(data)
        return true
    } catch (error) {
        if (process.env.NODE_ENV === 'development') {
            console.error('Failed to share content:', error)
        }
        return false
    }
}
