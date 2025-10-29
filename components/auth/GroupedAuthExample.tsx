import React, { useState } from 'react';
import { useWeb3Auth } from '@/features/auth/contexts/Web3AuthContext';

/**
 * Example component demonstrating grouped authentication connections
 * This shows how to use different authentication methods that all link to the same wallet address
 */
export const GroupedAuthExample: React.FC = () => {
    const {
        user,
        isAuthenticated,
        isLoading,
        login,
        loginWithGoogle,
        loginWithCustomJWT,
        logout,
        error,
        clearError,
    } = useWeb3Auth();

    const [customJWT, setCustomJWT] = useState('');

    const handleCustomJWTLogin = async (e: React.FormEvent): Promise<void> => {
        e.preventDefault();
        if (!customJWT) return;
        
        try {
            await loginWithCustomJWT(customJWT);
        } catch (err) {
            // eslint-disable-next-line no-console
            console.error('Custom JWT login failed:', err);
        }
    };

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
                    <p><strong>Name:</strong> {user.name ?? `${user.firstName} ${user.lastName}`}</p>
                    <p><strong>Email:</strong> {user.email}</p>
                    <p><strong>User ID:</strong> {user.id}</p>
                    <p><strong>Auth Provider:</strong> {user.authProvider}</p>
                    <p><strong>Status:</strong> {user.status}</p>
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
                Grouped Authentication Demo
            </h2>
            
            <p className="text-gray-600 mb-6 text-center">
                Google login and Custom JWT authentication methods
            </p>

            {error && (
                <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
                    {error}
                    <button
                        onClick={clearError}
                        className="ml-2 text-red-500 hover:text-red-700"
                    >
                        ✕
                    </button>
                </div>
            )}

            <div className="space-y-4">
                {/* Generic Login (opens modal) */}
                <button
                    onClick={login}
                    className="w-full bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700 transition-colors"
                >
                    🔐 Open Login Modal
                </button>

                {/* Google Login */}
                <button
                    onClick={loginWithGoogle}
                    className="w-full bg-red-600 text-white py-2 px-4 rounded hover:bg-red-700 transition-colors"
                >
                    🔍 Login with Google
                </button>


                {/* Custom JWT Login */}
                <form onSubmit={handleCustomJWTLogin} className="space-y-2">
                    <textarea
                        value={customJWT}
                        onChange={(e) => setCustomJWT(e.target.value)}
                        placeholder="Enter your custom JWT token"
                        className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 h-20 resize-none"
                        required
                    />
                    <button
                        type="submit"
                        className="w-full bg-purple-600 text-white py-2 px-4 rounded hover:bg-purple-700 transition-colors"
                    >
                        🔑 Login with Custom JWT
                    </button>
                </form>
            </div>

            <div className="mt-6 p-4 bg-gray-100 rounded text-sm text-gray-600">
                <h3 className="font-semibold mb-2">How it works:</h3>
                <ul className="space-y-1 text-xs">
                    <li>• Google login uses Web3Auth grouped connection</li>
                    <li>• Custom JWT validates directly with backend</li>
                    <li>• Both methods result in custom JWT for API calls</li>
                    <li>• Secure token management and validation</li>
                </ul>
            </div>
        </div>
    );
};

export default GroupedAuthExample;
