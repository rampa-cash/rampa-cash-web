import { useState, useEffect } from 'react'
import { useTranslation } from 'next-i18next'
import { useRouter } from 'next/router'
import Link from 'next/link'
import LanguageSwitcher from '@/components/LanguageSwitcher'

interface Transaction {
    id: string
    type: 'send' | 'receive' | 'onramp' | 'offramp'
    amount: number
    currency: string
    recipient?: string
    sender?: string
    status: 'completed' | 'pending' | 'failed'
    timestamp: string
    memo?: string
}

// Mock transactions data - in real app this would come from transactions hook
const mockTransactions: Transaction[] = [
    {
        id: '1',
        type: 'send',
        amount: 100.00,
        currency: 'USD',
        recipient: 'Jane Smith',
        status: 'completed',
        timestamp: '2024-01-15T10:30:00Z',
        memo: 'Test payment',
    },
    {
        id: '2',
        type: 'receive',
        amount: 250.00,
        currency: 'USD',
        sender: 'Bob Johnson',
        status: 'completed',
        timestamp: '2024-01-14T15:45:00Z',
        memo: 'Refund',
    },
    {
        id: '3',
        type: 'send',
        amount: 50.00,
        currency: 'USD',
        recipient: 'Alice Brown',
        status: 'pending',
        timestamp: '2024-01-13T09:15:00Z',
        memo: 'Coffee money',
    },
    {
        id: '4',
        type: 'onramp',
        amount: 500.00,
        currency: 'USD',
        status: 'completed',
        timestamp: '2024-01-12T14:20:00Z',
        memo: 'Bank deposit',
    },
    {
        id: '5',
        type: 'offramp',
        amount: 200.00,
        currency: 'USD',
        status: 'failed',
        timestamp: '2024-01-11T16:30:00Z',
        memo: 'ATM withdrawal',
    },
]

export const TransactionHistory = (): JSX.Element => {
    const { t } = useTranslation('common')
    const router = useRouter()
    const [isLoading, setIsLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)
    const [transactions, setTransactions] = useState<Transaction[]>(mockTransactions)
    const [filteredTransactions, setFilteredTransactions] = useState<Transaction[]>(mockTransactions)
    const [searchTerm, setSearchTerm] = useState('')
    const [typeFilter, setTypeFilter] = useState<string>('all')
    const [statusFilter, setStatusFilter] = useState<string>('all')
    const [sortBy, setSortBy] = useState<string>('date')
    const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc')
    const [selectedTransaction, setSelectedTransaction] = useState<Transaction | null>(null)

    useEffect(() => {
        let filtered = [...transactions]

        // Filter by search term
        if (searchTerm) {
            filtered = filtered.filter(transaction =>
                transaction.recipient?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                transaction.sender?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                transaction.memo?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                transaction.amount.toString().includes(searchTerm)
            )
        }

        // Filter by type
        if (typeFilter !== 'all') {
            filtered = filtered.filter(transaction => transaction.type === typeFilter)
        }

        // Filter by status
        if (statusFilter !== 'all') {
            filtered = filtered.filter(transaction => transaction.status === statusFilter)
        }

        // Sort transactions
        filtered.sort((a, b) => {
            let comparison = 0
            switch (sortBy) {
                case 'date':
                    comparison = new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime()
                    break
                case 'amount':
                    comparison = a.amount - b.amount
                    break
                case 'recipient':
                    comparison = (a.recipient || a.sender || '').localeCompare(b.recipient || b.sender || '')
                    break
                default:
                    comparison = 0
            }
            return sortOrder === 'asc' ? comparison : -comparison
        })

        setFilteredTransactions(filtered)
    }, [transactions, searchTerm, typeFilter, statusFilter, sortBy, sortOrder])

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

    const handleRefresh = async () => {
        setIsLoading(true)
        setError(null)
        
        try {
            // TODO: Implement actual refresh logic
            await new Promise(resolve => setTimeout(resolve, 1000))
            // In real app, this would fetch fresh data
        } catch (error) {
            console.error('Refresh error:', error)
            setError(t('transactions.error.refresh'))
        } finally {
            setIsLoading(false)
        }
    }

    const handleExport = () => {
        // TODO: Implement export functionality
        console.log('Export transactions')
    }

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Header */}
            <header className="bg-white shadow-sm border-b border-gray-200">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between items-center h-16">
                        <div className="flex items-center">
                            <button
                                onClick={() => router.back()}
                                className="mr-4 text-gray-500 hover:text-gray-700"
                            >
                                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                                </svg>
                            </button>
                            <h1 className="text-xl font-semibold text-gray-900">
                                {t('transactions.title')}
                            </h1>
                        </div>
                        <div className="flex items-center space-x-4">
                            <button
                                onClick={handleRefresh}
                                disabled={isLoading}
                                className="text-indigo-600 hover:text-indigo-500 text-sm font-medium disabled:opacity-50"
                            >
                                {isLoading ? t('transactions.refreshing') : t('transactions.refresh')}
                            </button>
                            <button
                                onClick={handleExport}
                                className="text-indigo-600 hover:text-indigo-500 text-sm font-medium"
                            >
                                {t('transactions.export')}
                            </button>
                            <LanguageSwitcher />
                        </div>
                    </div>
                </div>
            </header>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {/* Filters and Search */}
                <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-8">
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                        {/* Search */}
                        <div>
                            <label htmlFor="search" className="block text-sm font-medium text-gray-700 mb-2">
                                {t('transactions.search.label')}
                            </label>
                            <input
                                id="search"
                                type="text"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                                placeholder={t('transactions.search.placeholder')}
                            />
                        </div>

                        {/* Type Filter */}
                        <div>
                            <label htmlFor="typeFilter" className="block text-sm font-medium text-gray-700 mb-2">
                                {t('transactions.filters.type')}
                            </label>
                            <select
                                id="typeFilter"
                                value={typeFilter}
                                onChange={(e) => setTypeFilter(e.target.value)}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                            >
                                <option value="all">{t('transactions.filters.allTypes')}</option>
                                <option value="send">{t('transactions.filters.sent')}</option>
                                <option value="receive">{t('transactions.filters.received')}</option>
                                <option value="onramp">{t('transactions.filters.onramp')}</option>
                                <option value="offramp">{t('transactions.filters.offramp')}</option>
                            </select>
                        </div>

                        {/* Status Filter */}
                        <div>
                            <label htmlFor="statusFilter" className="block text-sm font-medium text-gray-700 mb-2">
                                {t('transactions.filters.status')}
                            </label>
                            <select
                                id="statusFilter"
                                value={statusFilter}
                                onChange={(e) => setStatusFilter(e.target.value)}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                            >
                                <option value="all">{t('transactions.filters.allStatuses')}</option>
                                <option value="completed">{t('transactions.filters.completed')}</option>
                                <option value="pending">{t('transactions.filters.pending')}</option>
                                <option value="failed">{t('transactions.filters.failed')}</option>
                            </select>
                        </div>

                        {/* Sort */}
                        <div>
                            <label htmlFor="sortBy" className="block text-sm font-medium text-gray-700 mb-2">
                                {t('transactions.sort.label')}
                            </label>
                            <select
                                id="sortBy"
                                value={sortBy}
                                onChange={(e) => setSortBy(e.target.value)}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                            >
                                <option value="date">{t('transactions.sort.date')}</option>
                                <option value="amount">{t('transactions.sort.amount')}</option>
                                <option value="recipient">{t('transactions.sort.recipient')}</option>
                            </select>
                        </div>
                    </div>
                </div>

                {/* Error Display */}
                {error && (
                    <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg text-sm mb-6">
                        {error}
                    </div>
                )}

                {/* Transactions List */}
                <div className="bg-white rounded-lg shadow-sm border border-gray-200">
                    {isLoading ? (
                        <div className="text-center py-12">
                            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600 mx-auto"></div>
                            <p className="mt-2 text-sm text-gray-500">{t('transactions.loading')}</p>
                        </div>
                    ) : filteredTransactions.length === 0 ? (
                        <div className="text-center py-12">
                            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                                </svg>
                            </div>
                            <p className="text-gray-500">{t('transactions.noTransactions')}</p>
                        </div>
                    ) : (
                        <div className="divide-y divide-gray-200">
                            {filteredTransactions.map((transaction) => (
                                <div
                                    key={transaction.id}
                                    data-testid="transaction-item"
                                    className="p-6 hover:bg-gray-50 cursor-pointer"
                                    onClick={() => setSelectedTransaction(transaction)}
                                >
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center space-x-4">
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
                                                {transaction.memo && (
                                                    <p className="text-xs text-gray-400 mt-1">
                                                        {transaction.memo}
                                                    </p>
                                                )}
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
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>

            {/* Transaction Details Modal */}
            {selectedTransaction && (
                <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
                    <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
                        <div className="mt-3">
                            <div className="flex justify-between items-center mb-4">
                                <h3 className="text-lg font-medium text-gray-900">
                                    {t('transactions.details.title')}
                                </h3>
                                <button
                                    onClick={() => setSelectedTransaction(null)}
                                    className="text-gray-400 hover:text-gray-600"
                                >
                                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                    </svg>
                                </button>
                            </div>
                            
                            <div className="space-y-4">
                                <div>
                                    <p className="text-sm text-gray-500">{t('transactions.details.id')}</p>
                                    <p className="font-mono text-sm">{selectedTransaction.id}</p>
                                </div>
                                
                                <div>
                                    <p className="text-sm text-gray-500">{t('transactions.details.amount')}</p>
                                    <p className="text-lg font-medium">
                                        {formatCurrency(selectedTransaction.amount, selectedTransaction.currency)}
                                    </p>
                                </div>
                                
                                <div>
                                    <p className="text-sm text-gray-500">{t('transactions.details.status')}</p>
                                    <span className={getStatusBadge(selectedTransaction.status)}>
                                        {selectedTransaction.status}
                                    </span>
                                </div>
                                
                                <div>
                                    <p className="text-sm text-gray-500">{t('transactions.details.date')}</p>
                                    <p className="text-sm">{formatDate(selectedTransaction.timestamp)}</p>
                                </div>
                                
                                {selectedTransaction.memo && (
                                    <div>
                                        <p className="text-sm text-gray-500">{t('transactions.details.memo')}</p>
                                        <p className="text-sm">{selectedTransaction.memo}</p>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}
