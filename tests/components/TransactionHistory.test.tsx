import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { useRouter } from 'next/router';
import TransactionHistory from '@/components/TransactionHistory';

// Mock Next.js router
jest.mock('next/router', () => ({
    useRouter: jest.fn(),
}));

// Mock transactions hook
jest.mock('@/hooks/useTransactions', () => ({
    useTransactions: () => ({
        transactions: [
            {
                id: '1',
                type: 'send',
                amount: 100.0,
                currency: 'USD',
                recipient: 'Jane Smith',
                status: 'completed',
                timestamp: '2024-01-15T10:30:00Z',
                memo: 'Test payment',
            },
            {
                id: '2',
                type: 'receive',
                amount: 250.0,
                currency: 'USD',
                sender: 'Bob Johnson',
                status: 'completed',
                timestamp: '2024-01-14T15:45:00Z',
                memo: 'Refund',
            },
            {
                id: '3',
                type: 'send',
                amount: 50.0,
                currency: 'USD',
                recipient: 'Alice Brown',
                status: 'pending',
                timestamp: '2024-01-13T09:15:00Z',
                memo: 'Coffee money',
            },
            {
                id: '4',
                type: 'onramp',
                amount: 500.0,
                currency: 'USD',
                status: 'completed',
                timestamp: '2024-01-12T14:20:00Z',
                memo: 'Bank deposit',
            },
            {
                id: '5',
                type: 'offramp',
                amount: 200.0,
                currency: 'USD',
                status: 'failed',
                timestamp: '2024-01-11T16:30:00Z',
                memo: 'ATM withdrawal',
            },
        ],
        isLoading: false,
        error: null,
        hasMore: true,
        loadMore: jest.fn(),
    }),
}));

// Mock i18n
jest.mock('next-i18next', () => ({
    useTranslation: () => ({
        t: (key: string) => key,
        i18n: {
            changeLanguage: jest.fn(),
        },
    }),
}));

const mockPush = jest.fn();
const mockRouter = {
    push: mockPush,
    pathname: '/transactions',
    query: {},
    asPath: '/transactions',
};

describe('TransactionHistory', () => {
    beforeEach(() => {
        jest.clearAllMocks();
        (useRouter as jest.Mock).mockReturnValue(mockRouter);
    });

    it('should render transaction history header', () => {
        render(<TransactionHistory />);

        expect(screen.getByText(/transaction history/i)).toBeInTheDocument();
    });

    it('should render all transactions', () => {
        render(<TransactionHistory />);

        expect(screen.getByText(/jane smith/i)).toBeInTheDocument();
        expect(screen.getByText(/bob johnson/i)).toBeInTheDocument();
        expect(screen.getByText(/alice brown/i)).toBeInTheDocument();
    });

    it('should display transaction amounts correctly', () => {
        render(<TransactionHistory />);

        expect(screen.getByText(/-\$100.00/i)).toBeInTheDocument();
        expect(screen.getByText(/\+\$250.00/i)).toBeInTheDocument();
        expect(screen.getByText(/-\$50.00/i)).toBeInTheDocument();
        expect(screen.getByText(/\+\$500.00/i)).toBeInTheDocument();
        expect(screen.getByText(/-\$200.00/i)).toBeInTheDocument();
    });

    it('should display transaction status badges', () => {
        render(<TransactionHistory />);

        expect(screen.getAllByText(/completed/i)).toHaveLength(3);
        expect(screen.getByText(/pending/i)).toBeInTheDocument();
        expect(screen.getByText(/failed/i)).toBeInTheDocument();
    });

    it('should display transaction timestamps', () => {
        render(<TransactionHistory />);

        expect(screen.getByText(/jan 15, 2024/i)).toBeInTheDocument();
        expect(screen.getByText(/jan 14, 2024/i)).toBeInTheDocument();
        expect(screen.getByText(/jan 13, 2024/i)).toBeInTheDocument();
    });

    it('should display transaction memos', () => {
        render(<TransactionHistory />);

        expect(screen.getByText(/test payment/i)).toBeInTheDocument();
        expect(screen.getByText(/refund/i)).toBeInTheDocument();
        expect(screen.getByText(/coffee money/i)).toBeInTheDocument();
    });

    it('should show loading state when transactions are loading', () => {
        const mockUseTransactions =
            require('@/hooks/useTransactions').useTransactions;
        mockUseTransactions.mockReturnValue({
            transactions: [],
            isLoading: true,
            error: null,
            hasMore: false,
            loadMore: jest.fn(),
        });

        render(<TransactionHistory />);

        expect(screen.getByText(/loading transactions/i)).toBeInTheDocument();
    });

    it('should show error message when transactions fail to load', () => {
        const mockUseTransactions =
            require('@/hooks/useTransactions').useTransactions;
        mockUseTransactions.mockReturnValue({
            transactions: [],
            isLoading: false,
            error: 'Failed to load transactions',
            hasMore: false,
            loadMore: jest.fn(),
        });

        render(<TransactionHistory />);

        expect(
            screen.getByText(/failed to load transactions/i)
        ).toBeInTheDocument();
    });

    it('should show empty state when no transactions exist', () => {
        const mockUseTransactions =
            require('@/hooks/useTransactions').useTransactions;
        mockUseTransactions.mockReturnValue({
            transactions: [],
            isLoading: false,
            error: null,
            hasMore: false,
            loadMore: jest.fn(),
        });

        render(<TransactionHistory />);

        expect(screen.getByText(/no transactions yet/i)).toBeInTheDocument();
        expect(
            screen.getByText(/your transaction history will appear here/i)
        ).toBeInTheDocument();
    });

    it('should filter transactions by type', () => {
        render(<TransactionHistory />);

        const sendFilter = screen.getByRole('button', { name: /sent/i });
        fireEvent.click(sendFilter);

        expect(screen.getByText(/jane smith/i)).toBeInTheDocument();
        expect(screen.getByText(/alice brown/i)).toBeInTheDocument();
        expect(screen.queryByText(/bob johnson/i)).not.toBeInTheDocument();
    });

    it('should filter transactions by status', () => {
        render(<TransactionHistory />);

        const completedFilter = screen.getByRole('button', {
            name: /completed/i,
        });
        fireEvent.click(completedFilter);

        expect(screen.getAllByText(/completed/i)).toHaveLength(3);
        expect(screen.queryByText(/pending/i)).not.toBeInTheDocument();
        expect(screen.queryByText(/failed/i)).not.toBeInTheDocument();
    });

    it('should search transactions by recipient/sender name', () => {
        render(<TransactionHistory />);

        const searchInput = screen.getByPlaceholderText(/search transactions/i);
        fireEvent.change(searchInput, { target: { value: 'jane' } });

        expect(screen.getByText(/jane smith/i)).toBeInTheDocument();
        expect(screen.queryByText(/bob johnson/i)).not.toBeInTheDocument();
        expect(screen.queryByText(/alice brown/i)).not.toBeInTheDocument();
    });

    it('should search transactions by amount', () => {
        render(<TransactionHistory />);

        const searchInput = screen.getByPlaceholderText(/search transactions/i);
        fireEvent.change(searchInput, { target: { value: '100' } });

        expect(screen.getByText(/jane smith/i)).toBeInTheDocument();
        expect(screen.queryByText(/bob johnson/i)).not.toBeInTheDocument();
    });

    it('should sort transactions by date (newest first)', () => {
        render(<TransactionHistory />);

        const transactionItems = screen.getAllByTestId('transaction-item');
        expect(transactionItems[0]).toHaveTextContent('Jan 15, 2024');
        expect(transactionItems[1]).toHaveTextContent('Jan 14, 2024');
    });

    it('should sort transactions by amount when sort option is changed', () => {
        render(<TransactionHistory />);

        const sortSelect = screen.getByLabelText(/sort by/i);
        fireEvent.change(sortSelect, { target: { value: 'amount' } });

        const transactionItems = screen.getAllByTestId('transaction-item');
        expect(transactionItems[0]).toHaveTextContent('$500.00');
        expect(transactionItems[1]).toHaveTextContent('$250.00');
    });

    it('should load more transactions when load more button is clicked', () => {
        const mockLoadMore = jest.fn();
        const mockUseTransactions =
            require('@/hooks/useTransactions').useTransactions;
        mockUseTransactions.mockReturnValue({
            transactions: [
                {
                    id: '1',
                    type: 'send',
                    amount: 100,
                    currency: 'USD',
                    recipient: 'Jane Smith',
                    status: 'completed',
                    timestamp: '2024-01-15T10:30:00Z',
                },
            ],
            isLoading: false,
            error: null,
            hasMore: true,
            loadMore: mockLoadMore,
        });

        render(<TransactionHistory />);

        const loadMoreButton = screen.getByRole('button', {
            name: /load more/i,
        });
        fireEvent.click(loadMoreButton);

        expect(mockLoadMore).toHaveBeenCalled();
    });

    it('should not show load more button when no more transactions', () => {
        const mockUseTransactions =
            require('@/hooks/useTransactions').useTransactions;
        mockUseTransactions.mockReturnValue({
            transactions: [
                {
                    id: '1',
                    type: 'send',
                    amount: 100,
                    currency: 'USD',
                    recipient: 'Jane Smith',
                    status: 'completed',
                    timestamp: '2024-01-15T10:30:00Z',
                },
            ],
            isLoading: false,
            error: null,
            hasMore: false,
            loadMore: jest.fn(),
        });

        render(<TransactionHistory />);

        expect(
            screen.queryByRole('button', { name: /load more/i })
        ).not.toBeInTheDocument();
    });

    it('should show transaction details when transaction is clicked', () => {
        render(<TransactionHistory />);

        const transactionItem = screen
            .getByText(/jane smith/i)
            .closest('[data-testid="transaction-item"]');
        fireEvent.click(transactionItem!);

        expect(screen.getByText(/transaction details/i)).toBeInTheDocument();
        expect(screen.getByText(/transaction id: 1/i)).toBeInTheDocument();
        expect(screen.getByText(/amount: \$100.00/i)).toBeInTheDocument();
    });

    it('should export transactions when export button is clicked', () => {
        const mockExport = jest.fn();
        global.URL.createObjectURL = jest.fn(() => 'blob:url');
        global.URL.revokeObjectURL = jest.fn();

        render(<TransactionHistory />);

        const exportButton = screen.getByRole('button', { name: /export/i });
        fireEvent.click(exportButton);

        expect(screen.getByText(/export format/i)).toBeInTheDocument();
    });

    it('should show refresh button and refresh transactions when clicked', () => {
        const mockRefresh = jest.fn();
        const mockUseTransactions =
            require('@/hooks/useTransactions').useTransactions;
        mockUseTransactions.mockReturnValue({
            transactions: [
                {
                    id: '1',
                    type: 'send',
                    amount: 100,
                    currency: 'USD',
                    recipient: 'Jane Smith',
                    status: 'completed',
                    timestamp: '2024-01-15T10:30:00Z',
                },
            ],
            isLoading: false,
            error: null,
            hasMore: false,
            loadMore: jest.fn(),
            refresh: mockRefresh,
        });

        render(<TransactionHistory />);

        const refreshButton = screen.getByRole('button', { name: /refresh/i });
        fireEvent.click(refreshButton);

        expect(mockRefresh).toHaveBeenCalled();
    });

    it('should display different icons for different transaction types', () => {
        render(<TransactionHistory />);

        expect(screen.getByTestId('send-icon')).toBeInTheDocument();
        expect(screen.getByTestId('receive-icon')).toBeInTheDocument();
        expect(screen.getByTestId('onramp-icon')).toBeInTheDocument();
        expect(screen.getByTestId('offramp-icon')).toBeInTheDocument();
    });

    it('should show pagination when there are many transactions', () => {
        const mockUseTransactions =
            require('@/hooks/useTransactions').useTransactions;
        mockUseTransactions.mockReturnValue({
            transactions: Array.from({ length: 20 }, (_, i) => ({
                id: `${i + 1}`,
                type: 'send',
                amount: 100,
                currency: 'USD',
                recipient: `User ${i + 1}`,
                status: 'completed',
                timestamp: '2024-01-15T10:30:00Z',
            })),
            isLoading: false,
            error: null,
            hasMore: true,
            loadMore: jest.fn(),
        });

        render(<TransactionHistory />);

        expect(screen.getByText(/page 1 of 2/i)).toBeInTheDocument();
        expect(
            screen.getByRole('button', { name: /next page/i })
        ).toBeInTheDocument();
    });
});
