import { useState, useEffect } from 'react'
import { useTranslation } from 'next-i18next'
import { useRouter } from 'next/router'
import LanguageSwitcher from '@/components/LanguageSwitcher'

export const ReceiveMoney = (): JSX.Element => {
    const { t } = useTranslation('common')
    const router = useRouter()
    const [walletAddress, setWalletAddress] = useState<string>('')
    const [amount, setAmount] = useState<string>('')
    const [memo, setMemo] = useState<string>('')

    // Mock wallet address - in real app this would come from wallet hook
    const mockWalletAddress = '9WzDXwBbmkg8ZTbNMqUxvQRAyrZzDsGYdLVL9zYtAWWM'

    useEffect(() => {
        setWalletAddress(mockWalletAddress)
    }, [])

    const handleCopyAddress = async () => {
        try {
            await navigator.clipboard.writeText(walletAddress)
            // TODO: Show success toast
        } catch (error) {
            console.error('Failed to copy address:', error)
        }
    }

    const handleShare = async () => {
        if (navigator.share) {
            try {
                await navigator.share({
                    title: t('receiveMoney.share.title'),
                    text: t('receiveMoney.share.text', { address: walletAddress }),
                    url: window.location.href
                })
            } catch (error) {
                console.error('Failed to share:', error)
            }
        } else {
            // Fallback to copying to clipboard
            await handleCopyAddress()
        }
    }

    const generatePaymentLink = () => {
        const params = new URLSearchParams()
        if (amount) params.set('amount', amount)
        if (memo) params.set('memo', memo)
        
        const baseUrl = window.location.origin
        return `${baseUrl}/transactions/receive?${params.toString()}`
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
                                {t('receiveMoney.title')}
                            </h1>
                        </div>
                        <div className="flex items-center space-x-4">
                            <LanguageSwitcher />
                        </div>
                    </div>
                </div>
            </header>

            <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {/* QR Code Section */}
                <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8 mb-8 text-center">
                    <h2 className="text-2xl font-bold text-gray-900 mb-6">
                        {t('receiveMoney.qrCode.title')}
                    </h2>
                    
                    {/* QR Code Placeholder */}
                    <div className="w-64 h-64 mx-auto mb-6 bg-gray-100 rounded-lg flex items-center justify-center">
                        <div className="text-center">
                            <svg className="w-24 h-24 text-gray-400 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v1m6 11h2m-6 0h-2v4m0-11v3m0 0h.01M12 12h4.01M16 20h4M4 12h4m12 0h.01M5 8h2a1 1 0 001-1V5a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1zm12 0h2a1 1 0 001-1V5a1 1 0 00-1-1h-2a1 1 0 00-1 1v2a1 1 0 001 1zM5 20h2a1 1 0 001-1v-2a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1z" />
                            </svg>
                            <p className="text-sm text-gray-500">{t('receiveMoney.qrCode.placeholder')}</p>
                        </div>
                    </div>

                    <p className="text-sm text-gray-600 mb-6">
                        {t('receiveMoney.qrCode.description')}
                    </p>

                    <div className="flex space-x-4 justify-center">
                        <button
                            onClick={handleCopyAddress}
                            className="bg-indigo-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-indigo-700 transition-colors"
                        >
                            {t('receiveMoney.actions.copyAddress')}
                        </button>
                        <button
                            onClick={handleShare}
                            className="bg-gray-100 text-gray-700 px-4 py-2 rounded-lg text-sm font-medium hover:bg-gray-200 transition-colors"
                        >
                            {t('receiveMoney.actions.share')}
                        </button>
                    </div>
                </div>

                {/* Wallet Address Section */}
                <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-8">
                    <h3 className="text-lg font-medium text-gray-900 mb-4">
                        {t('receiveMoney.walletAddress.title')}
                    </h3>
                    
                    <div className="bg-gray-50 rounded-lg p-4 mb-4">
                        <p className="text-sm text-gray-600 mb-2">{t('receiveMoney.walletAddress.label')}</p>
                        <p className="font-mono text-sm break-all text-gray-900">
                            {walletAddress}
                        </p>
                    </div>

                    <button
                        onClick={handleCopyAddress}
                        className="w-full bg-indigo-600 text-white py-2 px-4 rounded-lg text-sm font-medium hover:bg-indigo-700 transition-colors"
                    >
                        {t('receiveMoney.actions.copyAddress')}
                    </button>
                </div>

                {/* Payment Details Section */}
                <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-8">
                    <h3 className="text-lg font-medium text-gray-900 mb-4">
                        {t('receiveMoney.paymentDetails.title')}
                    </h3>
                    
                    <div className="space-y-4">
                        <div>
                            <label htmlFor="amount" className="block text-sm font-medium text-gray-700 mb-2">
                                {t('receiveMoney.paymentDetails.amount.label')} <span className="text-gray-400">({t('receiveMoney.paymentDetails.amount.optional')})</span>
                            </label>
                            <input
                                id="amount"
                                type="number"
                                step="0.01"
                                min="0"
                                value={amount}
                                onChange={(e) => setAmount(e.target.value)}
                                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all duration-200"
                                placeholder="0.00"
                            />
                        </div>

                        <div>
                            <label htmlFor="memo" className="block text-sm font-medium text-gray-700 mb-2">
                                {t('receiveMoney.paymentDetails.memo.label')} <span className="text-gray-400">({t('receiveMoney.paymentDetails.memo.optional')})</span>
                            </label>
                            <input
                                id="memo"
                                type="text"
                                value={memo}
                                onChange={(e) => setMemo(e.target.value)}
                                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all duration-200"
                                placeholder={t('receiveMoney.paymentDetails.memo.placeholder')}
                            />
                        </div>
                    </div>
                </div>

                {/* Payment Link Section */}
                <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                    <h3 className="text-lg font-medium text-gray-900 mb-4">
                        {t('receiveMoney.paymentLink.title')}
                    </h3>
                    
                    <div className="bg-gray-50 rounded-lg p-4 mb-4">
                        <p className="text-sm text-gray-600 mb-2">{t('receiveMoney.paymentLink.label')}</p>
                        <p className="text-sm break-all text-gray-900">
                            {generatePaymentLink()}
                        </p>
                    </div>

                    <button
                        onClick={() => navigator.clipboard.writeText(generatePaymentLink())}
                        className="w-full bg-gray-100 text-gray-700 py-2 px-4 rounded-lg text-sm font-medium hover:bg-gray-200 transition-colors"
                    >
                        {t('receiveMoney.actions.copyLink')}
                    </button>
                </div>

                {/* Instructions */}
                <div className="mt-8 bg-blue-50 border border-blue-200 rounded-lg p-6">
                    <div className="flex">
                        <div className="flex-shrink-0">
                            <svg className="h-5 w-5 text-blue-400" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                            </svg>
                        </div>
                        <div className="ml-3">
                            <h3 className="text-sm font-medium text-blue-800">
                                {t('receiveMoney.instructions.title')}
                            </h3>
                            <div className="mt-2 text-sm text-blue-700">
                                <ul className="list-disc list-inside space-y-1">
                                    <li>{t('receiveMoney.instructions.step1')}</li>
                                    <li>{t('receiveMoney.instructions.step2')}</li>
                                    <li>{t('receiveMoney.instructions.step3')}</li>
                                    <li>{t('receiveMoney.instructions.step4')}</li>
                                </ul>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
