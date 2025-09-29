import { useState, useEffect } from 'react'
import { useTranslation } from 'next-i18next'

interface WalletBalanceProps {
    className?: string
    showRefresh?: boolean
    onRefresh?: () => void
}

interface Balance {
    usd: number
    sol: number
    eur?: number
    btc?: number
}

// Mock wallet data - in real app this would come from wallet hook
const mockBalance: Balance = {
    usd: 1250.50,
    sol: 5.25,
    eur: 1150.30,
    btc: 0.025
}

export const WalletBalance = ({ 
    className = '', 
    showRefresh = true, 
    onRefresh 
}: WalletBalanceProps): JSX.Element => {
    const { t } = useTranslation('common')
    const [balance, setBalance] = useState<Balance>(mockBalance)
    const [isLoading, setIsLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)
    const [selectedCurrency, setSelectedCurrency] = useState<string>('usd')

    const formatCurrency = (amount: number, currency: string) => {
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: currency.toUpperCase(),
        }).format(amount)
    }

    const handleRefresh = async () => {
        if (onRefresh) {
            onRefresh()
        }
        
        setIsLoading(true)
        setError(null)
        
        try {
            // TODO: Implement actual refresh logic
            await new Promise(resolve => setTimeout(resolve, 1000))
            
            // Simulate balance update
            setBalance(prev => ({
                ...prev,
                usd: prev.usd + Math.random() * 10 - 5, // Random small change
                sol: prev.sol + Math.random() * 0.1 - 0.05
            }))
        } catch (error) {
            console.error('Refresh balance error:', error)
            setError(t('wallet.error.refresh'))
        } finally {
            setIsLoading(false)
        }
    }

    const getCurrencySymbol = (currency: string) => {
        switch (currency.toLowerCase()) {
            case 'usd': return '$'
            case 'eur': return '€'
            case 'btc': return '₿'
            case 'sol': return '◎'
            default: return '$'
        }
    }

    const getBalanceValue = (currency: string) => {
        switch (currency.toLowerCase()) {
            case 'usd': return balance.usd
            case 'eur': return balance.eur || 0
            case 'btc': return balance.btc || 0
            case 'sol': return balance.sol
            default: return balance.usd
        }
    }

    const getBalanceFormatted = (currency: string) => {
        const value = getBalanceValue(currency)
        if (currency.toLowerCase() === 'sol') {
            return `${value.toFixed(4)} SOL`
        }
        return formatCurrency(value, currency)
    }

    return (
        <div className={`bg-white rounded-lg shadow-sm border border-gray-200 p-6 ${className}`}>
            <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-medium text-gray-900">
                    {t('wallet.balance.title')}
                </h3>
                {showRefresh && (
                    <button
                        onClick={handleRefresh}
                        disabled={isLoading}
                        className="text-indigo-600 hover:text-indigo-500 text-sm font-medium disabled:opacity-50 flex items-center"
                    >
                        {isLoading ? (
                            <>
                                <svg className="animate-spin -ml-1 mr-2 h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                </svg>
                                {t('wallet.balance.refreshing')}
                            </>
                        ) : (
                            <>
                                <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                                </svg>
                                {t('wallet.balance.refresh')}
                            </>
                        )}
                    </button>
                )}
            </div>
            
            {error && (
                <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg text-sm mb-4">
                    {error}
                </div>
            )}

            {isLoading && !balance ? (
                <div className="text-center py-8">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600 mx-auto"></div>
                    <p className="mt-2 text-sm text-gray-500">{t('wallet.balance.loading')}</p>
                </div>
            ) : (
                <div className="space-y-4">
                    {/* Currency Selector */}
                    <div className="flex space-x-2">
                        {['usd', 'eur', 'btc', 'sol'].map((currency) => (
                            <button
                                key={currency}
                                onClick={() => setSelectedCurrency(currency)}
                                className={`px-3 py-1 rounded-full text-sm font-medium transition-colors ${
                                    selectedCurrency === currency
                                        ? 'bg-indigo-100 text-indigo-700'
                                        : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                                }`}
                            >
                                {currency.toUpperCase()}
                            </button>
                        ))}
                    </div>

                    {/* Main Balance Display */}
                    <div className="text-center">
                        <div className="text-4xl font-bold text-gray-900 mb-2">
                            {getBalanceFormatted(selectedCurrency)}
                        </div>
                        <p className="text-sm text-gray-500">
                            {t('wallet.balance.available')}
                        </p>
                    </div>

                    {/* All Balances Grid */}
                    <div className="grid grid-cols-2 gap-4 pt-4 border-t border-gray-200">
                        <div className="text-center">
                            <p className="text-sm text-gray-500 mb-1">USD</p>
                            <p className="text-lg font-semibold text-gray-900">
                                {formatCurrency(balance.usd, 'USD')}
                            </p>
                        </div>
                        <div className="text-center">
                            <p className="text-sm text-gray-500 mb-1">SOL</p>
                            <p className="text-lg font-semibold text-gray-900">
                                {balance.sol.toFixed(4)} SOL
                            </p>
                        </div>
                        {balance.eur && (
                            <div className="text-center">
                                <p className="text-sm text-gray-500 mb-1">EUR</p>
                                <p className="text-lg font-semibold text-gray-900">
                                    {formatCurrency(balance.eur, 'EUR')}
                                </p>
                            </div>
                        )}
                        {balance.btc && (
                            <div className="text-center">
                                <p className="text-sm text-gray-500 mb-1">BTC</p>
                                <p className="text-lg font-semibold text-gray-900">
                                    {balance.btc.toFixed(6)} BTC
                                </p>
                            </div>
                        )}
                    </div>

                    {/* Quick Actions */}
                    <div className="flex space-x-2 pt-4 border-t border-gray-200">
                        <button className="flex-1 bg-indigo-600 text-white py-2 px-4 rounded-lg text-sm font-medium hover:bg-indigo-700 transition-colors">
                            {t('wallet.actions.addMoney')}
                        </button>
                        <button className="flex-1 bg-gray-100 text-gray-700 py-2 px-4 rounded-lg text-sm font-medium hover:bg-gray-200 transition-colors">
                            {t('wallet.actions.sendMoney')}
                        </button>
                    </div>
                </div>
            )}
        </div>
    )
}
