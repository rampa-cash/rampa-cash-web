import { useState, useEffect } from 'react'
import { useTranslation } from 'next-i18next'
import { useRouter } from 'next/router'
import LanguageSwitcher from '@/components/LanguageSwitcher'

interface SendMoneyFormData {
    recipient: string
    amount: string
    currency: string
    memo: string
    type: 'email' | 'phone' | 'wallet'
    saveToContacts: boolean
}

interface Contact {
    id: string
    name: string
    email: string
    phone: string
}

// Mock contacts data - in real app this would come from contacts hook
const mockContacts: Contact[] = [
    { id: '1', name: 'Jane Smith', email: 'jane@example.com', phone: '+1234567890' },
    { id: '2', name: 'Bob Johnson', email: 'bob@example.com', phone: '+0987654321' },
]

// Mock wallet data - in real app this would come from wallet hook
const mockWallet = {
    balance: {
        usd: 1250.50,
        sol: 5.25,
    }
}

export const SendMoney = (): JSX.Element => {
    const { t } = useTranslation('common')
    const router = useRouter()
    const [isLoading, setIsLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)
    const [showSuggestions, setShowSuggestions] = useState(false)
    const [filteredContacts, setFilteredContacts] = useState<Contact[]>([])
    const [formData, setFormData] = useState<SendMoneyFormData>({
        recipient: '',
        amount: '',
        currency: 'USD',
        memo: '',
        type: 'email',
        saveToContacts: false
    })
    const [errors, setErrors] = useState<{ [key: string]: string }>({})

    // Calculate fees (2.5% of amount)
    const calculateFee = (amount: number) => {
        return amount * 0.025
    }

    const totalAmount = formData.amount ? parseFloat(formData.amount) + calculateFee(parseFloat(formData.amount)) : 0

    useEffect(() => {
        if (formData.recipient.length > 0) {
            const filtered = mockContacts.filter(contact =>
                contact.name.toLowerCase().includes(formData.recipient.toLowerCase()) ||
                contact.email.toLowerCase().includes(formData.recipient.toLowerCase()) ||
                contact.phone.includes(formData.recipient)
            )
            setFilteredContacts(filtered)
            setShowSuggestions(true)
        } else {
            setShowSuggestions(false)
        }
    }, [formData.recipient])

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        const { name, value, type } = e.target
        const checked = (e.target as HTMLInputElement).checked
        
        setFormData(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value
        }))
        
        // Clear error when user starts typing
        if (errors[name]) {
            setErrors(prev => ({
                ...prev,
                [name]: ''
            }))
        }
    }

    const handleContactSelect = (contact: Contact) => {
        setFormData(prev => ({
            ...prev,
            recipient: contact.email,
            type: 'email' as const
        }))
        setShowSuggestions(false)
    }

    const validateForm = () => {
        const newErrors: { [key: string]: string } = {}
        
        if (!formData.recipient) {
            newErrors.recipient = t('sendMoney.form.validation.recipientRequired')
        } else if (formData.type === 'email' && !/\S+@\S+\.\S+/.test(formData.recipient)) {
            newErrors.recipient = t('sendMoney.form.validation.emailInvalid')
        } else if (formData.type === 'phone' && !/^\+?[\d\s-()]+$/.test(formData.recipient)) {
            newErrors.recipient = t('sendMoney.form.validation.phoneInvalid')
        }
        
        if (!formData.amount) {
            newErrors.amount = t('sendMoney.form.validation.amountRequired')
        } else if (parseFloat(formData.amount) <= 0) {
            newErrors.amount = t('sendMoney.form.validation.amountPositive')
        } else if (parseFloat(formData.amount) > mockWallet.balance.usd) {
            newErrors.amount = t('sendMoney.form.validation.amountExceedsBalance')
        }
        
        setErrors(newErrors)
        return Object.keys(newErrors).length === 0
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        
        if (!validateForm()) {
            return
        }
        
        setIsLoading(true)
        setError(null)
        
        try {
            // TODO: Implement actual send money logic here
            console.log('Send money attempt:', formData)
            
            // Simulate API call
            await new Promise(resolve => setTimeout(resolve, 1000))
            
            // Redirect to dashboard after successful send
            router.push('/dashboard')
        } catch (error) {
            console.error('Send money error:', error)
            setError(t('sendMoney.form.error.general'))
        } finally {
            setIsLoading(false)
        }
    }

    const formatCurrency = (amount: number, currency: string) => {
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: currency,
        }).format(amount)
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
                                {t('sendMoney.title')}
                            </h1>
                        </div>
                        <div className="flex items-center space-x-4">
                            <LanguageSwitcher />
                        </div>
                    </div>
                </div>
            </header>

            <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {/* Wallet Balance */}
                <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-8">
                    <h3 className="text-lg font-medium text-gray-900 mb-4">
                        {t('sendMoney.balance.title')}
                    </h3>
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <p className="text-sm text-gray-500 mb-1">{t('sendMoney.balance.usd')}</p>
                            <p className="text-2xl font-bold text-gray-900">
                                {formatCurrency(mockWallet.balance.usd, 'USD')}
                            </p>
                        </div>
                        <div>
                            <p className="text-sm text-gray-500 mb-1">{t('sendMoney.balance.sol')}</p>
                            <p className="text-2xl font-bold text-gray-900">
                                {mockWallet.balance.sol} SOL
                            </p>
                        </div>
                    </div>
                </div>

                {/* Send Money Form */}
                <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                    <form onSubmit={handleSubmit} className="space-y-6">
                        {/* General Error */}
                        {error && (
                            <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-xl text-sm">
                                {error}
                            </div>
                        )}

                        {/* Recipient Type Selection */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-3">
                                {t('sendMoney.form.recipientType.label')}
                            </label>
                            <div className="grid grid-cols-3 gap-3">
                                {[
                                    { value: 'email', label: t('sendMoney.form.recipientType.email') },
                                    { value: 'phone', label: t('sendMoney.form.recipientType.phone') },
                                    { value: 'wallet', label: t('sendMoney.form.recipientType.wallet') }
                                ].map((option) => (
                                    <label key={option.value} className="relative">
                                        <input
                                            type="radio"
                                            name="type"
                                            value={option.value}
                                            checked={formData.type === option.value}
                                            onChange={handleInputChange}
                                            className="sr-only"
                                        />
                                        <div className={`p-3 text-center border rounded-lg cursor-pointer transition-colors ${
                                            formData.type === option.value
                                                ? 'border-indigo-500 bg-indigo-50 text-indigo-700'
                                                : 'border-gray-300 hover:border-gray-400'
                                        }`}>
                                            {option.label}
                                        </div>
                                    </label>
                                ))}
                            </div>
                        </div>

                        {/* Recipient Field */}
                        <div className="relative">
                            <label htmlFor="recipient" className="block text-sm font-medium text-gray-700 mb-2">
                                {t('sendMoney.form.recipient.label')}
                            </label>
                            <input
                                id="recipient"
                                name="recipient"
                                type="text"
                                value={formData.recipient}
                                onChange={handleInputChange}
                                onFocus={() => setShowSuggestions(true)}
                                className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all duration-200 ${
                                    errors.recipient 
                                        ? 'border-red-300 bg-red-50' 
                                        : 'border-gray-300 hover:border-gray-400'
                                }`}
                                placeholder={
                                    formData.type === 'email' 
                                        ? t('sendMoney.form.recipient.placeholder.email')
                                        : formData.type === 'phone'
                                        ? t('sendMoney.form.recipient.placeholder.phone')
                                        : t('sendMoney.form.recipient.placeholder.wallet')
                                }
                            />
                            {errors.recipient && (
                                <p className="mt-2 text-sm text-red-600">{errors.recipient}</p>
                            )}
                            
                            {/* Contact Suggestions */}
                            {showSuggestions && filteredContacts.length > 0 && (
                                <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg max-h-60 overflow-auto">
                                    {filteredContacts.map((contact) => (
                                        <button
                                            key={contact.id}
                                            type="button"
                                            onClick={() => handleContactSelect(contact)}
                                            className="w-full px-4 py-3 text-left hover:bg-gray-50 border-b border-gray-100 last:border-b-0"
                                        >
                                            <p className="font-medium text-gray-900">{contact.name}</p>
                                            <p className="text-sm text-gray-500">{contact.email}</p>
                                        </button>
                                    ))}
                                </div>
                            )}
                        </div>

                        {/* Amount Field */}
                        <div>
                            <label htmlFor="amount" className="block text-sm font-medium text-gray-700 mb-2">
                                {t('sendMoney.form.amount.label')}
                            </label>
                            <div className="relative">
                                <input
                                    id="amount"
                                    name="amount"
                                    type="number"
                                    step="0.01"
                                    min="0"
                                    value={formData.amount}
                                    onChange={handleInputChange}
                                    className={`w-full px-4 py-3 pr-20 border rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all duration-200 ${
                                        errors.amount 
                                            ? 'border-red-300 bg-red-50' 
                                            : 'border-gray-300 hover:border-gray-400'
                                    }`}
                                    placeholder="0.00"
                                />
                                <div className="absolute inset-y-0 right-0 flex items-center pr-3">
                                    <select
                                        name="currency"
                                        value={formData.currency}
                                        onChange={handleInputChange}
                                        className="bg-transparent text-gray-500 text-sm font-medium border-none focus:ring-0"
                                    >
                                        <option value="USD">USD</option>
                                        <option value="SOL">SOL</option>
                                    </select>
                                </div>
                            </div>
                            {errors.amount && (
                                <p className="mt-2 text-sm text-red-600">{errors.amount}</p>
                            )}
                        </div>

                        {/* Memo Field */}
                        <div>
                            <label htmlFor="memo" className="block text-sm font-medium text-gray-700 mb-2">
                                {t('sendMoney.form.memo.label')} <span className="text-gray-400">({t('sendMoney.form.memo.optional')})</span>
                            </label>
                            <textarea
                                id="memo"
                                name="memo"
                                rows={3}
                                value={formData.memo}
                                onChange={handleInputChange}
                                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all duration-200 hover:border-gray-400"
                                placeholder={t('sendMoney.form.memo.placeholder')}
                            />
                        </div>

                        {/* Fee Calculation */}
                        {formData.amount && parseFloat(formData.amount) > 0 && (
                            <div className="bg-gray-50 rounded-lg p-4">
                                <div className="space-y-2">
                                    <div className="flex justify-between text-sm">
                                        <span className="text-gray-600">{t('sendMoney.form.fee.amount')}</span>
                                        <span className="font-medium">{formatCurrency(parseFloat(formData.amount), formData.currency)}</span>
                                    </div>
                                    <div className="flex justify-between text-sm">
                                        <span className="text-gray-600">{t('sendMoney.form.fee.fee')}</span>
                                        <span className="font-medium">{formatCurrency(calculateFee(parseFloat(formData.amount)), formData.currency)}</span>
                                    </div>
                                    <div className="border-t border-gray-200 pt-2">
                                        <div className="flex justify-between font-medium">
                                            <span>{t('sendMoney.form.fee.total')}</span>
                                            <span>{formatCurrency(totalAmount, formData.currency)}</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Save to Contacts */}
                        <div className="flex items-center">
                            <input
                                id="saveToContacts"
                                name="saveToContacts"
                                type="checkbox"
                                checked={formData.saveToContacts}
                                onChange={handleInputChange}
                                className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                            />
                            <label htmlFor="saveToContacts" className="ml-2 block text-sm text-gray-700">
                                {t('sendMoney.form.saveToContacts')}
                            </label>
                        </div>

                        {/* Action Buttons */}
                        <div className="flex space-x-4">
                            <button
                                type="button"
                                onClick={() => router.back()}
                                className="flex-1 py-3 px-4 border border-gray-300 rounded-xl text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-all duration-200"
                            >
                                {t('sendMoney.form.cancel')}
                            </button>
                            <button
                                type="submit"
                                disabled={isLoading}
                                className="flex-1 py-3 px-4 border border-transparent rounded-xl shadow-lg text-sm font-medium text-white bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 hover:from-indigo-700 hover:via-purple-700 hover:to-pink-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
                            >
                                {isLoading ? (
                                    <div className="flex items-center justify-center">
                                        <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                        </svg>
                                        {t('sendMoney.form.sending')}
                                    </div>
                                ) : (
                                    t('sendMoney.form.send')
                                )}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    )
}
