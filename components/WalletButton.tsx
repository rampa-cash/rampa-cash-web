import { useAuth } from '@/domain/auth';

interface WalletButtonProps {
    variant?: 'desktop' | 'mobile';
    className?: string;
}

export const WalletButton = ({
    variant = 'desktop',
    className = '',
}: WalletButtonProps): JSX.Element | null => {
    const { isAuthenticated, user, openWalletModal } = useAuth();

    // Only show when authenticated
    if (!isAuthenticated) {
        return null;
    }

    const handleOpenWallet = async (): Promise<void> => {
        try {
            // eslint-disable-next-line no-console
            console.log('WalletButton: Opening wallet modal...');
            await openWalletModal();
            // eslint-disable-next-line no-console
            console.log('WalletButton: Wallet modal opened successfully');
        } catch (error) {
            // eslint-disable-next-line no-console
            console.error('WalletButton: Failed to open wallet modal:', error);
            // You might want to show a user-friendly error message here
        }
    };

    // Get wallet address for display
    const walletAddress = user?.walletAddress;
    const displayAddress = walletAddress
        ? `${walletAddress.slice(0, 6)}...${walletAddress.slice(-4)}`
        : 'Wallet';

    // Base classes
    const baseClasses =
        'bg-indigo-600 hover:bg-indigo-700 text-white font-medium transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed';

    // Variant-specific classes
    const variantClasses =
        variant === 'desktop'
            ? 'px-4 py-2 rounded-lg hover:scale-105'
            : 'px-3 py-1 text-xs rounded-md';

    const buttonClasses = `${baseClasses} ${variantClasses} ${className}`;

    return (
        <button onClick={handleOpenWallet} className={buttonClasses}>
            {variant === 'desktop' ? (
                <div className="flex items-center">
                    <svg
                        className="w-4 h-4 mr-2"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z"
                        />
                    </svg>
                    {displayAddress}
                </div>
            ) : (
                displayAddress
            )}
        </button>
    );
};

export default WalletButton;
