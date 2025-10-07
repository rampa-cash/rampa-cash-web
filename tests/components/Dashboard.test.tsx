import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { useRouter } from 'next/router';
import Dashboard from '@/pages/dashboard';

// Mock Next.js router
jest.mock('next/router', () => ({
    useRouter: jest.fn(),
}));

// Mock authentication hook
jest.mock('@/hooks/useAuth', () => ({
    useAuth: () => ({
        user: {
            id: '123',
            email: 'test@example.com',
            firstName: 'John',
            lastName: 'Doe',
        },
        isAuthenticated: true,
        logout: jest.fn(),
    }),
}));

// Mock wallet hook
jest.mock('@/hooks/useWallet', () => ({
    useWallet: () => ({
        balance: {
            usd: 1250.5,
            sol: 5.25,
        },
        isLoading: false,
        refreshBalance: jest.fn(),
    }),
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
            },
            {
                id: '2',
                type: 'receive',
                amount: 250.0,
                currency: 'USD',
                sender: 'Bob Johnson',
                status: 'completed',
                timestamp: '2024-01-14T15:45:00Z',
            },
        ],
        isLoading: false,
        error: null,
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
    pathname: '/dashboard',
    query: {},
    asPath: '/dashboard',
};

describe('Dashboard', () => {
    beforeEach(() => {
        jest.clearAllMocks();
        (useRouter as jest.Mock).mockReturnValue(mockRouter);
    });

    it('should render user welcome message', () => {
        render(<Dashboard />);

        expect(screen.getByText(/welcome, john/i)).toBeInTheDocument();
    });

    it('should render wallet balance', () => {
        render(<Dashboard />);

        expect(screen.getByText(/\$1,250.50/i)).toBeInTheDocument();
        expect(screen.getByText(/5.25 sol/i)).toBeInTheDocument();
    });

    it('should render quick action buttons', () => {
        render(<Dashboard />);

        expect(
            screen.getByRole('button', { name: /send money/i })
        ).toBeInTheDocument();
        expect(
            screen.getByRole('button', { name: /receive money/i })
        ).toBeInTheDocument();
        expect(
            screen.getByRole('button', { name: /add money/i })
        ).toBeInTheDocument();
        expect(
            screen.getByRole('button', { name: /cash out/i })
        ).toBeInTheDocument();
    });

    it('should render recent transactions', () => {
        render(<Dashboard />);

        expect(screen.getByText(/recent transactions/i)).toBeInTheDocument();
        expect(screen.getByText(/jane smith/i)).toBeInTheDocument();
        expect(screen.getByText(/bob johnson/i)).toBeInTheDocument();
    });

    it('should navigate to send money page when send button is clicked', () => {
        render(<Dashboard />);

        const sendButton = screen.getByRole('button', { name: /send money/i });
        fireEvent.click(sendButton);

        expect(mockPush).toHaveBeenCalledWith('/send');
    });

    it('should navigate to receive money page when receive button is clicked', () => {
        render(<Dashboard />);

        const receiveButton = screen.getByRole('button', {
            name: /receive money/i,
        });
        fireEvent.click(receiveButton);

        expect(mockPush).toHaveBeenCalledWith('/receive');
    });

    it('should navigate to add money page when add money button is clicked', () => {
        render(<Dashboard />);

        const addMoneyButton = screen.getByRole('button', {
            name: /add money/i,
        });
        fireEvent.click(addMoneyButton);

        expect(mockPush).toHaveBeenCalledWith('/onramp');
    });

    it('should navigate to cash out page when cash out button is clicked', () => {
        render(<Dashboard />);

        const cashOutButton = screen.getByRole('button', { name: /cash out/i });
        fireEvent.click(cashOutButton);

        expect(mockPush).toHaveBeenCalledWith('/offramp');
    });

    it('should show loading state when wallet balance is loading', () => {
        const mockUseWallet = require('@/hooks/useWallet').useWallet;
        mockUseWallet.mockReturnValue({
            balance: null,
            isLoading: true,
            refreshBalance: jest.fn(),
        });

        render(<Dashboard />);

        expect(screen.getByText(/loading balance/i)).toBeInTheDocument();
    });

    it('should show loading state when transactions are loading', () => {
        const mockUseTransactions =
            require('@/hooks/useTransactions').useTransactions;
        mockUseTransactions.mockReturnValue({
            transactions: [],
            isLoading: true,
            error: null,
        });

        render(<Dashboard />);

        expect(screen.getByText(/loading transactions/i)).toBeInTheDocument();
    });

    it('should display transaction amounts correctly', () => {
        render(<Dashboard />);

        expect(screen.getByText(/-\$100.00/i)).toBeInTheDocument();
        expect(screen.getByText(/\+\$250.00/i)).toBeInTheDocument();
    });

    it('should display transaction status badges', () => {
        render(<Dashboard />);

        const statusBadges = screen.getAllByText(/completed/i);
        expect(statusBadges).toHaveLength(2);
    });

    it('should render view all transactions link', () => {
        render(<Dashboard />);

        const viewAllLink = screen.getByText(/view all transactions/i);
        expect(viewAllLink).toBeInTheDocument();
        expect(viewAllLink.closest('a')).toHaveAttribute(
            'href',
            '/transactions'
        );
    });

    it('should render VISA card section if user has a card', () => {
        const mockUseWallet = require('@/hooks/useWallet').useWallet;
        mockUseWallet.mockReturnValue({
            balance: { usd: 1250.5, sol: 5.25 },
            isLoading: false,
            refreshBalance: jest.fn(),
            visaCard: {
                id: 'card123',
                lastFour: '1234',
                status: 'active',
            },
        });

        render(<Dashboard />);

        expect(screen.getByText(/visa card/i)).toBeInTheDocument();
        expect(screen.getByText(/•••• 1234/i)).toBeInTheDocument();
    });

    it('should render get VISA card button if user does not have a card', () => {
        render(<Dashboard />);

        expect(
            screen.getByRole('button', { name: /get visa card/i })
        ).toBeInTheDocument();
    });

    it('should handle logout when logout button is clicked', async () => {
        const mockLogout = jest.fn();
        const mockUseAuth = require('@/hooks/useAuth').useAuth;
        mockUseAuth.mockReturnValue({
            user: { id: '123', email: 'test@example.com' },
            isAuthenticated: true,
            logout: mockLogout,
        });

        render(<Dashboard />);

        const logoutButton = screen.getByRole('button', { name: /logout/i });
        fireEvent.click(logoutButton);

        await waitFor(() => {
            expect(mockLogout).toHaveBeenCalled();
        });
    });

    it('should refresh balance when refresh button is clicked', async () => {
        const mockRefreshBalance = jest.fn();
        const mockUseWallet = require('@/hooks/useWallet').useWallet;
        mockUseWallet.mockReturnValue({
            balance: { usd: 1250.5, sol: 5.25 },
            isLoading: false,
            refreshBalance: mockRefreshBalance,
        });

        render(<Dashboard />);

        const refreshButton = screen.getByRole('button', { name: /refresh/i });
        fireEvent.click(refreshButton);

        expect(mockRefreshBalance).toHaveBeenCalled();
    });

    it('should show error message when wallet balance fails to load', () => {
        const mockUseWallet = require('@/hooks/useWallet').useWallet;
        mockUseWallet.mockReturnValue({
            balance: null,
            isLoading: false,
            refreshBalance: jest.fn(),
            error: 'Failed to load balance',
        });

        render(<Dashboard />);

        expect(screen.getByText(/failed to load balance/i)).toBeInTheDocument();
    });

    it('should show error message when transactions fail to load', () => {
        const mockUseTransactions =
            require('@/hooks/useTransactions').useTransactions;
        mockUseTransactions.mockReturnValue({
            transactions: [],
            isLoading: false,
            error: 'Failed to load transactions',
        });

        render(<Dashboard />);

        expect(
            screen.getByText(/failed to load transactions/i)
        ).toBeInTheDocument();
    });
});
