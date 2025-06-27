import React from 'react'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import '@testing-library/jest-dom'
import WaitlistSignup from '../../components/WaitlistSignup'

// Mock fetch
global.fetch = jest.fn()

describe('WaitlistSignup', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('renders with default props', () => {
    render(<WaitlistSignup />)
    
    expect(screen.getByText('🚀 Get Early Access')).toBeInTheDocument()
    expect(screen.getByText('Join our waitlist and be the first to know when we launch')).toBeInTheDocument()
    expect(screen.getByPlaceholderText('Enter your email address')).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Join Waitlist' })).toBeInTheDocument()
  })

  it('renders with custom props', () => {
    const customTitle = 'Custom Title'
    const customDescription = 'Custom description'
    
    render(
      <WaitlistSignup 
        title={customTitle}
        description={customDescription}
      />
    )
    
    expect(screen.getByText(customTitle)).toBeInTheDocument()
    expect(screen.getByText(customDescription)).toBeInTheDocument()
  })

  it('shows error message for empty email', async () => {
    render(<WaitlistSignup />)
    
    const submitButton = screen.getByRole('button', { name: 'Join Waitlist' })
    fireEvent.click(submitButton)
    
    await waitFor(() => {
      expect(screen.getByText('Please enter your email address')).toBeInTheDocument()
    })
  })

  it('submits form successfully', async () => {
    const mockResponse = { success: true, message: 'Successfully joined!' }
    ;(fetch as jest.Mock).mockResolvedValueOnce({
      json: async () => mockResponse,
    })

    const onSuccess = jest.fn()
    render(<WaitlistSignup onSuccess={onSuccess} />)
    
    const emailInput = screen.getByPlaceholderText('Enter your email address')
    const submitButton = screen.getByRole('button', { name: 'Join Waitlist' })
    
    fireEvent.change(emailInput, { target: { value: 'test@example.com' } })
    fireEvent.click(submitButton)
    
    await waitFor(() => {
      expect(screen.getByText('Successfully joined!')).toBeInTheDocument()
    })
    
    expect(onSuccess).toHaveBeenCalledWith('test@example.com')
    expect(emailInput).toHaveValue('')
  })

  it('handles API error', async () => {
    const mockResponse = { success: false, error: 'Email already exists' }
    ;(fetch as jest.Mock).mockResolvedValueOnce({
      json: async () => mockResponse,
    })

    const onError = jest.fn()
    render(<WaitlistSignup onError={onError} />)
    
    const emailInput = screen.getByPlaceholderText('Enter your email address')
    const submitButton = screen.getByRole('button', { name: 'Join Waitlist' })
    
    fireEvent.change(emailInput, { target: { value: 'test@example.com' } })
    fireEvent.click(submitButton)
    
    await waitFor(() => {
      expect(screen.getByText('Email already exists')).toBeInTheDocument()
    })
    
    expect(onError).toHaveBeenCalledWith('Email already exists')
  })

  it('handles network error', async () => {
    ;(fetch as jest.Mock).mockRejectedValueOnce(new Error('Network error'))

    const onError = jest.fn()
    render(<WaitlistSignup onError={onError} />)
    
    const emailInput = screen.getByPlaceholderText('Enter your email address')
    const submitButton = screen.getByRole('button', { name: 'Join Waitlist' })
    
    fireEvent.change(emailInput, { target: { value: 'test@example.com' } })
    fireEvent.click(submitButton)
    
    await waitFor(() => {
      expect(screen.getByText('Failed to join waitlist. Please try again.')).toBeInTheDocument()
    })
    
    expect(onError).toHaveBeenCalledWith('Network error')
  })

  it('disables form during submission', async () => {
    ;(fetch as jest.Mock).mockImplementationOnce(
      () => new Promise(resolve => setTimeout(resolve, 100))
    )

    render(<WaitlistSignup />)
    
    const emailInput = screen.getByPlaceholderText('Enter your email address')
    const submitButton = screen.getByRole('button', { name: 'Join Waitlist' })
    
    fireEvent.change(emailInput, { target: { value: 'test@example.com' } })
    fireEvent.click(submitButton)
    
    expect(submitButton).toBeDisabled()
    expect(submitButton).toHaveTextContent('Joining...')
    expect(emailInput).toBeDisabled()
  })
}) 