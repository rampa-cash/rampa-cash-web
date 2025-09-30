import { useState } from 'react'
import { useTranslation } from 'next-i18next'
import { useRouter } from 'next/router'
import Link from 'next/link'
import LanguageSwitcher from '@/components/LanguageSwitcher'

// Mock user data - in real app this would come from auth context
const mockUser = {
    id: '123',
    email: 'test@example.com',
    firstName: 'John',
    lastName: 'Doe',
}

// Mock wallet data - in real app this would come from wallet hook
const mockWallet = {
    balance: {
        usd: 1250.50,
        sol: 5.25,
    },
    isLoading: false,
    visaCard: {
        id: 'card123',
        lastFour: '1234',
        status: 'active',
    }
}

// Mock transactions data - in real app this would come from transactions hook
const mockTransactions = [
    {
        id: '1',
        type: 'send',
        amount: 100.00,
        currency: 'USD',
        recipient: 'Jane Smith',
        status: 'completed',
        timestamp: '2024-01-15T10:30:00Z',
    },
    {
        id: '2',
        type: 'receive',
        amount: 250.00,
        currency: 'USD',
        sender: 'Bob Johnson',
        status: 'completed',
        timestamp: '2024-01-14T15:45:00Z',
    },
]

export const Dashboard = (): JSX.Element => {
    const { t } = useTranslation('common')
    const router = useRouter()
    const [isRefreshing, setIsRefreshing] = useState(false)

    const handleRefresh = async () => {
        setIsRefreshing(true)
        // TODO: Implement actual refresh logic
        await new Promise(resolve => setTimeout(resolve, 1000))
        setIsRefreshing(false)
    }

    const handleLogout = () => {
        // TODO: Implement actual logout logic
        router.push('/login')
    }

    const formatCurrency = (amount: number, currency: string) => {
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: currency,
        }).format(amount)
    }

    const formatDate = (timestamp: string) => {
        return new Date(timestamp).toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
            year: 'numeric',
        })
    }

    const getTransactionIcon = (type: string) => {
        switch (type) {
            case 'send':
                return (
                    <svg className="w-5 h-5 text-red-500" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-8.707l-3-3a1 1 0 00-1.414 0l-3 3a1 1 0 001.414 1.414L9 9.414V13a1 1 0 102 0V9.414l1.293 1.293a1 1 0 001.414-1.414z" clipRule="evenodd" />
                    </svg>
                )
            case 'receive':
                return (
                    <svg className="w-5 h-5 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-11a1 1 0 10-2 0v3.586L7.707 9.293a1 1 0 00-1.414 1.414l3 3a1 1 0 001.414 0l3-3a1 1 0 00-1.414-1.414L11 10.586V7z" clipRule="evenodd" />
                    </svg>
                )
            case 'onramp':
                return (
                    <svg className="w-5 h-5 text-blue-500" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M4 4a2 2 0 00-2 2v4a2 2 0 002 2V6h10a2 2 0 00-2-2H4zm2 6a2 2 0 012-2h8a2 2 0 012 2v4a2 2 0 01-2 2H8a2 2 0 01-2-2v-4zm6 4a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                    </svg>
                )
            case 'offramp':
                return (
                    <svg className="w-5 h-5 text-purple-500" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M4 4a2 2 0 00-2 2v4a2 2 0 002 2V6h10a2 2 0 00-2-2H4zm2 6a2 2 0 012-2h8a2 2 0 012 2v4a2 2 0 01-2 2H8a2 2 0 01-2-2v-4zm6 4a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                    </svg>
                )
            default:
                return null
        }
    }

    const getStatusBadge = (status: string) => {
        const baseClasses = "inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium"
        switch (status) {
            case 'completed':
                return `${baseClasses} bg-green-100 text-green-800`
            case 'pending':
                return `${baseClasses} bg-yellow-100 text-yellow-800`
            case 'failed':
                return `${baseClasses} bg-red-100 text-red-800`
            default:
                return `${baseClasses} bg-gray-100 text-gray-800`
        }
    }

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Header */}
            <header className="bg-white shadow-sm border-b border-gray-200">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between items-center h-16">
                        <div className="flex items-center">
                            <h1 className="text-xl font-semibold text-gray-900">
                                {t('dashboard.title')}
                            </h1>
                        </div>
                        <div className="flex items-center space-x-4">
                            <LanguageSwitcher />
                            <button
                                onClick={handleLogout}
                                className="text-gray-500 hover:text-gray-700 px-3 py-2 rounded-md text-sm font-medium"
                            >
                                {t('dashboard.logout')}
                            </button>
                        </div>
                    </div>
                </div>
            </header>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {/* Welcome Section */}
                <div className="mb-8">
                    <h2 className="text-2xl font-bold text-gray-900">
                        {t('dashboard.welcome', { name: mockUser.firstName })}
                    </h2>
                    <p className="text-gray-600">
                        {t('dashboard.subtitle')}
                    </p>
                </div>

                {/* Wallet Balance */}
                <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-8">
                    <div className="flex justify-between items-center mb-4">
                        <h3 className="text-lg font-medium text-gray-900">
                            {t('dashboard.balance.title')}
                        </h3>
                        <button
                            onClick={handleRefresh}
                            disabled={isRefreshing}
                            className="text-indigo-600 hover:text-indigo-500 text-sm font-medium disabled:opacity-50"
                        >
                            {isRefreshing ? t('dashboard.balance.refreshing') : t('dashboard.balance.refresh')}
                        </button>
                    </div>
                    
                    {mockWallet.isLoading ? (
                        <div className="text-center py-8">
                            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600 mx-auto"></div>
                            <p className="mt-2 text-sm text-gray-500">{t('dashboard.balance.loading')}</p>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <p className="text-sm text-gray-500 mb-1">{t('dashboard.balance.usd')}</p>
                                <p className="text-3xl font-bold text-gray-900">
                                    {formatCurrency(mockWallet.balance.usd, 'USD')}
                                </p>
                            </div>
                            <div>
                                <p className="text-sm text-gray-500 mb-1">{t('dashboard.balance.sol')}</p>
                                <p className="text-3xl font-bold text-gray-900">
                                    {mockWallet.balance.sol} SOL
                                </p>
                            </div>
                        </div>
                    )}
                </div>

                {/* Quick Actions */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
                    <button
                        onClick={() => router.push('/send')}
                        className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 hover:shadow-md transition-shadow text-center"
                    >
                        <div className="w-12 h-12 bg-indigo-100 rounded-lg flex items-center justify-center mx-auto mb-3">
                            <svg className="w-6 h-6 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                            </svg>
                        </div>
                        <p className="text-sm font-medium text-gray-900">{t('dashboard.actions.sendMoney')}</p>
                    </button>
                    
                    <button
                        onClick={() => router.push('/receive')}
                        className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 hover:shadow-md transition-shadow text-center"
                    >
                        <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mx-auto mb-3">
                            <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 5v14m7-7H5" />
                            </svg>
                        </div>
                        <p className="text-sm font-medium text-gray-900">{t('dashboard.actions.receiveMoney')}</p>
                    </button>
                    
                    <button
                        onClick={() => router.push('/onramp')}
                        className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 hover:shadow-md transition-shadow text-center"
                    >
                        <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mx-auto mb-3">
                            <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                            </svg>
                        </div>
                        <p className="text-sm font-medium text-gray-900">{t('dashboard.actions.addMoney')}</p>
                    </button>
                    
                    <button
                        onClick={() => router.push('/offramp')}
                        className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 hover:shadow-md transition-shadow text-center"
                    >
                        <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mx-auto mb-3">
                            <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 12H4m16 0l-4-4m4 4l-4 4" />
                            </svg>
                        </div>
                        <p className="text-sm font-medium text-gray-900">{t('dashboard.actions.cashOut')}</p>
                    </button>
                </div>

                {/* VISA Card Section */}
                <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-8">
                    <div className="flex justify-between items-center mb-4">
                        <h3 className="text-lg font-medium text-gray-900">
                            {t('dashboard.visaCard.title')}
                        </h3>
                        {mockWallet.visaCard ? (
                            <span className="text-sm text-green-600 font-medium">
                                {t('dashboard.visaCard.active')}
                            </span>
                        ) : (
                            <button
                                onClick={() => router.push('/visa-card')}
                                className="text-indigo-600 hover:text-indigo-500 text-sm font-medium"
                            >
                                {t('dashboard.visaCard.getCard')}
                            </button>
                        )}
                    </div>
                    
                    {mockWallet.visaCard ? (
                        <div className="bg-gradient-to-r from-indigo-600 to-purple-600 rounded-lg p-6 text-white">
                            <div className="flex justify-between items-center">
                                <div>
                                    <p className="text-sm opacity-90 mb-1">{t('dashboard.visaCard.cardNumber')}</p>
                                    <p className="text-xl font-mono">•••• •••• •••• {mockWallet.visaCard.lastFour}</p>
                                </div>
                                <div className="text-right">
                                    <p className="text-sm opacity-90 mb-1">{t('dashboard.visaCard.status')}</p>
                                    <p className="text-sm font-medium capitalize">{mockWallet.visaCard.status}</p>
                                </div>
                            </div>
                        </div>
                    ) : (
                        <div className="text-center py-8">
                            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                                </svg>
                            </div>
                            <p className="text-gray-500 mb-4">{t('dashboard.visaCard.noCard')}</p>
                            <button
                                onClick={() => router.push('/visa-card')}
                                className="bg-indigo-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-indigo-700"
                            >
                                {t('dashboard.visaCard.getCard')}
                            </button>
                        </div>
                    )}
                </div>

                {/* Recent Transactions */}
                <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                    <div className="flex justify-between items-center mb-6">
                        <h3 className="text-lg font-medium text-gray-900">
                            {t('dashboard.transactions.title')}
                        </h3>
                        <Link
                            href="/transactions"
                            className="text-indigo-600 hover:text-indigo-500 text-sm font-medium"
                        >
                            {t('dashboard.transactions.viewAll')}
                        </Link>
                    </div>
                    
                    {mockTransactions.length === 0 ? (
                        <div className="text-center py-8">
                            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                                </svg>
                            </div>
                            <p className="text-gray-500">{t('dashboard.transactions.noTransactions')}</p>
                        </div>
                    ) : (
                        <div className="space-y-4">
                            {mockTransactions.map((transaction) => (
                                <div key={transaction.id} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50">
                                    <div className="flex items-center space-x-3">
                                        <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center">
                                            {getTransactionIcon(transaction.type)}
                                        </div>
                                        <div>
                                            <p className="text-sm font-medium text-gray-900">
                                                {transaction.type === 'send' ? transaction.recipient : transaction.sender}
                                            </p>
                                            <p className="text-xs text-gray-500">
                                                {formatDate(transaction.timestamp)}
                                            </p>
                                        </div>
                                    </div>
                                    <div className="text-right">
                                        <p className={`text-sm font-medium ${
                                            transaction.type === 'send' ? 'text-red-600' : 'text-green-600'
                                        }`}>
                                            {transaction.type === 'send' ? '-' : '+'}{formatCurrency(transaction.amount, transaction.currency)}
                                        </p>
                                        <span className={getStatusBadge(transaction.status)}>
                                            {transaction.status}
                                        </span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}
