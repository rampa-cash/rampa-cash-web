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
    const { isConnected, data: account } = useAccount();
    const { data: wallet } = useWallet();
    const { mutateAsync: signMessageAsync } = useSignMessage();
    const { mutateAsync: signTransactionAsync } = useSignTransaction();
    const { mutateAsync: issueJwtAsync } = useIssueJwt();
    const { mutateAsync: logoutAsync } = useParaLogout();

    // Create Para SDK interface
    const paraSDK = React.useMemo(
        () => ({
            client: null, // Para client is managed by ParaProvider
            wallet: wallet
                ? {
                      id: wallet.id,
                      address: wallet.address,
                      chain: wallet.chain,
                  }
                : null,
            account: account
                ? {
                      id: account.id,
                      email: account.email,
                      phone: account.phone,
                      name: account.name,
                      profileImage: account.profileImage,
                  }
                : null,
            isConnected,
            openModal: async (): Promise<void> => {
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
                return result.signature ?? result;
            },
            signTransaction: async (
                walletId: string,
                transaction: unknown
            ): Promise<unknown> => {
                const result = await signTransactionAsync({
                    walletId,
                    transaction,
                });
                return result;
            },
            logout: async (): Promise<void> => {
                await logoutAsync();
            },
            issueJWT: async (): Promise<string> => {
                const result = await issueJwtAsync();
                return result.jwt ?? result;
            },
        }),
        [
            isConnected,
            wallet,
            account,
            openModal,
            signMessageAsync,
            signTransactionAsync,
            logoutAsync,
            issueJwtAsync,
        ]
    );

    // Create adapter instance
    const adapter = React.useMemo(() => {
        const paraAdapter = new ParaAdapter(paraSDK);
        paraAdapter.setSDK(paraSDK);
        return paraAdapter;
    }, [paraSDK]);

    return (
        <ParaContext.Provider
            value={{
                adapter,
                isConnected,
                wallet,
                account,
            }}
        >
            {children}
        </ParaContext.Provider>
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
