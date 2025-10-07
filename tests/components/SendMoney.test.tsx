import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { useRouter } from 'next/router';
import SendMoney from '@/components/SendMoney';

// Mock Next.js router
jest.mock('next/router', () => ({
    useRouter: jest.fn(),
}));

// Mock transaction service
jest.mock('@/services/transaction.service', () => ({
    sendMoney: jest.fn(),
    validateRecipient: jest.fn(),
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

// Mock contacts hook
jest.mock('@/hooks/useContacts', () => ({
    useContacts: () => ({
        contacts: [
            {
                id: '1',
                name: 'Jane Smith',
                email: 'jane@example.com',
                phone: '+1234567890',
            },
            {
                id: '2',
                name: 'Bob Johnson',
                email: 'bob@example.com',
                phone: '+0987654321',
            },
        ],
        isLoading: false,
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
    pathname: '/send',
    query: {},
    asPath: '/send',
};

describe('SendMoney', () => {
    beforeEach(() => {
        jest.clearAllMocks();
        (useRouter as jest.Mock).mockReturnValue(mockRouter);
    });

    it('should render send money form', () => {
        render(<SendMoney />);

        expect(screen.getByText(/send money/i)).toBeInTheDocument();
        expect(screen.getByLabelText(/recipient/i)).toBeInTheDocument();
        expect(screen.getByLabelText(/amount/i)).toBeInTheDocument();
        expect(screen.getByLabelText(/memo/i)).toBeInTheDocument();
        expect(
            screen.getByRole('button', { name: /send/i })
        ).toBeInTheDocument();
    });

    it('should render recipient type selection', () => {
        render(<SendMoney />);

        expect(screen.getByText(/recipient type/i)).toBeInTheDocument();
        expect(
            screen.getByRole('radio', { name: /email/i })
        ).toBeInTheDocument();
        expect(
            screen.getByRole('radio', { name: /phone/i })
        ).toBeInTheDocument();
        expect(
            screen.getByRole('radio', { name: /wallet address/i })
        ).toBeInTheDocument();
    });

    it('should show validation errors for empty form submission', async () => {
        render(<SendMoney />);

        const sendButton = screen.getByRole('button', { name: /send/i });
        fireEvent.click(sendButton);

        await waitFor(() => {
            expect(
                screen.getByText(/recipient is required/i)
            ).toBeInTheDocument();
            expect(screen.getByText(/amount is required/i)).toBeInTheDocument();
        });
    });

    it('should show validation error for invalid email format', async () => {
        render(<SendMoney />);

        const emailRadio = screen.getByRole('radio', { name: /email/i });
        const recipientInput = screen.getByLabelText(/recipient/i);
        const amountInput = screen.getByLabelText(/amount/i);
        const sendButton = screen.getByRole('button', { name: /send/i });

        fireEvent.click(emailRadio);
        fireEvent.change(recipientInput, {
            target: { value: 'invalid-email' },
        });
        fireEvent.change(amountInput, { target: { value: '100' } });
        fireEvent.click(sendButton);

        await waitFor(() => {
            expect(
                screen.getByText(/invalid email format/i)
            ).toBeInTheDocument();
        });
    });

    it('should show validation error for invalid phone format', async () => {
        render(<SendMoney />);

        const phoneRadio = screen.getByRole('radio', { name: /phone/i });
        const recipientInput = screen.getByLabelText(/recipient/i);
        const amountInput = screen.getByLabelText(/amount/i);
        const sendButton = screen.getByRole('button', { name: /send/i });

        fireEvent.click(phoneRadio);
        fireEvent.change(recipientInput, { target: { value: '123' } });
        fireEvent.change(amountInput, { target: { value: '100' } });
        fireEvent.click(sendButton);

        await waitFor(() => {
            expect(
                screen.getByText(/invalid phone format/i)
            ).toBeInTheDocument();
        });
    });

    it('should show validation error for amount exceeding balance', async () => {
        render(<SendMoney />);

        const recipientInput = screen.getByLabelText(/recipient/i);
        const amountInput = screen.getByLabelText(/amount/i);
        const sendButton = screen.getByRole('button', { name: /send/i });

        fireEvent.change(recipientInput, {
            target: { value: 'jane@example.com' },
        });
        fireEvent.change(amountInput, { target: { value: '2000' } });
        fireEvent.click(sendButton);

        await waitFor(() => {
            expect(
                screen.getByText(/amount exceeds available balance/i)
            ).toBeInTheDocument();
        });
    });

    it('should show validation error for negative amount', async () => {
        render(<SendMoney />);

        const recipientInput = screen.getByLabelText(/recipient/i);
        const amountInput = screen.getByLabelText(/amount/i);
        const sendButton = screen.getByRole('button', { name: /send/i });

        fireEvent.change(recipientInput, {
            target: { value: 'jane@example.com' },
        });
        fireEvent.change(amountInput, { target: { value: '-100' } });
        fireEvent.click(sendButton);

        await waitFor(() => {
            expect(
                screen.getByText(/amount must be positive/i)
            ).toBeInTheDocument();
        });
    });

    it('should handle successful money send', async () => {
        const mockSendMoney =
            require('@/services/transaction.service').sendMoney;
        mockSendMoney.mockResolvedValue({
            success: true,
            transactionId: 'tx123',
        });

        render(<SendMoney />);

        const recipientInput = screen.getByLabelText(/recipient/i);
        const amountInput = screen.getByLabelText(/amount/i);
        const memoInput = screen.getByLabelText(/memo/i);
        const sendButton = screen.getByRole('button', { name: /send/i });

        fireEvent.change(recipientInput, {
            target: { value: 'jane@example.com' },
        });
        fireEvent.change(amountInput, { target: { value: '100' } });
        fireEvent.change(memoInput, { target: { value: 'Test payment' } });
        fireEvent.click(sendButton);

        await waitFor(() => {
            expect(mockSendMoney).toHaveBeenCalledWith({
                recipient: 'jane@example.com',
                amount: 100,
                currency: 'USD',
                memo: 'Test payment',
                type: 'email',
            });
            expect(
                screen.getByText(/money sent successfully/i)
            ).toBeInTheDocument();
        });
    });

    it('should handle send money failure and show error message', async () => {
        const mockSendMoney =
            require('@/services/transaction.service').sendMoney;
        mockSendMoney.mockResolvedValue({
            success: false,
            error: 'Insufficient funds',
        });

        render(<SendMoney />);

        const recipientInput = screen.getByLabelText(/recipient/i);
        const amountInput = screen.getByLabelText(/amount/i);
        const sendButton = screen.getByRole('button', { name: /send/i });

        fireEvent.change(recipientInput, {
            target: { value: 'jane@example.com' },
        });
        fireEvent.change(amountInput, { target: { value: '100' } });
        fireEvent.click(sendButton);

        await waitFor(() => {
            expect(screen.getByText(/insufficient funds/i)).toBeInTheDocument();
        });
    });

    it('should show loading state during transaction', async () => {
        const mockSendMoney =
            require('@/services/transaction.service').sendMoney;
        mockSendMoney.mockImplementation(
            () => new Promise(resolve => setTimeout(resolve, 1000))
        );

        render(<SendMoney />);

        const recipientInput = screen.getByLabelText(/recipient/i);
        const amountInput = screen.getByLabelText(/amount/i);
        const sendButton = screen.getByRole('button', { name: /send/i });

        fireEvent.change(recipientInput, {
            target: { value: 'jane@example.com' },
        });
        fireEvent.change(amountInput, { target: { value: '100' } });
        fireEvent.click(sendButton);

        expect(screen.getByText(/sending money/i)).toBeInTheDocument();
        expect(sendButton).toBeDisabled();
    });

    it('should display current balance', () => {
        render(<SendMoney />);

        expect(screen.getByText(/available balance/i)).toBeInTheDocument();
        expect(screen.getByText(/\$1,250.50/i)).toBeInTheDocument();
    });

    it('should show recipient suggestions from contacts', () => {
        render(<SendMoney />);

        const recipientInput = screen.getByLabelText(/recipient/i);
        fireEvent.focus(recipientInput);

        expect(screen.getByText(/jane smith/i)).toBeInTheDocument();
        expect(screen.getByText(/bob johnson/i)).toBeInTheDocument();
    });

    it('should select recipient from suggestions', () => {
        render(<SendMoney />);

        const recipientInput = screen.getByLabelText(/recipient/i);
        fireEvent.focus(recipientInput);

        const janeSuggestion = screen.getByText(/jane smith/i);
        fireEvent.click(janeSuggestion);

        expect(recipientInput).toHaveValue('jane@example.com');
    });

    it('should calculate and display fees', () => {
        render(<SendMoney />);

        const amountInput = screen.getByLabelText(/amount/i);
        fireEvent.change(amountInput, { target: { value: '100' } });

        expect(screen.getByText(/fee: \$2.50/i)).toBeInTheDocument();
        expect(screen.getByText(/total: \$102.50/i)).toBeInTheDocument();
    });

    it('should validate recipient before sending', async () => {
        const mockValidateRecipient =
            require('@/services/transaction.service').validateRecipient;
        mockValidateRecipient.mockResolvedValue({
            valid: false,
            error: 'Recipient not found',
        });

        render(<SendMoney />);

        const recipientInput = screen.getByLabelText(/recipient/i);
        const amountInput = screen.getByLabelText(/amount/i);
        const sendButton = screen.getByRole('button', { name: /send/i });

        fireEvent.change(recipientInput, {
            target: { value: 'unknown@example.com' },
        });
        fireEvent.change(amountInput, { target: { value: '100' } });
        fireEvent.click(sendButton);

        await waitFor(() => {
            expect(mockValidateRecipient).toHaveBeenCalledWith(
                'unknown@example.com',
                'email'
            );
            expect(
                screen.getByText(/recipient not found/i)
            ).toBeInTheDocument();
        });
    });

    it('should reset form after successful send', async () => {
        const mockSendMoney =
            require('@/services/transaction.service').sendMoney;
        mockSendMoney.mockResolvedValue({
            success: true,
            transactionId: 'tx123',
        });

        render(<SendMoney />);

        const recipientInput = screen.getByLabelText(/recipient/i);
        const amountInput = screen.getByLabelText(/amount/i);
        const memoInput = screen.getByLabelText(/memo/i);
        const sendButton = screen.getByRole('button', { name: /send/i });

        fireEvent.change(recipientInput, {
            target: { value: 'jane@example.com' },
        });
        fireEvent.change(amountInput, { target: { value: '100' } });
        fireEvent.change(memoInput, { target: { value: 'Test payment' } });
        fireEvent.click(sendButton);

        await waitFor(() => {
            expect(recipientInput).toHaveValue('');
            expect(amountInput).toHaveValue('');
            expect(memoInput).toHaveValue('');
        });
    });

    it('should navigate back to dashboard when cancel is clicked', () => {
        render(<SendMoney />);

        const cancelButton = screen.getByRole('button', { name: /cancel/i });
        fireEvent.click(cancelButton);

        expect(mockPush).toHaveBeenCalledWith('/dashboard');
    });
});
