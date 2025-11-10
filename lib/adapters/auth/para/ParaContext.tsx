/**
 * Para Context
 *
 * React context that wraps Para SDK and provides it to the ParaAdapter
 * This is an infrastructure concern, not a domain concern.
 */

'use client';

import React, { createContext, useContext, ReactNode } from 'react';
import {
    useModal,
    useAccount,
    useWallet,
    useSignMessage,
    useSignTransaction,
    useIssueJwt,
    useLogout as useParaLogout,
} from '@getpara/react-sdk';
import { ParaAdapter } from './ParaAdapter';
import { AuthProviderWrapper } from '@/domain/auth/contexts/AuthContext';

interface ParaContextType {
    adapter: ParaAdapter;
    isConnected: boolean;
    wallet: unknown;
    account: unknown;
}

const ParaContext = createContext<ParaContextType | undefined>(undefined);

interface ParaContextProviderProps {
    children: ReactNode;
}

export const ParaContextProvider: React.FC<ParaContextProviderProps> = ({
    children,
}) => {
    const { openModal } = useModal();
    const accountResult = useAccount();
    const walletResult = useWallet();
    const { signMessageAsync } = useSignMessage();
    const { signTransactionAsync } = useSignTransaction();
    const { issueJwtAsync } = useIssueJwt();
    const { logoutAsync } = useParaLogout();

    // Extract values from query results
    const isConnected = accountResult.isConnected ?? false;
    const account = accountResult.embedded ?? accountResult.external ?? null;
    const wallet = walletResult.data ?? null;

    // Log user data and JWT token when account changes
    React.useEffect(() => {
        const logUserData = async (): Promise<void> => {
            if (isConnected && account && wallet) {
                try {
                    // Get Para JWT token
                    const paraJWT = await issueJwtAsync();
                    const jwtToken =
                        typeof paraJWT === 'string'
                            ? paraJWT
                            : ((paraJWT as { jwt?: string })?.jwt ?? '');

                    // Log user data and token
                    // eslint-disable-next-line no-console
                    const accountData = account as {
                        id?: string;
                        email?: string;
                        phone?: string;
                        name?: string;
                        profileImage?: string;
                        [key: string]: unknown;
                    };
                    console.log('=== Para User Data ===');
                    // eslint-disable-next-line no-console
                    console.log('Account:', {
                        id: accountData.id,
                        email: accountData.email,
                        phone: accountData.phone,
                        name: accountData.name,
                        profileImage: accountData.profileImage,
                    });
                    // eslint-disable-next-line no-console
                    console.log('Wallet:', {
                        id: wallet.id,
                        address: wallet.address,
                        chain: (wallet as { chain?: string })?.chain,
                    });
                    // eslint-disable-next-line no-console
                    console.log('Para JWT Token:', jwtToken);
                    // eslint-disable-next-line no-console
                    console.log('Is Connected:', isConnected);
                    // eslint-disable-next-line no-console
                    console.log('========================');
                } catch (error) {
                    // eslint-disable-next-line no-console
                    console.error('Failed to get Para JWT token:', error);
                }
            }
        };

        void logUserData();
    }, [isConnected, account, wallet, issueJwtAsync]);

    // Create Para SDK interface
    const paraSDK = React.useMemo(
        () => ({
            client: null, // Para client is managed by ParaProvider
            wallet: wallet
                ? {
                      id: wallet.id,
                      address: wallet.address ?? '',
                      chain: (wallet as { chain?: string })?.chain,
                  }
                : null,
            account: account
                ? {
                      id: (account as { id?: string })?.id ?? '',
                      email: (account as { email?: string })?.email,
                      phone: (account as { phone?: string })?.phone,
                      name: (account as { name?: string })?.name,
                      profileImage: (
                          account as {
                              profileImage?: string;
                          }
                      )?.profileImage,
                  }
                : null,
            isConnected,
            openModal: async (): Promise<void> => {
                // Use the latest openModal function from Para's useModal hook
                // This ensures we always use the current modal state
                await openModal();
            },
            signMessage: async (
                walletId: string,
                messageBase64: string
            ): Promise<string> => {
                const result = await signMessageAsync({
                    walletId,
                    messageBase64,
                });
                // Result might be a string or an object with signature
                return typeof result === 'string'
                    ? result
                    : ((result as { signature?: string })?.signature ?? '');
            },
            signTransaction: async (
                walletId: string,
                transaction: unknown
            ): Promise<unknown> => {
                // Para SDK expects rlpEncodedTxBase64 and chainId
                // For now, we'll need to handle this based on the actual transaction format
                // This is a placeholder - actual implementation depends on transaction type
                const tx = transaction as {
                    rlpEncodedTxBase64?: string;
                    chainId?: string;
                    [key: string]: unknown;
                };
                const result = await signTransactionAsync({
                    walletId,
                    rlpEncodedTxBase64: tx.rlpEncodedTxBase64 ?? '',
                    chainId: tx.chainId ?? '',
                });
                return result;
            },
            logout: async (): Promise<void> => {
                await logoutAsync();
            },
            issueJWT: async (): Promise<string> => {
                const result = await issueJwtAsync();
                // Result is { token: string; keyId: string }
                return typeof result === 'string' ? result : result.token;
            },
        }),
        [
            isConnected,
            wallet,
            account,
            openModal, // Include openModal in dependencies to ensure we use latest function
            signMessageAsync,
            signTransactionAsync,
            logoutAsync,
            issueJwtAsync,
        ]
    );

    // Create adapter instance - use useMemo with stable dependencies
    // Only recreate when paraSDK reference changes (which happens when Para state changes)
    const accountId = account ? (account as { id?: string })?.id : null;
    const walletId = wallet?.id;

    const adapter = React.useMemo(() => {
        const paraAdapter = new ParaAdapter(paraSDK);
        paraAdapter.setSDK(paraSDK);
        return paraAdapter;
    }, [
        // Only recreate when these core values change, not on every render
        isConnected,
        accountId, // Use account ID as dependency instead of whole account object
        walletId, // Use wallet ID as dependency instead of whole wallet object
    ]);

    // Update adapter's SDK reference immediately when Para state changes
    // This ensures the adapter always has the latest state without recreating it
    React.useEffect(() => {
        adapter.setSDK(paraSDK);
    }, [adapter, paraSDK]);

    return (
        <ParaContext.Provider
            value={{
                adapter,
                isConnected,
                wallet,
                account,
            }}
        >
            <ParaAdapterProvider adapter={adapter}>
                {children}
            </ParaAdapterProvider>
        </ParaContext.Provider>
    );
};

/**
 * Component that provides the Para adapter to AuthProviderWrapper
 * This bridges ParaContext (adapter layer) with AuthContext (domain layer)
 */
const ParaAdapterProvider: React.FC<{
    children: ReactNode;
    adapter: ParaAdapter;
}> = ({ children, adapter }) => {
    return (
        <AuthProviderWrapper adapter={adapter}>{children}</AuthProviderWrapper>
    );
};

export const useParaContext = (): ParaContextType => {
    const context = useContext(ParaContext);
    if (context === undefined) {
        throw new Error(
            'useParaContext must be used within ParaContextProvider'
        );
    }
    return context;
};
