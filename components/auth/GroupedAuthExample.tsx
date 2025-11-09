import React from 'react';
import { useAuth } from '@/domain/auth';

/**
 * Example component demonstrating authentication with Para
 * This shows how to use the port-based authentication system
 */
export const GroupedAuthExample: React.FC = () => {
    const {
        user,
        isAuthenticated,
        isLoading,
        login,
        logout,
        error,
        clearError,
    } = useAuth();

    if (isLoading) {
        return (
            <div className="flex items-center justify-center p-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                <span className="ml-2">Loading...</span>
            </div>
        );
    }

    if (isAuthenticated && user) {
        return (
            <div className="max-w-md mx-auto p-6 bg-white rounded-lg shadow-md">
                <h2 className="text-2xl font-bold mb-4 text-green-600">
                    ✅ Authenticated Successfully!
                </h2>

                <div className="space-y-2 mb-6">
                    <p>
                        <strong>Name:</strong>{' '}
                        {user.name ?? `${user.firstName} ${user.lastName}`}
                    </p>
                    <p>
                        <strong>Email:</strong> {user.email}
                    </p>
                    <p>
                        <strong>User ID:</strong> {user.id}
                    </p>
                    <p>
                        <strong>Auth Provider:</strong>{' '}
                        {user.authProvider ?? 'Para'}
                    </p>
                    {user.walletAddress && (
                        <p>
                            <strong>Wallet:</strong>{' '}
                            {user.walletAddress.slice(0, 6)}...
                            {user.walletAddress.slice(-4)}
                        </p>
                    )}
                    {user.status && (
                        <p>
                            <strong>Status:</strong> {user.status}
                        </p>
                    )}
                </div>

                <button
                    onClick={logout}
                    className="w-full bg-red-600 text-white py-2 px-4 rounded hover:bg-red-700 transition-colors"
                >
                    Logout
                </button>
            </div>
        );
    }

    return (
        <div className="max-w-md mx-auto p-6 bg-white rounded-lg shadow-md">
            <h2 className="text-2xl font-bold mb-6 text-center">
                Para Authentication Demo
            </h2>

            <p className="text-gray-600 mb-6 text-center">
                Connect your wallet using Para SDK
            </p>

            {error && (
                <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
                    {error.message}
                    <button
                        onClick={clearError}
                        className="ml-2 text-red-500 hover:text-red-700"
                    >
                        ✕
                    </button>
                </div>
            )}

            <div className="space-y-4">
                {/* Login Button */}
                <button
                    onClick={() => login()}
                    className="w-full bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700 transition-colors"
                >
                    🔐 Connect Wallet with Para
                </button>
            </div>

            <div className="mt-6 p-4 bg-gray-100 rounded text-sm text-gray-600">
                <h3 className="font-semibold mb-2">How it works:</h3>
                <ul className="space-y-1 text-xs">
                    <li>• Uses Para SDK for authentication</li>
                    <li>• Port and Adapter pattern for flexibility</li>
                    <li>• Easy to switch between auth providers</li>
                    <li>• Secure token management and validation</li>
                </ul>
            </div>
        </div>
    );
};

export default GroupedAuthExample;
