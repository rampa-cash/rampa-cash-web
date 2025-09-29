import React from 'react'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { useRouter } from 'next/router'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import RegistrationFlow from '@/pages/auth/signup'

// Mock Next.js router
jest.mock('next/router', () => ({
    useRouter: jest.fn(),
}))

// Mock authentication service
jest.mock('@/services/auth.service', () => ({
    signup: jest.fn(),
    verifyEmail: jest.fn(),
    resendVerification: jest.fn(),
}))

// Mock Web3Auth
jest.mock('@/lib/web3auth', () => ({
    login: jest.fn(),
    logout: jest.fn(),
    getUser: jest.fn(),
    isAuthenticated: jest.fn(),
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
    pathname: '/signup',
    query: {},
    asPath: '/signup',
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

describe('User Registration Flow Integration', () => {
    beforeEach(() => {
        jest.clearAllMocks()
            ; (useRouter as jest.Mock).mockReturnValue(mockRouter)
    })

    it('should complete full registration flow with email verification', async () => {
        const mockSignup = require('@/services/auth.service').signup
        const mockVerifyEmail = require('@/services/auth.service').verifyEmail

        mockSignup.mockResolvedValue({
            success: true,
            user: { id: '123', email: 'test@example.com' },
            requiresVerification: true
        })
        mockVerifyEmail.mockResolvedValue({ success: true })

        renderWithQueryClient(<RegistrationFlow />)

        // Step 1: Fill registration form
        const firstNameInput = screen.getByLabelText(/first name/i)
        const lastNameInput = screen.getByLabelText(/last name/i)
        const emailInput = screen.getByLabelText(/email/i)
        const passwordInput = screen.getByLabelText(/password/i)
        const confirmPasswordInput = screen.getByLabelText(/confirm password/i)
        const termsCheckbox = screen.getByLabelText(/terms and conditions/i)
        const signupButton = screen.getByRole('button', { name: /create account/i })

        fireEvent.change(firstNameInput, { target: { value: 'John' } })
        fireEvent.change(lastNameInput, { target: { value: 'Doe' } })
        fireEvent.change(emailInput, { target: { value: 'test@example.com' } })
        fireEvent.change(passwordInput, { target: { value: 'password123' } })
        fireEvent.change(confirmPasswordInput, { target: { value: 'password123' } })
        fireEvent.click(termsCheckbox)
        fireEvent.click(signupButton)

        await waitFor(() => {
            expect(mockSignup).toHaveBeenCalledWith({
                firstName: 'John',
                lastName: 'Doe',
                email: 'test@example.com',
                password: 'password123',
                confirmPassword: 'password123',
                acceptTerms: true,
            })
        })

        // Step 2: Email verification screen should appear
        await waitFor(() => {
            expect(screen.getByText(/verify your email/i)).toBeInTheDocument()
            expect(screen.getByText(/we sent a verification link to test@example.com/i)).toBeInTheDocument()
        })

        // Step 3: Simulate email verification
        const verifyButton = screen.getByRole('button', { name: /verify email/i })
        fireEvent.click(verifyButton)

        await waitFor(() => {
            expect(mockVerifyEmail).toHaveBeenCalled()
            expect(screen.getByText(/email verified successfully/i)).toBeInTheDocument()
        })

        // Step 4: Should redirect to dashboard
        await waitFor(() => {
            expect(mockPush).toHaveBeenCalledWith('/dashboard')
        })
    })

    it('should handle registration with Web3Auth wallet connection', async () => {
        const mockWeb3AuthLogin = require('@/lib/web3auth').login
        mockWeb3AuthLogin.mockResolvedValue({
            success: true,
            user: {
                id: 'wallet123',
                email: 'wallet@example.com',
                firstName: 'Wallet',
                lastName: 'User'
            }
        })

        renderWithQueryClient(<RegistrationFlow />)

        const walletButton = screen.getByRole('button', { name: /connect wallet/i })
        fireEvent.click(walletButton)

        await waitFor(() => {
            expect(mockWeb3AuthLogin).toHaveBeenCalled()
            expect(screen.getByText(/wallet connected successfully/i)).toBeInTheDocument()
        })

        await waitFor(() => {
            expect(mockPush).toHaveBeenCalledWith('/dashboard')
        })
    })

    it('should show validation errors for invalid registration data', async () => {
        renderWithQueryClient(<RegistrationFlow />)

        const signupButton = screen.getByRole('button', { name: /create account/i })
        fireEvent.click(signupButton)

        await waitFor(() => {
            expect(screen.getByText(/first name is required/i)).toBeInTheDocument()
            expect(screen.getByText(/last name is required/i)).toBeInTheDocument()
            expect(screen.getByText(/email is required/i)).toBeInTheDocument()
            expect(screen.getByText(/password is required/i)).toBeInTheDocument()
            expect(screen.getByText(/you must accept the terms and conditions/i)).toBeInTheDocument()
        })
    })

    it('should show validation error for password mismatch', async () => {
        renderWithQueryClient(<RegistrationFlow />)

        const passwordInput = screen.getByLabelText(/password/i)
        const confirmPasswordInput = screen.getByLabelText(/confirm password/i)
        const termsCheckbox = screen.getByLabelText(/terms and conditions/i)
        const signupButton = screen.getByRole('button', { name: /create account/i })

        fireEvent.change(passwordInput, { target: { value: 'password123' } })
        fireEvent.change(confirmPasswordInput, { target: { value: 'different123' } })
        fireEvent.click(termsCheckbox)
        fireEvent.click(signupButton)

        await waitFor(() => {
            expect(screen.getByText(/passwords do not match/i)).toBeInTheDocument()
        })
    })

    it('should show validation error for weak password', async () => {
        renderWithQueryClient(<RegistrationFlow />)

        const passwordInput = screen.getByLabelText(/password/i)
        const confirmPasswordInput = screen.getByLabelText(/confirm password/i)
        const termsCheckbox = screen.getByLabelText(/terms and conditions/i)
        const signupButton = screen.getByRole('button', { name: /create account/i })

        fireEvent.change(passwordInput, { target: { value: '123' } })
        fireEvent.change(confirmPasswordInput, { target: { value: '123' } })
        fireEvent.click(termsCheckbox)
        fireEvent.click(signupButton)

        await waitFor(() => {
            expect(screen.getByText(/password must be at least 8 characters/i)).toBeInTheDocument()
        })
    })

    it('should handle registration failure and show error message', async () => {
        const mockSignup = require('@/services/auth.service').signup
        mockSignup.mockResolvedValue({
            success: false,
            error: 'Email already exists'
        })

        renderWithQueryClient(<RegistrationFlow />)

        const firstNameInput = screen.getByLabelText(/first name/i)
        const lastNameInput = screen.getByLabelText(/last name/i)
        const emailInput = screen.getByLabelText(/email/i)
        const passwordInput = screen.getByLabelText(/password/i)
        const confirmPasswordInput = screen.getByLabelText(/confirm password/i)
        const termsCheckbox = screen.getByLabelText(/terms and conditions/i)
        const signupButton = screen.getByRole('button', { name: /create account/i })

        fireEvent.change(firstNameInput, { target: { value: 'John' } })
        fireEvent.change(lastNameInput, { target: { value: 'Doe' } })
        fireEvent.change(emailInput, { target: { value: 'existing@example.com' } })
        fireEvent.change(passwordInput, { target: { value: 'password123' } })
        fireEvent.change(confirmPasswordInput, { target: { value: 'password123' } })
        fireEvent.click(termsCheckbox)
        fireEvent.click(signupButton)

        await waitFor(() => {
            expect(screen.getByText(/email already exists/i)).toBeInTheDocument()
        })
    })

    it('should handle email verification failure', async () => {
        const mockSignup = require('@/services/auth.service').signup
        const mockVerifyEmail = require('@/services/auth.service').verifyEmail

        mockSignup.mockResolvedValue({
            success: true,
            user: { id: '123', email: 'test@example.com' },
            requiresVerification: true
        })
        mockVerifyEmail.mockResolvedValue({ success: false, error: 'Invalid verification code' })

        renderWithQueryClient(<RegistrationFlow />)

        // Complete registration
        const firstNameInput = screen.getByLabelText(/first name/i)
        const lastNameInput = screen.getByLabelText(/last name/i)
        const emailInput = screen.getByLabelText(/email/i)
        const passwordInput = screen.getByLabelText(/password/i)
        const confirmPasswordInput = screen.getByLabelText(/confirm password/i)
        const termsCheckbox = screen.getByLabelText(/terms and conditions/i)
        const signupButton = screen.getByRole('button', { name: /create account/i })

        fireEvent.change(firstNameInput, { target: { value: 'John' } })
        fireEvent.change(lastNameInput, { target: { value: 'Doe' } })
        fireEvent.change(emailInput, { target: { value: 'test@example.com' } })
        fireEvent.change(passwordInput, { target: { value: 'password123' } })
        fireEvent.change(confirmPasswordInput, { target: { value: 'password123' } })
        fireEvent.click(termsCheckbox)
        fireEvent.click(signupButton)

        await waitFor(() => {
            expect(screen.getByText(/verify your email/i)).toBeInTheDocument()
        })

        // Try to verify email
        const verifyButton = screen.getByRole('button', { name: /verify email/i })
        fireEvent.click(verifyButton)

        await waitFor(() => {
            expect(screen.getByText(/invalid verification code/i)).toBeInTheDocument()
        })
    })

    it('should resend verification email when resend button is clicked', async () => {
        const mockSignup = require('@/services/auth.service').signup
        const mockResendVerification = require('@/services/auth.service').resendVerification

        mockSignup.mockResolvedValue({
            success: true,
            user: { id: '123', email: 'test@example.com' },
            requiresVerification: true
        })
        mockResendVerification.mockResolvedValue({ success: true })

        renderWithQueryClient(<RegistrationFlow />)

        // Complete registration
        const firstNameInput = screen.getByLabelText(/first name/i)
        const lastNameInput = screen.getByLabelText(/last name/i)
        const emailInput = screen.getByLabelText(/email/i)
        const passwordInput = screen.getByLabelText(/password/i)
        const confirmPasswordInput = screen.getByLabelText(/confirm password/i)
        const termsCheckbox = screen.getByLabelText(/terms and conditions/i)
        const signupButton = screen.getByRole('button', { name: /create account/i })

        fireEvent.change(firstNameInput, { target: { value: 'John' } })
        fireEvent.change(lastNameInput, { target: { value: 'Doe' } })
        fireEvent.change(emailInput, { target: { value: 'test@example.com' } })
        fireEvent.change(passwordInput, { target: { value: 'password123' } })
        fireEvent.change(confirmPasswordInput, { target: { value: 'password123' } })
        fireEvent.click(termsCheckbox)
        fireEvent.click(signupButton)

        await waitFor(() => {
            expect(screen.getByText(/verify your email/i)).toBeInTheDocument()
        })

        // Click resend button
        const resendButton = screen.getByRole('button', { name: /resend verification/i })
        fireEvent.click(resendButton)

        await waitFor(() => {
            expect(mockResendVerification).toHaveBeenCalledWith('test@example.com')
            expect(screen.getByText(/verification email sent/i)).toBeInTheDocument()
        })
    })

    it('should show loading state during registration', async () => {
        const mockSignup = require('@/services/auth.service').signup
        mockSignup.mockImplementation(() => new Promise(resolve => setTimeout(resolve, 1000)))

        renderWithQueryClient(<RegistrationFlow />)

        const firstNameInput = screen.getByLabelText(/first name/i)
        const lastNameInput = screen.getByLabelText(/last name/i)
        const emailInput = screen.getByLabelText(/email/i)
        const passwordInput = screen.getByLabelText(/password/i)
        const confirmPasswordInput = screen.getByLabelText(/confirm password/i)
        const termsCheckbox = screen.getByLabelText(/terms and conditions/i)
        const signupButton = screen.getByRole('button', { name: /create account/i })

        fireEvent.change(firstNameInput, { target: { value: 'John' } })
        fireEvent.change(lastNameInput, { target: { value: 'Doe' } })
        fireEvent.change(emailInput, { target: { value: 'test@example.com' } })
        fireEvent.change(passwordInput, { target: { value: 'password123' } })
        fireEvent.change(confirmPasswordInput, { target: { value: 'password123' } })
        fireEvent.click(termsCheckbox)
        fireEvent.click(signupButton)

        expect(screen.getByText(/creating account/i)).toBeInTheDocument()
        expect(signupButton).toBeDisabled()
    })

    it('should navigate to login page when login link is clicked', () => {
        renderWithQueryClient(<RegistrationFlow />)

        const loginLink = screen.getByText(/already have an account/i)
        fireEvent.click(loginLink)

        expect(mockPush).toHaveBeenCalledWith('/login')
    })

    it('should show terms and conditions modal when terms link is clicked', () => {
        renderWithQueryClient(<RegistrationFlow />)

        const termsLink = screen.getByText(/terms and conditions/i)
        fireEvent.click(termsLink)

        expect(screen.getByText(/terms of service/i)).toBeInTheDocument()
        expect(screen.getByText(/privacy policy/i)).toBeInTheDocument()
    })

    it('should handle network error during registration', async () => {
        const mockSignup = require('@/services/auth.service').signup
        mockSignup.mockRejectedValue(new Error('Network error'))

        renderWithQueryClient(<RegistrationFlow />)

        const firstNameInput = screen.getByLabelText(/first name/i)
        const lastNameInput = screen.getByLabelText(/last name/i)
        const emailInput = screen.getByLabelText(/email/i)
        const passwordInput = screen.getByLabelText(/password/i)
        const confirmPasswordInput = screen.getByLabelText(/confirm password/i)
        const termsCheckbox = screen.getByLabelText(/terms and conditions/i)
        const signupButton = screen.getByRole('button', { name: /create account/i })

        fireEvent.change(firstNameInput, { target: { value: 'John' } })
        fireEvent.change(lastNameInput, { target: { value: 'Doe' } })
        fireEvent.change(emailInput, { target: { value: 'test@example.com' } })
        fireEvent.change(passwordInput, { target: { value: 'password123' } })
        fireEvent.change(confirmPasswordInput, { target: { value: 'password123' } })
        fireEvent.click(termsCheckbox)
        fireEvent.click(signupButton)

        await waitFor(() => {
            expect(screen.getByText(/network error. please try again/i)).toBeInTheDocument()
        })
    })
})
