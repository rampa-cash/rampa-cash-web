import { useState } from 'react';
import { useTranslation } from 'next-i18next';
import { useRouter } from 'next/router';
import LanguageSwitcher from '@/components/LanguageSwitcher';

interface VISACardData {
    cardNumber: string;
    expiryDate: string;
    cvv: string;
    cardholderName: string;
    billingAddress: string;
    city: string;
    state: string;
    zipCode: string;
    country: string;
}

// Mock VISA card data - in real app this would come from visa-card hook
const mockVisaCard = {
    id: 'card123',
    lastFour: '1234',
    status: 'active',
    cardholderName: 'John Doe',
    expiryDate: '12/25',
    balance: 1250.5,
    spendingLimit: 5000.0,
    monthlySpent: 750.25,
};

export const VISACard = (): JSX.Element => {
    const { t } = useTranslation('common');
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [showCardForm, setShowCardForm] = useState(false);
    const [formData, setFormData] = useState<VISACardData>({
        cardNumber: '',
        expiryDate: '',
        cvv: '',
        cardholderName: '',
        billingAddress: '',
        city: '',
        state: '',
        zipCode: '',
        country: 'US',
    });
    const [errors, setErrors] = useState<{ [key: string]: string }>({});

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

        if (!formData.cardNumber) {
            newErrors.cardNumber = t(
                'visaCard.form.validation.cardNumberRequired'
            );
        } else if (!/^\d{16}$/.test(formData.cardNumber.replace(/\s/g, ''))) {
            newErrors.cardNumber = t(
                'visaCard.form.validation.cardNumberInvalid'
            );
        }

        if (!formData.expiryDate) {
            newErrors.expiryDate = t(
                'visaCard.form.validation.expiryDateRequired'
            );
        } else if (!/^\d{2}\/\d{2}$/.test(formData.expiryDate)) {
            newErrors.expiryDate = t(
                'visaCard.form.validation.expiryDateInvalid'
            );
        }

        if (!formData.cvv) {
            newErrors.cvv = t('visaCard.form.validation.cvvRequired');
        } else if (!/^\d{3,4}$/.test(formData.cvv)) {
            newErrors.cvv = t('visaCard.form.validation.cvvInvalid');
        }

        if (!formData.cardholderName) {
            newErrors.cardholderName = t(
                'visaCard.form.validation.cardholderNameRequired'
            );
        }

        if (!formData.billingAddress) {
            newErrors.billingAddress = t(
                'visaCard.form.validation.billingAddressRequired'
            );
        }

        if (!formData.city) {
            newErrors.city = t('visaCard.form.validation.cityRequired');
        }

        if (!formData.state) {
            newErrors.state = t('visaCard.form.validation.stateRequired');
        }

        if (!formData.zipCode) {
            newErrors.zipCode = t('visaCard.form.validation.zipCodeRequired');
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
            // TODO: Implement actual VISA card creation logic
            console.log('VISA card creation attempt:', formData);

            // Simulate API call
            await new Promise(resolve => setTimeout(resolve, 2000));

            // Redirect to dashboard after successful card creation
            router.push('/dashboard');
        } catch (error) {
            console.error('VISA card creation error:', error);
            setError(t('visaCard.form.error.general'));
        } finally {
            setIsLoading(false);
        }
    };

    const formatCurrency = (amount: number) => {
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD',
        }).format(amount);
    };

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'active':
                return 'text-green-600 bg-green-100';
            case 'pending':
                return 'text-yellow-600 bg-yellow-100';
            case 'suspended':
                return 'text-red-600 bg-red-100';
            default:
                return 'text-gray-600 bg-gray-100';
        }
    };

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
                                {t('visaCard.title')}
                            </h1>
                        </div>
                        <div className="flex items-center space-x-4">
                            <LanguageSwitcher />
                        </div>
                    </div>
                </div>
            </header>

            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {/* Error Display */}
                {error && (
                    <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg text-sm mb-6">
                        {error}
                    </div>
                )}

                {/* VISA Card Display */}
                <div className="bg-gradient-to-r from-indigo-600 to-purple-600 rounded-2xl p-8 text-white mb-8">
                    <div className="flex justify-between items-start mb-6">
                        <div>
                            <h2 className="text-2xl font-bold mb-2">
                                {t('visaCard.card.title')}
                            </h2>
                            <p className="text-indigo-100">
                                {t('visaCard.card.subtitle')}
                            </p>
                        </div>
                        <div className="text-right">
                            <div
                                className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(mockVisaCard.status)}`}
                            >
                                {mockVisaCard.status}
                            </div>
                        </div>
                    </div>

                    <div className="mb-6">
                        <div className="text-2xl font-mono mb-2">
                            •••• •••• •••• {mockVisaCard.lastFour}
                        </div>
                        <div className="text-sm text-indigo-100">
                            {mockVisaCard.cardholderName} •{' '}
                            {mockVisaCard.expiryDate}
                        </div>
                    </div>

                    <div className="grid grid-cols-3 gap-4">
                        <div>
                            <p className="text-sm text-indigo-100 mb-1">
                                {t('visaCard.card.balance')}
                            </p>
                            <p className="text-xl font-bold">
                                {formatCurrency(mockVisaCard.balance)}
                            </p>
                        </div>
                        <div>
                            <p className="text-sm text-indigo-100 mb-1">
                                {t('visaCard.card.spendingLimit')}
                            </p>
                            <p className="text-xl font-bold">
                                {formatCurrency(mockVisaCard.spendingLimit)}
                            </p>
                        </div>
                        <div>
                            <p className="text-sm text-indigo-100 mb-1">
                                {t('visaCard.card.monthlySpent')}
                            </p>
                            <p className="text-xl font-bold">
                                {formatCurrency(mockVisaCard.monthlySpent)}
                            </p>
                        </div>
                    </div>
                </div>

                {/* Card Actions */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
                    <button className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 hover:shadow-md transition-shadow text-center">
                        <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mx-auto mb-3">
                            <svg
                                className="w-6 h-6 text-blue-600"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                                />
                            </svg>
                        </div>
                        <p className="text-sm font-medium text-gray-900">
                            {t('visaCard.actions.viewStatement')}
                        </p>
                    </button>

                    <button className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 hover:shadow-md transition-shadow text-center">
                        <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mx-auto mb-3">
                            <svg
                                className="w-6 h-6 text-green-600"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 100 4m0-4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 100 4m0-4v2m0-6V4"
                                />
                            </svg>
                        </div>
                        <p className="text-sm font-medium text-gray-900">
                            {t('visaCard.actions.manageLimits')}
                        </p>
                    </button>

                    <button className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 hover:shadow-md transition-shadow text-center">
                        <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mx-auto mb-3">
                            <svg
                                className="w-6 h-6 text-purple-600"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z"
                                />
                            </svg>
                        </div>
                        <p className="text-sm font-medium text-gray-900">
                            {t('visaCard.actions.blockCard')}
                        </p>
                    </button>
                </div>

                {/* Card Form */}
                {showCardForm ? (
                    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                        <div className="flex justify-between items-center mb-6">
                            <h3 className="text-lg font-medium text-gray-900">
                                {t('visaCard.form.title')}
                            </h3>
                            <button
                                onClick={() => setShowCardForm(false)}
                                className="text-gray-400 hover:text-gray-600"
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
                                        d="M6 18L18 6M6 6l12 12"
                                    />
                                </svg>
                            </button>
                        </div>

                        <form onSubmit={handleSubmit} className="space-y-6">
                            {/* Card Information */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="md:col-span-2">
                                    <label
                                        htmlFor="cardNumber"
                                        className="block text-sm font-medium text-gray-700 mb-2"
                                    >
                                        {t('visaCard.form.cardNumber.label')}
                                    </label>
                                    <input
                                        id="cardNumber"
                                        name="cardNumber"
                                        type="text"
                                        value={formData.cardNumber}
                                        onChange={handleInputChange}
                                        className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all duration-200 ${
                                            errors.cardNumber
                                                ? 'border-red-300 bg-red-50'
                                                : 'border-gray-300 hover:border-gray-400'
                                        }`}
                                        placeholder="1234 5678 9012 3456"
                                    />
                                    {errors.cardNumber && (
                                        <p className="mt-2 text-sm text-red-600">
                                            {errors.cardNumber}
                                        </p>
                                    )}
                                </div>

                                <div>
                                    <label
                                        htmlFor="expiryDate"
                                        className="block text-sm font-medium text-gray-700 mb-2"
                                    >
                                        {t('visaCard.form.expiryDate.label')}
                                    </label>
                                    <input
                                        id="expiryDate"
                                        name="expiryDate"
                                        type="text"
                                        value={formData.expiryDate}
                                        onChange={handleInputChange}
                                        className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all duration-200 ${
                                            errors.expiryDate
                                                ? 'border-red-300 bg-red-50'
                                                : 'border-gray-300 hover:border-gray-400'
                                        }`}
                                        placeholder="MM/YY"
                                    />
                                    {errors.expiryDate && (
                                        <p className="mt-2 text-sm text-red-600">
                                            {errors.expiryDate}
                                        </p>
                                    )}
                                </div>

                                <div>
                                    <label
                                        htmlFor="cvv"
                                        className="block text-sm font-medium text-gray-700 mb-2"
                                    >
                                        {t('visaCard.form.cvv.label')}
                                    </label>
                                    <input
                                        id="cvv"
                                        name="cvv"
                                        type="text"
                                        value={formData.cvv}
                                        onChange={handleInputChange}
                                        className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all duration-200 ${
                                            errors.cvv
                                                ? 'border-red-300 bg-red-50'
                                                : 'border-gray-300 hover:border-gray-400'
                                        }`}
                                        placeholder="123"
                                    />
                                    {errors.cvv && (
                                        <p className="mt-2 text-sm text-red-600">
                                            {errors.cvv}
                                        </p>
                                    )}
                                </div>

                                <div className="md:col-span-2">
                                    <label
                                        htmlFor="cardholderName"
                                        className="block text-sm font-medium text-gray-700 mb-2"
                                    >
                                        {t(
                                            'visaCard.form.cardholderName.label'
                                        )}
                                    </label>
                                    <input
                                        id="cardholderName"
                                        name="cardholderName"
                                        type="text"
                                        value={formData.cardholderName}
                                        onChange={handleInputChange}
                                        className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all duration-200 ${
                                            errors.cardholderName
                                                ? 'border-red-300 bg-red-50'
                                                : 'border-gray-300 hover:border-gray-400'
                                        }`}
                                        placeholder={t(
                                            'visaCard.form.cardholderName.placeholder'
                                        )}
                                    />
                                    {errors.cardholderName && (
                                        <p className="mt-2 text-sm text-red-600">
                                            {errors.cardholderName}
                                        </p>
                                    )}
                                </div>
                            </div>

                            {/* Billing Address */}
                            <div className="border-t border-gray-200 pt-6">
                                <h4 className="text-lg font-medium text-gray-900 mb-4">
                                    {t('visaCard.form.billingAddress.title')}
                                </h4>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="md:col-span-2">
                                        <label
                                            htmlFor="billingAddress"
                                            className="block text-sm font-medium text-gray-700 mb-2"
                                        >
                                            {t(
                                                'visaCard.form.billingAddress.address.label'
                                            )}
                                        </label>
                                        <input
                                            id="billingAddress"
                                            name="billingAddress"
                                            type="text"
                                            value={formData.billingAddress}
                                            onChange={handleInputChange}
                                            className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all duration-200 ${
                                                errors.billingAddress
                                                    ? 'border-red-300 bg-red-50'
                                                    : 'border-gray-300 hover:border-gray-400'
                                            }`}
                                            placeholder={t(
                                                'visaCard.form.billingAddress.address.placeholder'
                                            )}
                                        />
                                        {errors.billingAddress && (
                                            <p className="mt-2 text-sm text-red-600">
                                                {errors.billingAddress}
                                            </p>
                                        )}
                                    </div>

                                    <div>
                                        <label
                                            htmlFor="city"
                                            className="block text-sm font-medium text-gray-700 mb-2"
                                        >
                                            {t(
                                                'visaCard.form.billingAddress.city.label'
                                            )}
                                        </label>
                                        <input
                                            id="city"
                                            name="city"
                                            type="text"
                                            value={formData.city}
                                            onChange={handleInputChange}
                                            className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all duration-200 ${
                                                errors.city
                                                    ? 'border-red-300 bg-red-50'
                                                    : 'border-gray-300 hover:border-gray-400'
                                            }`}
                                            placeholder={t(
                                                'visaCard.form.billingAddress.city.placeholder'
                                            )}
                                        />
                                        {errors.city && (
                                            <p className="mt-2 text-sm text-red-600">
                                                {errors.city}
                                            </p>
                                        )}
                                    </div>

                                    <div>
                                        <label
                                            htmlFor="state"
                                            className="block text-sm font-medium text-gray-700 mb-2"
                                        >
                                            {t(
                                                'visaCard.form.billingAddress.state.label'
                                            )}
                                        </label>
                                        <input
                                            id="state"
                                            name="state"
                                            type="text"
                                            value={formData.state}
                                            onChange={handleInputChange}
                                            className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all duration-200 ${
                                                errors.state
                                                    ? 'border-red-300 bg-red-50'
                                                    : 'border-gray-300 hover:border-gray-400'
                                            }`}
                                            placeholder={t(
                                                'visaCard.form.billingAddress.state.placeholder'
                                            )}
                                        />
                                        {errors.state && (
                                            <p className="mt-2 text-sm text-red-600">
                                                {errors.state}
                                            </p>
                                        )}
                                    </div>

                                    <div>
                                        <label
                                            htmlFor="zipCode"
                                            className="block text-sm font-medium text-gray-700 mb-2"
                                        >
                                            {t(
                                                'visaCard.form.billingAddress.zipCode.label'
                                            )}
                                        </label>
                                        <input
                                            id="zipCode"
                                            name="zipCode"
                                            type="text"
                                            value={formData.zipCode}
                                            onChange={handleInputChange}
                                            className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all duration-200 ${
                                                errors.zipCode
                                                    ? 'border-red-300 bg-red-50'
                                                    : 'border-gray-300 hover:border-gray-400'
                                            }`}
                                            placeholder={t(
                                                'visaCard.form.billingAddress.zipCode.placeholder'
                                            )}
                                        />
                                        {errors.zipCode && (
                                            <p className="mt-2 text-sm text-red-600">
                                                {errors.zipCode}
                                            </p>
                                        )}
                                    </div>

                                    <div>
                                        <label
                                            htmlFor="country"
                                            className="block text-sm font-medium text-gray-700 mb-2"
                                        >
                                            {t(
                                                'visaCard.form.billingAddress.country.label'
                                            )}
                                        </label>
                                        <select
                                            id="country"
                                            name="country"
                                            value={formData.country}
                                            onChange={handleInputChange}
                                            className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all duration-200"
                                        >
                                            <option value="US">
                                                United States
                                            </option>
                                            <option value="CA">Canada</option>
                                            <option value="MX">Mexico</option>
                                            <option value="GB">
                                                United Kingdom
                                            </option>
                                            <option value="DE">Germany</option>
                                            <option value="FR">France</option>
                                            <option value="ES">Spain</option>
                                        </select>
                                    </div>
                                </div>
                            </div>

                            {/* Action Buttons */}
                            <div className="flex space-x-4 pt-6 border-t border-gray-200">
                                <button
                                    type="button"
                                    onClick={() => setShowCardForm(false)}
                                    className="flex-1 py-3 px-4 border border-gray-300 rounded-xl text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-all duration-200"
                                >
                                    {t('visaCard.form.cancel')}
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
                                            {t('visaCard.form.creating')}
                                        </div>
                                    ) : (
                                        t('visaCard.form.submit')
                                    )}
                                </button>
                            </div>
                        </form>
                    </div>
                ) : (
                    <div className="text-center py-12">
                        <div className="w-16 h-16 bg-indigo-100 rounded-full flex items-center justify-center mx-auto mb-4">
                            <svg
                                className="w-8 h-8 text-indigo-600"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z"
                                />
                            </svg>
                        </div>
                        <h3 className="text-lg font-medium text-gray-900 mb-2">
                            {t('visaCard.noCard.title')}
                        </h3>
                        <p className="text-gray-500 mb-6">
                            {t('visaCard.noCard.description')}
                        </p>
                        <button
                            onClick={() => setShowCardForm(true)}
                            className="bg-indigo-600 text-white px-6 py-3 rounded-lg text-sm font-medium hover:bg-indigo-700 transition-colors"
                        >
                            {t('visaCard.getCard')}
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
};
