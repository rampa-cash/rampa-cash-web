import { useState } from 'react';
import { useTranslation } from 'next-i18next';
import { useRouter } from 'next/router';
import LanguageSwitcher from '@/components/LanguageSwitcher';

interface OffRampFormData {
    amount: string;
    currency: string;
    destination: string;
    bankAccount?: string;
    walletAddress?: string;
    paymentMethod: string;
}

export const OffRamp = (): JSX.Element => {
    const { t } = useTranslation('common');
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [formData, setFormData] = useState<OffRampFormData>({
        amount: '',
        currency: 'USD',
        destination: 'bank',
        bankAccount: '',
        walletAddress: '',
        paymentMethod: 'bank',
    });
    const [errors, setErrors] = useState<{ [key: string]: string }>({});

    // Mock wallet balance
    const mockBalance = {
        usd: 1250.5,
        sol: 5.25,
    };

    const handleInputChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
    ) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value,
        }));

        // Clear error when user starts typing
        if (errors[name]) {
            setErrors(prev => ({
                ...prev,
                [name]: '',
            }));
        }
    };

    const validateForm = () => {
        const newErrors: { [key: string]: string } = {};

        if (!formData.amount) {
            newErrors.amount = t('offramp.form.validation.amountRequired');
        } else if (parseFloat(formData.amount) <= 0) {
            newErrors.amount = t('offramp.form.validation.amountPositive');
        } else if (parseFloat(formData.amount) < 10) {
            newErrors.amount = t('offramp.form.validation.amountMinimum');
        } else if (parseFloat(formData.amount) > mockBalance.usd) {
            newErrors.amount = t(
                'offramp.form.validation.amountExceedsBalance'
            );
        }

        if (formData.destination === 'bank' && !formData.bankAccount) {
            newErrors.bankAccount = t(
                'offramp.form.validation.bankAccountRequired'
            );
        }

        if (formData.destination === 'wallet' && !formData.walletAddress) {
            newErrors.walletAddress = t(
                'offramp.form.validation.walletAddressRequired'
            );
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!validateForm()) {
            return;
        }

        setIsLoading(true);
        setError(null);

        try {
            // TODO: Implement actual offramp logic
            console.log('OffRamp attempt:', formData);

            // Simulate API call
            await new Promise(resolve => setTimeout(resolve, 2000));

            // Redirect to dashboard after successful offramp
            router.push('/dashboard');
        } catch (error) {
            console.error('OffRamp error:', error);
            setError(t('offramp.form.error.general'));
        } finally {
            setIsLoading(false);
        }
    };

    const formatCurrency = (amount: number, currency: string) => {
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: currency,
        }).format(amount);
    };

    const calculateFee = (amount: number) => {
        return amount * 0.03; // 3% fee for offramp
    };

    const totalAmount = formData.amount
        ? parseFloat(formData.amount) +
          calculateFee(parseFloat(formData.amount))
        : 0;

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
                                <svg
                                    className="w-6 h-6"
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M15 19l-7-7 7-7"
                                    />
                                </svg>
                            </button>
                            <h1 className="text-xl font-semibold text-gray-900">
                                {t('offramp.title')}
                            </h1>
                        </div>
                        <div className="flex items-center space-x-4">
                            <LanguageSwitcher />
                        </div>
                    </div>
                </div>
            </header>

            <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {/* Balance Card */}
                <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-8">
                    <h3 className="text-lg font-medium text-gray-900 mb-4">
                        {t('offramp.balance.title')}
                    </h3>
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <p className="text-sm text-gray-500 mb-1">USD</p>
                            <p className="text-2xl font-bold text-gray-900">
                                {formatCurrency(mockBalance.usd, 'USD')}
                            </p>
                        </div>
                        <div>
                            <p className="text-sm text-gray-500 mb-1">SOL</p>
                            <p className="text-2xl font-bold text-gray-900">
                                {mockBalance.sol.toFixed(4)} SOL
                            </p>
                        </div>
                    </div>
                </div>

                {/* Info Card */}
                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6 mb-8">
                    <div className="flex">
                        <div className="flex-shrink-0">
                            <svg
                                className="h-5 w-5 text-yellow-400"
                                fill="currentColor"
                                viewBox="0 0 20 20"
                            >
                                <path
                                    fillRule="evenodd"
                                    d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z"
                                    clipRule="evenodd"
                                />
                            </svg>
                        </div>
                        <div className="ml-3">
                            <h3 className="text-sm font-medium text-yellow-800">
                                {t('offramp.info.title')}
                            </h3>
                            <div className="mt-2 text-sm text-yellow-700">
                                <p>{t('offramp.info.description')}</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* OffRamp Form */}
                <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                    <form onSubmit={handleSubmit} className="space-y-6">
                        {/* General Error */}
                        {error && (
                            <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-xl text-sm">
                                {error}
                            </div>
                        )}

                        {/* Amount Field */}
                        <div>
                            <label
                                htmlFor="amount"
                                className="block text-sm font-medium text-gray-700 mb-2"
                            >
                                {t('offramp.form.amount.label')}
                            </label>
                            <div className="relative">
                                <input
                                    id="amount"
                                    name="amount"
                                    type="number"
                                    step="0.01"
                                    min="10"
                                    max={mockBalance.usd}
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
                                        <option value="EUR">EUR</option>
                                    </select>
                                </div>
                            </div>
                            {errors.amount && (
                                <p className="mt-2 text-sm text-red-600">
                                    {errors.amount}
                                </p>
                            )}
                        </div>

                        {/* Destination Selection */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-3">
                                {t('offramp.form.destination.label')}
                            </label>
                            <div className="grid grid-cols-2 gap-3">
                                {[
                                    {
                                        value: 'bank',
                                        label: t(
                                            'offramp.form.destination.bank'
                                        ),
                                        icon: '🏦',
                                    },
                                    {
                                        value: 'wallet',
                                        label: t(
                                            'offramp.form.destination.wallet'
                                        ),
                                        icon: '👛',
                                    },
                                ].map(option => (
                                    <label
                                        key={option.value}
                                        className="relative"
                                    >
                                        <input
                                            type="radio"
                                            name="destination"
                                            value={option.value}
                                            checked={
                                                formData.destination ===
                                                option.value
                                            }
                                            onChange={handleInputChange}
                                            className="sr-only"
                                        />
                                        <div
                                            className={`p-4 text-center border rounded-lg cursor-pointer transition-colors ${
                                                formData.destination ===
                                                option.value
                                                    ? 'border-indigo-500 bg-indigo-50 text-indigo-700'
                                                    : 'border-gray-300 hover:border-gray-400'
                                            }`}
                                        >
                                            <div className="text-2xl mb-2">
                                                {option.icon}
                                            </div>
                                            <div className="text-sm font-medium">
                                                {option.label}
                                            </div>
                                        </div>
                                    </label>
                                ))}
                            </div>
                        </div>

                        {/* Bank Account Field */}
                        {formData.destination === 'bank' && (
                            <div>
                                <label
                                    htmlFor="bankAccount"
                                    className="block text-sm font-medium text-gray-700 mb-2"
                                >
                                    {t('offramp.form.bankAccount.label')}
                                </label>
                                <input
                                    id="bankAccount"
                                    name="bankAccount"
                                    type="text"
                                    value={formData.bankAccount || ''}
                                    onChange={handleInputChange}
                                    className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all duration-200 ${
                                        errors.bankAccount
                                            ? 'border-red-300 bg-red-50'
                                            : 'border-gray-300 hover:border-gray-400'
                                    }`}
                                    placeholder={t(
                                        'offramp.form.bankAccount.placeholder'
                                    )}
                                />
                                {errors.bankAccount && (
                                    <p className="mt-2 text-sm text-red-600">
                                        {errors.bankAccount}
                                    </p>
                                )}
                            </div>
                        )}

                        {/* Wallet Address Field */}
                        {formData.destination === 'wallet' && (
                            <div>
                                <label
                                    htmlFor="walletAddress"
                                    className="block text-sm font-medium text-gray-700 mb-2"
                                >
                                    {t('offramp.form.walletAddress.label')}
                                </label>
                                <input
                                    id="walletAddress"
                                    name="walletAddress"
                                    type="text"
                                    value={formData.walletAddress || ''}
                                    onChange={handleInputChange}
                                    className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all duration-200 ${
                                        errors.walletAddress
                                            ? 'border-red-300 bg-red-50'
                                            : 'border-gray-300 hover:border-gray-400'
                                    }`}
                                    placeholder={t(
                                        'offramp.form.walletAddress.placeholder'
                                    )}
                                />
                                {errors.walletAddress && (
                                    <p className="mt-2 text-sm text-red-600">
                                        {errors.walletAddress}
                                    </p>
                                )}
                            </div>
                        )}

                        {/* Payment Method */}
                        <div>
                            <label
                                htmlFor="paymentMethod"
                                className="block text-sm font-medium text-gray-700 mb-2"
                            >
                                {t('offramp.form.paymentMethod.label')}
                            </label>
                            <select
                                id="paymentMethod"
                                name="paymentMethod"
                                value={formData.paymentMethod}
                                onChange={handleInputChange}
                                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all duration-200"
                            >
                                <option value="bank">
                                    {t('offramp.form.paymentMethod.bank')}
                                </option>
                                <option value="card">
                                    {t('offramp.form.paymentMethod.card')}
                                </option>
                                <option value="crypto">
                                    {t('offramp.form.paymentMethod.crypto')}
                                </option>
                            </select>
                        </div>

                        {/* Fee Calculation */}
                        {formData.amount && parseFloat(formData.amount) > 0 && (
                            <div className="bg-gray-50 rounded-lg p-4">
                                <div className="space-y-2">
                                    <div className="flex justify-between text-sm">
                                        <span className="text-gray-600">
                                            {t('offramp.form.fee.amount')}
                                        </span>
                                        <span className="font-medium">
                                            {formatCurrency(
                                                parseFloat(formData.amount),
                                                formData.currency
                                            )}
                                        </span>
                                    </div>
                                    <div className="flex justify-between text-sm">
                                        <span className="text-gray-600">
                                            {t('offramp.form.fee.fee')}
                                        </span>
                                        <span className="font-medium">
                                            {formatCurrency(
                                                calculateFee(
                                                    parseFloat(formData.amount)
                                                ),
                                                formData.currency
                                            )}
                                        </span>
                                    </div>
                                    <div className="border-t border-gray-200 pt-2">
                                        <div className="flex justify-between font-medium">
                                            <span>
                                                {t('offramp.form.fee.total')}
                                            </span>
                                            <span>
                                                {formatCurrency(
                                                    totalAmount,
                                                    formData.currency
                                                )}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Action Buttons */}
                        <div className="flex space-x-4">
                            <button
                                type="button"
                                onClick={() => router.back()}
                                className="flex-1 py-3 px-4 border border-gray-300 rounded-xl text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-all duration-200"
                            >
                                {t('offramp.form.cancel')}
                            </button>
                            <button
                                type="submit"
                                disabled={isLoading}
                                className="flex-1 py-3 px-4 border border-transparent rounded-xl shadow-lg text-sm font-medium text-white bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 hover:from-indigo-700 hover:via-purple-700 hover:to-pink-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
                            >
                                {isLoading ? (
                                    <div className="flex items-center justify-center">
                                        <svg
                                            className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                                            xmlns="http://www.w3.org/2000/svg"
                                            fill="none"
                                            viewBox="0 0 24 24"
                                        >
                                            <circle
                                                className="opacity-25"
                                                cx="12"
                                                cy="12"
                                                r="10"
                                                stroke="currentColor"
                                                strokeWidth="4"
                                            ></circle>
                                            <path
                                                className="opacity-75"
                                                fill="currentColor"
                                                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                                            ></path>
                                        </svg>
                                        {t('offramp.form.processing')}
                                    </div>
                                ) : (
                                    t('offramp.form.submit')
                                )}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};
