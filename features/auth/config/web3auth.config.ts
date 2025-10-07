import { Web3AuthOptions } from '@web3auth/modal';
import { WEB3AUTH_NETWORK } from '@web3auth/base';

// Web3Auth Client ID from dashboard
const clientId = process.env.NEXT_PUBLIC_WEB3AUTH_CLIENT_ID || '';

export const web3AuthConfig: Web3AuthOptions = {
    clientId,
    web3AuthNetwork: WEB3AUTH_NETWORK.SAPPHIRE_DEVNET,
    enableLogging: true,
};
