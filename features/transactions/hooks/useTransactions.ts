import { useState, useEffect, useCallback } from 'react'
import { TransactionService } from '../services/transaction.service'
import type { 
    Transaction, 
    TransactionFilters, 
    TransactionStats 
} from '../types'

interface UseTransactionsReturn {
    // State
    transactions: Transaction[]
    recentTransactions: Transaction[]
    stats: TransactionStats | null
    isLoading: boolean
    error: string | null
    hasMore: boolean
    total: number
    page: number

    // Actions
    sendMoney: (request: SendMoneyRequest) => Promise<SendMoneyResponse>
    loadTransactions: (page?: number, filters?: TransactionFilters, sort?: TransactionSort) => Promise<void>
    loadMore: () => Promise<void>
    refreshTransactions: () => Promise<void>
    getTransactionById: (id: string) => Promise<Transaction>
    cancelTransaction: (id: string) => Promise<void>
    retryTransaction: (id: string) => Promise<Transaction>
    exportTransactions: (filters?: TransactionFilters, format?: 'csv' | 'pdf') => Promise<Blob>
    loadStats: (period?: 'day' | 'week' | 'month' | 'year') => Promise<void>
    searchTransactions: (query: string) => Promise<void>
    clearError: () => void
}

export const useTransactions = (): UseTransactionsReturn => {
    const [transactions, setTransactions] = useState<Transaction[]>([])
    const [recentTransactions, setRecentTransactions] = useState<Transaction[]>([])
    const [stats, setStats] = useState<TransactionStats | null>(null)
    const [isLoading, setIsLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)
    const [hasMore, setHasMore] = useState(false)
    const [total, setTotal] = useState(0)
    const [page, setPage] = useState(1)
    const [currentFilters, setCurrentFilters] = useState<TransactionFilters>({})
    const [currentSort, setCurrentSort] = useState<TransactionSort>({ field: 'date', direction: 'desc' })

    /**
     * Initialize transactions
     */
    useEffect(() => {
        const initializeTransactions = async () => {
            try {
                setIsLoading(true)

                // Load recent transactions and stats in parallel
                const [recentData, statsData] = await Promise.all([
                    TransactionService.getRecentTransactions(),
                    TransactionService.getTransactionStats(),
                ])

                setRecentTransactions(recentData)
                setStats(statsData)

                // Load first page of transactions
                await loadTransactions(1)
            } catch (error) {
                console.error('Initialize transactions error:', error)
                setError('Failed to initialize transactions')
            } finally {
                setIsLoading(false)
            }
        }

        initializeTransactions()
    }, [])

    /**
     * Send money
     */
    const sendMoney = useCallback(async (request: SendMoneyRequest): Promise<SendMoneyResponse> => {
        try {
            setIsLoading(true)
            setError(null)

            const response = await TransactionService.sendMoney(request)

            // Refresh transactions after successful send
            await refreshTransactions()

            return response
        } catch (error) {
            console.error('Send money error:', error)
            const errorMessage = error instanceof Error ? error.message : 'Failed to send money'
            setError(errorMessage)
            throw error
        } finally {
            setIsLoading(false)
        }
    }, [])

    /**
     * Load transactions with filters and pagination
     */
    const loadTransactions = useCallback(async (
        pageNum: number = 1,
        filters?: TransactionFilters,
        sort?: TransactionSort
    ) => {
        try {
            setIsLoading(true)
            setError(null)

            const response = await TransactionService.getTransactions(pageNum, 20, filters, sort)

            if (pageNum === 1) {
                setTransactions(response.transactions)
            } else {
                setTransactions(prev => [...prev, ...response.transactions])
            }

            setHasMore(response.hasMore)
            setTotal(response.total)
            setPage(response.page)
            setCurrentFilters(filters || {})
            setCurrentSort(sort || { field: 'date', direction: 'desc' })
        } catch (error) {
            console.error('Load transactions error:', error)
            const errorMessage = error instanceof Error ? error.message : 'Failed to load transactions'
            setError(errorMessage)
        } finally {
            setIsLoading(false)
        }
    }, [])

    /**
     * Load more transactions (pagination)
     */
    const loadMore = useCallback(async () => {
        if (!hasMore || isLoading) return

        await loadTransactions(page + 1, currentFilters, currentSort)
    }, [hasMore, isLoading, page, currentFilters, currentSort, loadTransactions])

    /**
     * Refresh transactions
     */
    const refreshTransactions = useCallback(async () => {
        try {
            setError(null)

            // Load recent transactions and first page in parallel
            const [recentData, transactionsData] = await Promise.all([
                TransactionService.getRecentTransactions(),
                TransactionService.getTransactions(1, 20, currentFilters, currentSort),
            ])

            setRecentTransactions(recentData)
            setTransactions(transactionsData.transactions)
            setHasMore(transactionsData.hasMore)
            setTotal(transactionsData.total)
            setPage(1)
        } catch (error) {
            console.error('Refresh transactions error:', error)
            const errorMessage = error instanceof Error ? error.message : 'Failed to refresh transactions'
            setError(errorMessage)
        }
    }, [currentFilters, currentSort])

    /**
     * Get transaction by ID
     */
    const getTransactionById = useCallback(async (id: string): Promise<Transaction> => {
        try {
            setError(null)

            const transaction = await TransactionService.getTransactionById(id)
            return transaction
        } catch (error) {
            console.error('Get transaction by ID error:', error)
            const errorMessage = error instanceof Error ? error.message : 'Failed to fetch transaction'
            setError(errorMessage)
            throw error
        }
    }, [])

    /**
     * Cancel transaction
     */
    const cancelTransaction = useCallback(async (id: string) => {
        try {
            setIsLoading(true)
            setError(null)

            await TransactionService.cancelTransaction(id)

            // Refresh transactions after cancellation
            await refreshTransactions()
        } catch (error) {
            console.error('Cancel transaction error:', error)
            const errorMessage = error instanceof Error ? error.message : 'Failed to cancel transaction'
            setError(errorMessage)
            throw error
        } finally {
            setIsLoading(false)
        }
    }, [refreshTransactions])

    /**
     * Retry transaction
     */
    const retryTransaction = useCallback(async (id: string): Promise<Transaction> => {
        try {
            setIsLoading(true)
            setError(null)

            const transaction = await TransactionService.retryTransaction(id)

            // Refresh transactions after retry
            await refreshTransactions()

            return transaction
        } catch (error) {
            console.error('Retry transaction error:', error)
            const errorMessage = error instanceof Error ? error.message : 'Failed to retry transaction'
            setError(errorMessage)
            throw error
        } finally {
            setIsLoading(false)
        }
    }, [refreshTransactions])

    /**
     * Export transactions
     */
    const exportTransactions = useCallback(async (
        filters?: TransactionFilters,
        format: 'csv' | 'pdf' = 'csv'
    ): Promise<Blob> => {
        try {
            setError(null)

            const blob = await TransactionService.exportTransactions(filters, format)
            return blob
        } catch (error) {
            console.error('Export transactions error:', error)
            const errorMessage = error instanceof Error ? error.message : 'Failed to export transactions'
            setError(errorMessage)
            throw error
        }
    }, [])

    /**
     * Load transaction statistics
     */
    const loadStats = useCallback(async (period: 'day' | 'week' | 'month' | 'year' = 'month') => {
        try {
            setError(null)

            const statsData = await TransactionService.getTransactionStats(period)
            setStats(statsData)
        } catch (error) {
            console.error('Load stats error:', error)
            const errorMessage = error instanceof Error ? error.message : 'Failed to load statistics'
            setError(errorMessage)
        }
    }, [])

    /**
     * Search transactions
     */
    const searchTransactions = useCallback(async (query: string) => {
        try {
            setIsLoading(true)
            setError(null)

            const response = await TransactionService.searchTransactions(query, 1, 20)

            setTransactions(response.transactions)
            setHasMore(response.hasMore)
            setTotal(response.total)
            setPage(1)
            setCurrentFilters({ search: query })
        } catch (error) {
            console.error('Search transactions error:', error)
            const errorMessage = error instanceof Error ? error.message : 'Failed to search transactions'
            setError(errorMessage)
        } finally {
            setIsLoading(false)
        }
    }, [])

    /**
     * Clear error state
     */
    const clearError = useCallback(() => {
        setError(null)
    }, [])

    return {
        // State
        transactions,
        recentTransactions,
        stats,
        isLoading,
        error,
        hasMore,
        total,
        page,

        // Actions
        sendMoney,
        loadTransactions,
        loadMore,
        refreshTransactions,
        getTransactionById,
        cancelTransaction,
        retryTransaction,
        exportTransactions,
        loadStats,
        searchTransactions,
        clearError,
    }
}
