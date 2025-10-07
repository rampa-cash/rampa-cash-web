// Components
export { WalletBalance } from './components/WalletBalance';

// API Client
export { WalletApiClient } from './api-client';

// Services
export { WalletService } from './services/wallet.service';

// Hooks
export { useWallet } from './hooks/useWallet';

// Types
export type {
    Wallet,
    WalletBalance as WalletBalanceType,
    CreateWalletRequest,
    UpdateWalletRequest,
    ConnectWalletRequest,
    WalletResponse,
    TokenBalance,
    WalletBalanceResponse,
    TransferRequest,
    WalletState,
    SwapRequest,
    SwapResponse,
    TransactionFee,
    WalletConnectionRequest,
    WalletConnectionResponse,
    WalletBalanceProps,
    WalletConnectProps,
    WalletTransferProps,
} from './types';
