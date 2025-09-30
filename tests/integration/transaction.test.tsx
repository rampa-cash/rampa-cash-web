import React from 'react'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { useRouter } from 'next/router'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import TransactionFlow from '@/pages/transactions/send'

// Mock Next.js router
jest.mock('next/router', () => ({
    useRouter: jest.fn(),
}))

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
}))

// Mock wallet hook
jest.mock('@/hooks/useWallet', () => ({
    useWallet: () => ({
        balance: {
            usd: 1250.50,
            sol: 5.25,
        },
        isLoading: false,
        refreshBalance: jest.fn(),
    }),
}))

// Mock transaction service
jest.mock('@/services/transaction.service', () => ({
    sendMoney: jest.fn(),
    validateRecipient: jest.fn(),
    getTransactionHistory: jest.fn(),
}))

// Mock contacts service
jest.mock('@/services/contact.service', () => ({
    getContacts: jest.fn(),
    addContact: jest.fn(),
}))

// Mock Solana service
jest.mock('@/services/solana.service', () => ({
    signTransaction: jest.fn(),
    sendTransaction: jest.fn(),
}))

// Mock i18n
jest.mock('next-i18next', () => ({
    useTranslation: () => ({
        t: (key: string) => key,
        i18n: {
            changeLanguage: jest.fn(),
        },
    }),
}))

const mockPush = jest.fn()
const mockRouter = {
    push: mockPush,
    pathname: '/send',
    query: {},
    asPath: '/send',
}

const createTestQueryClient = () => new QueryClient({
    defaultOptions: {
        queries: {
            retry: false,
        },
    },
})

const renderWithQueryClient = (component: React.ReactElement) => {
    const queryClient = createTestQueryClient()
    return render(
        <QueryClientProvider client={queryClient}>
            {component}
        </QueryClientProvider>
    )
}

describe('Transaction Flow Integration', () => {
    beforeEach(() => {
        jest.clearAllMocks()
            ; (useRouter as jest.Mock).mockReturnValue(mockRouter)
    })

    it('should complete full transaction flow from send to confirmation', async () => {
        const mockSendMoney = require('@/services/transaction.service').sendMoney
        const mockValidateRecipient = require('@/services/transaction.service').validateRecipient
        const mockSignTransaction = require('@/services/solana.service').signTransaction
        const mockSendTransaction = require('@/services/solana.service').sendTransaction

        mockValidateRecipient.mockResolvedValue({ valid: true, recipient: { name: 'Jane Smith' } })
        mockSendMoney.mockResolvedValue({
            success: true,
            transactionId: 'tx123',
            transaction: {
                id: 'tx123',
                amount: 100,
                currency: 'USD',
                recipient: 'jane@example.com',
                status: 'pending',
                fee: 2.50,
                total: 102.50,
            }
        })
        mockSignTransaction.mockResolvedValue({ success: true, signedTransaction: 'signed_tx_data' })
        mockSendTransaction.mockResolvedValue({ success: true, signature: 'tx_signature' })

        renderWithQueryClient(<TransactionFlow />)

        // Step 1: Fill transaction form
        const recipientInput = screen.getByLabelText(/recipient/i)
        const amountInput = screen.getByLabelText(/amount/i)
        const memoInput = screen.getByLabelText(/memo/i)
        const sendButton = screen.getByRole('button', { name: /send/i })

        fireEvent.change(recipientInput, { target: { value: 'jane@example.com' } })
        fireEvent.change(amountInput, { target: { value: '100' } })
        fireEvent.change(memoInput, { target: { value: 'Test payment' } })
        fireEvent.click(sendButton)

        await waitFor(() => {
            expect(mockValidateRecipient).toHaveBeenCalledWith('jane@example.com', 'email')
        })

        // Step 2: Transaction confirmation screen should appear
        await waitFor(() => {
            expect(screen.getByText(/confirm transaction/i)).toBeInTheDocument()
            expect(screen.getByText(/recipient: jane smith/i)).toBeInTheDocument()
            expect(screen.getByText(/amount: \$100.00/i)).toBeInTheDocument()
            expect(screen.getByText(/fee: \$2.50/i)).toBeInTheDocument()
            expect(screen.getByText(/total: \$102.50/i)).toBeInTheDocument()
        })

        // Step 3: Confirm transaction
        const confirmButton = screen.getByRole('button', { name: /confirm and send/i })
        fireEvent.click(confirmButton)

        await waitFor(() => {
            expect(mockSignTransaction).toHaveBeenCalled()
            expect(mockSendTransaction).toHaveBeenCalled()
        })

        // Step 4: Transaction success screen
        await waitFor(() => {
            expect(screen.getByText(/transaction sent successfully/i)).toBeInTheDocument()
            expect(screen.getByText(/transaction id: tx123/i)).toBeInTheDocument()
        })

        // Step 5: Should redirect to dashboard
        await waitFor(() => {
            expect(mockPush).toHaveBeenCalledWith('/dashboard')
        })
    })

    it('should handle transaction with contact selection', async () => {
        const mockGetContacts = require('@/services/contact.service').getContacts
        const mockSendMoney = require('@/services/transaction.service').sendMoney
        const mockValidateRecipient = require('@/services/transaction.service').validateRecipient

        mockGetContacts.mockResolvedValue({
            contacts: [
                { id: '1', name: 'Jane Smith', email: 'jane@example.com' },
                { id: '2', name: 'Bob Johnson', email: 'bob@example.com' },
            ]
        })
        mockValidateRecipient.mockResolvedValue({ valid: true, recipient: { name: 'Jane Smith' } })
        mockSendMoney.mockResolvedValue({ success: true, transactionId: 'tx123' })

        renderWithQueryClient(<TransactionFlow />)

        // Click on contact suggestion
        const recipientInput = screen.getByLabelText(/recipient/i)
        fireEvent.focus(recipientInput)

        await waitFor(() => {
            expect(screen.getByText(/jane smith/i)).toBeInTheDocument()
        })

        const janeContact = screen.getByText(/jane smith/i)
        fireEvent.click(janeContact)

        expect(recipientInput).toHaveValue('jane@example.com')

        // Complete transaction
        const amountInput = screen.getByLabelText(/amount/i)
        const sendButton = screen.getByRole('button', { name: /send/i })

        fireEvent.change(amountInput, { target: { value: '100' } })
        fireEvent.click(sendButton)

        await waitFor(() => {
            expect(mockSendMoney).toHaveBeenCalledWith({
                recipient: 'jane@example.com',
                amount: 100,
                currency: 'USD',
                memo: '',
                type: 'email',
            })
        })
    })

    it('should handle transaction failure and show error', async () => {
        const mockSendMoney = require('@/services/transaction.service').sendMoney
        const mockValidateRecipient = require('@/services/transaction.service').validateRecipient

        mockValidateRecipient.mockResolvedValue({ valid: true, recipient: { name: 'Jane Smith' } })
        mockSendMoney.mockResolvedValue({ success: false, error: 'Insufficient funds' })

        renderWithQueryClient(<TransactionFlow />)

        const recipientInput = screen.getByLabelText(/recipient/i)
        const amountInput = screen.getByLabelText(/amount/i)
        const sendButton = screen.getByRole('button', { name: /send/i })

        fireEvent.change(recipientInput, { target: { value: 'jane@example.com' } })
        fireEvent.change(amountInput, { target: { value: '2000' } })
        fireEvent.click(sendButton)

        await waitFor(() => {
            expect(screen.getByText(/insufficient funds/i)).toBeInTheDocument()
        })
    })

    it('should handle recipient validation failure', async () => {
        const mockValidateRecipient = require('@/services/transaction.service').validateRecipient

        mockValidateRecipient.mockResolvedValue({ valid: false, error: 'Recipient not found' })

        renderWithQueryClient(<TransactionFlow />)

        const recipientInput = screen.getByLabelText(/recipient/i)
        const amountInput = screen.getByLabelText(/amount/i)
        const sendButton = screen.getByRole('button', { name: /send/i })

        fireEvent.change(recipientInput, { target: { value: 'unknown@example.com' } })
        fireEvent.change(amountInput, { target: { value: '100' } })
        fireEvent.click(sendButton)

        await waitFor(() => {
            expect(screen.getByText(/recipient not found/i)).toBeInTheDocument()
        })
    })

    it('should handle Solana transaction signing failure', async () => {
        const mockSendMoney = require('@/services/transaction.service').sendMoney
        const mockValidateRecipient = require('@/services/transaction.service').validateRecipient
        const mockSignTransaction = require('@/services/solana.service').signTransaction

        mockValidateRecipient.mockResolvedValue({ valid: true, recipient: { name: 'Jane Smith' } })
        mockSendMoney.mockResolvedValue({
            success: true,
            transactionId: 'tx123',
            transaction: {
                id: 'tx123',
                amount: 100,
                currency: 'USD',
                recipient: 'jane@example.com',
                status: 'pending',
                fee: 2.50,
                total: 102.50,
            }
        })
        mockSignTransaction.mockResolvedValue({ success: false, error: 'User rejected transaction' })

        renderWithQueryClient(<TransactionFlow />)

        const recipientInput = screen.getByLabelText(/recipient/i)
        const amountInput = screen.getByLabelText(/amount/i)
        const sendButton = screen.getByRole('button', { name: /send/i })

        fireEvent.change(recipientInput, { target: { value: 'jane@example.com' } })
        fireEvent.change(amountInput, { target: { value: '100' } })
        fireEvent.click(sendButton)

        await waitFor(() => {
            expect(screen.getByText(/confirm transaction/i)).toBeInTheDocument()
        })

        const confirmButton = screen.getByRole('button', { name: /confirm and send/i })
        fireEvent.click(confirmButton)

        await waitFor(() => {
            expect(screen.getByText(/user rejected transaction/i)).toBeInTheDocument()
        })
    })

    it('should show loading state during transaction processing', async () => {
        const mockSendMoney = require('@/services/transaction.service').sendMoney
        const mockValidateRecipient = require('@/services/transaction.service').validateRecipient

        mockValidateRecipient.mockResolvedValue({ valid: true, recipient: { name: 'Jane Smith' } })
        mockSendMoney.mockImplementation(() => new Promise(resolve => setTimeout(resolve, 1000)))

        renderWithQueryClient(<TransactionFlow />)

        const recipientInput = screen.getByLabelText(/recipient/i)
        const amountInput = screen.getByLabelText(/amount/i)
        const sendButton = screen.getByRole('button', { name: /send/i })

        fireEvent.change(recipientInput, { target: { value: 'jane@example.com' } })
        fireEvent.change(amountInput, { target: { value: '100' } })
        fireEvent.click(sendButton)

        expect(screen.getByText(/processing transaction/i)).toBeInTheDocument()
        expect(sendButton).toBeDisabled()
    })

    it('should calculate and display fees correctly', () => {
        renderWithQueryClient(<TransactionFlow />)

        const amountInput = screen.getByLabelText(/amount/i)
        fireEvent.change(amountInput, { target: { value: '100' } })

        expect(screen.getByText(/fee: \$2.50/i)).toBeInTheDocument()
        expect(screen.getByText(/total: \$102.50/i)).toBeInTheDocument()
    })

    it('should show balance validation', () => {
        renderWithQueryClient(<TransactionFlow />)

        const amountInput = screen.getByLabelText(/amount/i)
        fireEvent.change(amountInput, { target: { value: '2000' } })

        expect(screen.getByText(/amount exceeds available balance/i)).toBeInTheDocument()
    })

    it('should handle different currency types', () => {
        renderWithQueryClient(<TransactionFlow />)

        const currencySelect = screen.getByLabelText(/currency/i)
        fireEvent.change(currencySelect, { target: { value: 'SOL' } })

        const amountInput = screen.getByLabelText(/amount/i)
        fireEvent.change(amountInput, { target: { value: '1' } })

        expect(screen.getByText(/fee: 0.01 sol/i)).toBeInTheDocument()
        expect(screen.getByText(/total: 1.01 sol/i)).toBeInTheDocument()
    })

    it('should save transaction to contact when option is selected', async () => {
        const mockSendMoney = require('@/services/transaction.service').sendMoney
        const mockValidateRecipient = require('@/services/transaction.service').validateRecipient
        const mockAddContact = require('@/services/contact.service').addContact

        mockValidateRecipient.mockResolvedValue({ valid: true, recipient: { name: 'Jane Smith' } })
        mockSendMoney.mockResolvedValue({ success: true, transactionId: 'tx123' })
        mockAddContact.mockResolvedValue({ success: true })

        renderWithQueryClient(<TransactionFlow />)

        const recipientInput = screen.getByLabelText(/recipient/i)
        const amountInput = screen.getByLabelText(/amount/i)
        const saveToContactsCheckbox = screen.getByLabelText(/save to contacts/i)
        const sendButton = screen.getByRole('button', { name: /send/i })

        fireEvent.change(recipientInput, { target: { value: 'jane@example.com' } })
        fireEvent.change(amountInput, { target: { value: '100' } })
        fireEvent.click(saveToContactsCheckbox)
        fireEvent.click(sendButton)

        await waitFor(() => {
            expect(mockAddContact).toHaveBeenCalledWith({
                name: 'Jane Smith',
                email: 'jane@example.com',
                phone: '',
            })
        })
    })

    it('should show transaction history after successful transaction', async () => {
        const mockSendMoney = require('@/services/transaction.service').sendMoney
        const mockValidateRecipient = require('@/services/transaction.service').validateRecipient
        const mockGetTransactionHistory = require('@/services/transaction.service').getTransactionHistory

        mockValidateRecipient.mockResolvedValue({ valid: true, recipient: { name: 'Jane Smith' } })
        mockSendMoney.mockResolvedValue({ success: true, transactionId: 'tx123' })
        mockGetTransactionHistory.mockResolvedValue({
            transactions: [
                {
                    id: 'tx123',
                    type: 'send',
                    amount: 100,
                    currency: 'USD',
                    recipient: 'jane@example.com',
                    status: 'completed',
                    timestamp: '2024-01-15T10:30:00Z',
                }
            ]
        })

        renderWithQueryClient(<TransactionFlow />)

        const recipientInput = screen.getByLabelText(/recipient/i)
        const amountInput = screen.getByLabelText(/amount/i)
        const sendButton = screen.getByRole('button', { name: /send/i })

        fireEvent.change(recipientInput, { target: { value: 'jane@example.com' } })
        fireEvent.change(amountInput, { target: { value: '100' } })
        fireEvent.click(sendButton)

        await waitFor(() => {
            expect(screen.getByText(/transaction sent successfully/i)).toBeInTheDocument()
        })

        const viewHistoryButton = screen.getByRole('button', { name: /view transaction history/i })
        fireEvent.click(viewHistoryButton)

        expect(mockPush).toHaveBeenCalledWith('/transactions')
    })

    it('should handle network error during transaction', async () => {
        const mockSendMoney = require('@/services/transaction.service').sendMoney
        const mockValidateRecipient = require('@/services/transaction.service').validateRecipient

        mockValidateRecipient.mockResolvedValue({ valid: true, recipient: { name: 'Jane Smith' } })
        mockSendMoney.mockRejectedValue(new Error('Network error'))

        renderWithQueryClient(<TransactionFlow />)

        const recipientInput = screen.getByLabelText(/recipient/i)
        const amountInput = screen.getByLabelText(/amount/i)
        const sendButton = screen.getByRole('button', { name: /send/i })

        fireEvent.change(recipientInput, { target: { value: 'jane@example.com' } })
        fireEvent.change(amountInput, { target: { value: '100' } })
        fireEvent.click(sendButton)

        await waitFor(() => {
            expect(screen.getByText(/network error. please try again/i)).toBeInTheDocument()
        })
    })

    it('should cancel transaction and return to dashboard', () => {
        renderWithQueryClient(<TransactionFlow />)

        const cancelButton = screen.getByRole('button', { name: /cancel/i })
        fireEvent.click(cancelButton)

        expect(mockPush).toHaveBeenCalledWith('/dashboard')
    })
})
