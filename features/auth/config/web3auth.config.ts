import { Web3AuthOptions, WALLET_CONNECTORS } from '@web3auth/modal';
import { WEB3AUTH_NETWORK } from '@web3auth/base';

// Web3Auth Client ID from dashboard
const clientId = process.env.NEXT_PUBLIC_WEB3AUTH_CLIENT_ID || '';

export const web3AuthConfig: Web3AuthOptions = {
    clientId,
    web3AuthNetwork: WEB3AUTH_NETWORK.SAPPHIRE_DEVNET,
    // Disable logging to reduce telemetry and analytics
    enableLogging: false,
    modalConfig: {
        connectors: {
            [WALLET_CONNECTORS.AUTH]: {
                label: "auth",
                loginMethods: {
                    google: {
                        name: "Google Login",
                        authConnectionId: "rampa-w3a-google",
                        groupedAuthConnectionId: "rampa-w3a-group-connection",
                    },
                },
            },
        },
    },
};
