import React, { useEffect, ReactNode } from 'react';
import { useRouter } from 'next/router';
import { useWeb3Auth } from '../hooks/useWeb3Auth';
import { FEATURE_FLAGS } from '@/lib/constants';

interface AuthGuardProps {
    children: ReactNode;
    fallback?: ReactNode;
    redirectTo?: string;
    requireAuth?: boolean;
}

/**
 * AuthGuard component that protects routes based on authentication status
 *
 * @param children - Components to render when auth requirements are met
 * @param fallback - Component to render while loading or when auth fails
 * @param redirectTo - Route to redirect to when auth fails (default: '/')
 * @param requireAuth - Whether authentication is required (default: true)
 */
export const AuthGuard: React.FC<AuthGuardProps> = ({
    children,
    fallback,
    redirectTo = '/',
    requireAuth = true,
}) => {
    const router = useRouter();
    const { isAuthenticated, isLoading, error } = useWeb3Auth();

    useEffect(() => {
        // Don't redirect if feature is disabled
        if (!FEATURE_FLAGS.showLoginButton) {
            return;
        }

        // Don't redirect while loading
        if (isLoading) {
            return;
        }

        // Handle authentication requirements
        if (requireAuth && !isAuthenticated) {
            // Redirect to home page if not authenticated
            router.push(redirectTo);
        } else if (!requireAuth && isAuthenticated) {
            // Redirect authenticated users away from auth pages
            router.push('/dashboard');
        }
    }, [isAuthenticated, isLoading, router, redirectTo, requireAuth]);

    // Don't render if feature is disabled
    if (!FEATURE_FLAGS.showLoginButton) {
        return <>{children}</>;
    }

    // Show loading state
    if (isLoading) {
        return (
            fallback || (
                <div className="min-h-screen flex items-center justify-center">
                    <div className="text-center">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600 mx-auto"></div>
                        <p className="mt-2 text-gray-600">Loading...</p>
                    </div>
                </div>
            )
        );
    }

    // Show error state
    if (error) {
        return (
            fallback || (
                <div className="min-h-screen flex items-center justify-center">
                    <div className="text-center">
                        <div className="text-red-500 mb-4">
                            <svg
                                className="w-12 h-12 mx-auto"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.732-.833-2.5 0L4.268 19.5c-.77.833.192 2.5 1.732 2.5z"
                                />
                            </svg>
                        </div>
                        <h2 className="text-xl font-semibold text-gray-900 mb-2">
                            Authentication Error
                        </h2>
                        <p className="text-gray-600 mb-4">{error}</p>
                        <button
                            onClick={() => router.push('/')}
                            className="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700 transition-colors"
                        >
                            Go Home
                        </button>
                    </div>
                </div>
            )
        );
    }

    // Check authentication requirements
    if (requireAuth && !isAuthenticated) {
        return (
            fallback || (
                <div className="min-h-screen flex items-center justify-center">
                    <div className="text-center">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600 mx-auto"></div>
                        <p className="mt-2 text-gray-600">Redirecting...</p>
                    </div>
                </div>
            )
        );
    }

    // Render protected content
    return <>{children}</>;
};

/**
 * Higher-order component for protecting pages
 */
export const withAuth = <P extends object>(
    Component: React.ComponentType<P>,
    options: Omit<AuthGuardProps, 'children'> = {}
) => {
    const WrappedComponent = (props: P) => (
        <AuthGuard {...options}>
            <Component {...props} />
        </AuthGuard>
    );

    WrappedComponent.displayName = `withAuth(${Component.displayName || Component.name})`;
    return WrappedComponent;
};

/**
 * Hook for checking if current route requires authentication
 */
export const useRequiresAuth = (): boolean => {
    const router = useRouter();

    // Routes that require authentication
    const protectedRoutes = [
        '/dashboard',
        '/transactions',
        '/contacts',
        '/ramp/onramp',
        '/ramp/offramp',
        '/visa-card',
    ];

    return protectedRoutes.some(route => router.pathname.startsWith(route));
};

/**
 * Hook for checking if current route should redirect authenticated users
 */
export const useRedirectsAuth = (): boolean => {
    const router = useRouter();

    // Routes that should redirect authenticated users
    const authRoutes = ['/auth/login', '/auth/signup'];

    return authRoutes.some(route => router.pathname.startsWith(route));
};

export default AuthGuard;
