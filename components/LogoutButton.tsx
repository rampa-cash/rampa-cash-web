import { useTranslation } from 'next-i18next';
import { useAuth } from '@/domain/auth';

interface LogoutButtonProps {
    variant?: 'desktop' | 'mobile';
    className?: string;
}

export const LogoutButton = ({
    variant = 'desktop',
    className = '',
}: LogoutButtonProps): JSX.Element | null => {
    const { t } = useTranslation('common');
    const { isAuthenticated, isLoading, logout } = useAuth();

    // Only show when authenticated
    if (!isAuthenticated) {
        return null;
    }

    const handleLogout = async (): Promise<void> => {
        try {
            await logout();
        } catch (error) {
            // eslint-disable-next-line no-console
            console.error('Failed to logout:', error);
        }
    };

    // Base classes
    const baseClasses =
        'bg-red-600 hover:bg-red-700 text-white font-medium transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100';

    // Variant-specific classes
    const variantClasses =
        variant === 'desktop'
            ? 'px-4 py-2 rounded-lg hover:scale-105'
            : 'px-3 py-1 text-xs rounded-md';

    const buttonClasses = `${baseClasses} ${variantClasses} ${className}`;

    return (
        <button
            onClick={handleLogout}
            disabled={isLoading}
            className={buttonClasses}
        >
            {isLoading ? (
                variant === 'desktop' ? (
                    <div className="flex items-center">
                        <svg
                            className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
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
                        {t('auth.loggingOut') || 'Logging out...'}
                    </div>
                ) : (
                    t('auth.loggingOut') || 'Logging out...'
                )
            ) : variant === 'desktop' ? (
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
                            d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
                        />
                    </svg>
                    {t('auth.logout') || 'Logout'}
                </div>
            ) : (
                t('auth.logout') || 'Logout'
            )}
        </button>
    );
};

export default LogoutButton;
