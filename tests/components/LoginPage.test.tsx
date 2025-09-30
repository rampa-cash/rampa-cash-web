import React from 'react'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { useRouter } from 'next/router'
import LoginPage from '@/pages/login'

// Mock Next.js router
jest.mock('next/router', () => ({
    useRouter: jest.fn(),
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
    pathname: '/login',
    query: {},
    asPath: '/login',
}

describe('LoginPage', () => {
    beforeEach(() => {
        jest.clearAllMocks()
            ; (useRouter as jest.Mock).mockReturnValue(mockRouter)
    })

    it('should render login form with email and password fields', () => {
        render(<LoginPage />)

        expect(screen.getByLabelText(/email/i)).toBeInTheDocument()
        expect(screen.getByLabelText(/password/i)).toBeInTheDocument()
        expect(screen.getByRole('button', { name: /sign in/i })).toBeInTheDocument()
    })

    it('should render Web3Auth login button', () => {
        render(<LoginPage />)

        expect(screen.getByRole('button', { name: /connect wallet/i })).toBeInTheDocument()
    })

    it('should render language switcher', () => {
        render(<LoginPage />)

        expect(screen.getByText(/language/i)).toBeInTheDocument()
        expect(screen.getByText(/english/i)).toBeInTheDocument()
        expect(screen.getByText(/spanish/i)).toBeInTheDocument()
    })

    it('should show validation errors for empty form submission', async () => {
        render(<LoginPage />)

        const submitButton = screen.getByRole('button', { name: /sign in/i })
        fireEvent.click(submitButton)

        await waitFor(() => {
            expect(screen.getByText(/email is required/i)).toBeInTheDocument()
            expect(screen.getByText(/password is required/i)).toBeInTheDocument()
        })
    })

    it('should show validation error for invalid email format', async () => {
        render(<LoginPage />)

        const emailInput = screen.getByLabelText(/email/i)
        const submitButton = screen.getByRole('button', { name: /sign in/i })

        fireEvent.change(emailInput, { target: { value: 'invalid-email' } })
        fireEvent.click(submitButton)

        await waitFor(() => {
            expect(screen.getByText(/invalid email format/i)).toBeInTheDocument()
        })
    })

    it('should show validation error for short password', async () => {
        render(<LoginPage />)

        const emailInput = screen.getByLabelText(/email/i)
        const passwordInput = screen.getByLabelText(/password/i)
        const submitButton = screen.getByRole('button', { name: /sign in/i })

        fireEvent.change(emailInput, { target: { value: 'test@example.com' } })
        fireEvent.change(passwordInput, { target: { value: '123' } })
        fireEvent.click(submitButton)

        await waitFor(() => {
            expect(screen.getByText(/password must be at least 8 characters/i)).toBeInTheDocument()
        })
    })

    it('should handle successful login and redirect to dashboard', async () => {
        const mockLogin = require('@/lib/web3auth').login
        mockLogin.mockResolvedValue({ success: true, user: { id: '123' } })

        render(<LoginPage />)

        const emailInput = screen.getByLabelText(/email/i)
        const passwordInput = screen.getByLabelText(/password/i)
        const submitButton = screen.getByRole('button', { name: /sign in/i })

        fireEvent.change(emailInput, { target: { value: 'test@example.com' } })
        fireEvent.change(passwordInput, { target: { value: 'password123' } })
        fireEvent.click(submitButton)

        await waitFor(() => {
            expect(mockLogin).toHaveBeenCalledWith({
                email: 'test@example.com',
                password: 'password123',
            })
            expect(mockPush).toHaveBeenCalledWith('/dashboard')
        })
    })

    it('should handle login failure and show error message', async () => {
        const mockLogin = require('@/lib/web3auth').login
        mockLogin.mockResolvedValue({ success: false, error: 'Invalid credentials' })

        render(<LoginPage />)

        const emailInput = screen.getByLabelText(/email/i)
        const passwordInput = screen.getByLabelText(/password/i)
        const submitButton = screen.getByRole('button', { name: /sign in/i })

        fireEvent.change(emailInput, { target: { value: 'test@example.com' } })
        fireEvent.change(passwordInput, { target: { value: 'wrongpassword' } })
        fireEvent.click(submitButton)

        await waitFor(() => {
            expect(screen.getByText(/invalid credentials/i)).toBeInTheDocument()
        })
    })

    it('should handle Web3Auth wallet connection', async () => {
        const mockWeb3AuthLogin = require('@/lib/web3auth').login
        mockWeb3AuthLogin.mockResolvedValue({ success: true, user: { id: 'wallet123' } })

        render(<LoginPage />)

        const walletButton = screen.getByRole('button', { name: /connect wallet/i })
        fireEvent.click(walletButton)

        await waitFor(() => {
            expect(mockWeb3AuthLogin).toHaveBeenCalled()
            expect(mockPush).toHaveBeenCalledWith('/dashboard')
        })
    })

    it('should show loading state during authentication', async () => {
        const mockLogin = require('@/lib/web3auth').login
        mockLogin.mockImplementation(() => new Promise(resolve => setTimeout(resolve, 1000)))

        render(<LoginPage />)

        const emailInput = screen.getByLabelText(/email/i)
        const passwordInput = screen.getByLabelText(/password/i)
        const submitButton = screen.getByRole('button', { name: /sign in/i })

        fireEvent.change(emailInput, { target: { value: 'test@example.com' } })
        fireEvent.change(passwordInput, { target: { value: 'password123' } })
        fireEvent.click(submitButton)

        expect(screen.getByText(/signing in/i)).toBeInTheDocument()
        expect(submitButton).toBeDisabled()
    })

    it('should handle language switching', () => {
        const mockChangeLanguage = jest.fn()
        const mockUseTranslation = require('next-i18next').useTranslation
        mockUseTranslation.mockReturnValue({
            t: (key: string) => key,
            i18n: {
                changeLanguage: mockChangeLanguage,
            },
        })

        render(<LoginPage />)

        const spanishButton = screen.getByText(/spanish/i)
        fireEvent.click(spanishButton)

        expect(mockChangeLanguage).toHaveBeenCalledWith('es')
    })

    it('should render forgot password link', () => {
        render(<LoginPage />)

        expect(screen.getByText(/forgot password/i)).toBeInTheDocument()
    })

    it('should render sign up link', () => {
        render(<LoginPage />)

        const signUpLink = screen.getByText(/don't have an account/i)
        expect(signUpLink).toBeInTheDocument()
        expect(signUpLink.closest('a')).toHaveAttribute('href', '/signup')
    })
})
