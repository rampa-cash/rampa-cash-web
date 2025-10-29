# Grouped Authentication Implementation Guide

This document explains how to implement and use grouped authentication connections with Web3Auth in the Rampa Cash application.

## Overview

Grouped connections allow multiple authentication methods (Google, Custom JWT) to be used for authentication. This provides flexible authentication options for users.

## Setup Requirements

### 1. Web3Auth Dashboard Configuration

Before using grouped connections, you need to configure them in the Web3Auth Dashboard:

1. **Create Individual Connection:**
   - `rampa-w3a-google` (Google OAuth)

2. **Create Grouped Connection:**
   - Group Name: `rampa-w3a-group-connection`
   - Link the Google connection

**Note:** Custom JWT authentication is handled directly through your backend API, not through Web3Auth connections.

### 2. Frontend Configuration

The configuration is already set up in `features/auth/config/web3auth.config.ts`:

```typescript
export const web3AuthConfig: Web3AuthOptions = {
    clientId,
    web3AuthNetwork: WEB3AUTH_NETWORK.SAPPHIRE_DEVNET,
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
                    // Custom JWT is handled directly through backend API
                },
            },
        },
    },
};
```

## Usage

### 1. Using the Web3Auth Context

The `Web3AuthContext` provides several authentication methods:

```typescript
import { useWeb3Auth } from '@/features/auth/contexts/Web3AuthContext';

function MyComponent() {
    const {
        user,
        isAuthenticated,
        isLoading,
        login,                    // Opens modal with all options
        loginWithGoogle,          // Direct Google login
        loginWithEmail,           // Direct email login
        loginWithCustomJWT,       // Direct custom JWT login
        logout,
        error,
        clearError,
    } = useWeb3Auth();

    // Your component logic here
}
```

### 2. Authentication Methods

#### Generic Login (Modal)
```typescript
const handleLogin = async () => {
    try {
        await login(); // Opens Web3Auth modal
    } catch (error) {
        console.error('Login failed:', error);
    }
};
```

#### Google Login
```typescript
const handleGoogleLogin = async () => {
    try {
        await loginWithGoogle();
    } catch (error) {
        console.error('Google login failed:', error);
    }
};
```

#### Email Passwordless Login
```typescript
const handleEmailLogin = async (email: string) => {
    try {
        await loginWithEmail(email);
    } catch (error) {
        console.error('Email login failed:', error);
    }
};
```

#### Custom JWT Login
```typescript
const handleCustomJWTLogin = async (jwtToken: string) => {
    try {
        await loginWithCustomJWT(jwtToken);
    } catch (error) {
        console.error('Custom JWT login failed:', error);
    }
};
```

### 3. Example Component

See `components/auth/GroupedAuthExample.tsx` for a complete working example.

## How It Works

### 1. Authentication Flow

1. **User Authentication:** User authenticates with any supported method
2. **Web3Auth Processing:** Web3Auth processes the authentication using the grouped connection
3. **Wallet Generation:** Same wallet address is generated regardless of auth method
4. **Token Exchange:** Web3Auth JWT is exchanged for custom backend JWT
5. **API Access:** Custom JWT is used for all backend API calls

### 2. Key Benefits

- **Unified Experience:** Same wallet address across all auth methods
- **Flexible Authentication:** Multiple ways to authenticate
- **Backend Control:** Custom JWT tokens for API authorization
- **User Convenience:** Users can switch between auth methods

### 3. Token Management

- **Web3Auth Token:** Used for Web3Auth operations (hidden from user)
- **Custom Backend JWT:** Used for API calls (stored securely)
- **Automatic Refresh:** Handled by the Web3Auth service

## Configuration Details

### Connection IDs

- **Group ID:** `rampa-w3a-group-connection`
- **Google:** `rampa-w3a-google`
- **Custom JWT:** Handled directly through backend API (no Web3Auth connection needed)

### Backend Integration

The implementation calls your backend at:
- **Endpoint:** `POST /auth/web3auth/validate`
- **Payload:** `{ token: web3AuthJWT }`
- **Response:** `{ accessToken: customJWT, user: userData }`

### Error Handling

All authentication methods include comprehensive error handling:
- Network errors
- Authentication failures
- Token validation errors
- User cancellation

## Testing

Use the `GroupedAuthExample` component to test all authentication methods:

```typescript
import GroupedAuthExample from '@/components/auth/GroupedAuthExample';

function TestPage() {
    return (
        <Web3AuthProvider>
            <GroupedAuthExample />
        </Web3AuthProvider>
    );
}
```

## Troubleshooting

### Common Issues

1. **Connection Not Found:** Ensure all connection IDs match the Web3Auth Dashboard
2. **Group Not Configured:** Verify the grouped connection is set up in the dashboard
3. **Token Exchange Failed:** Check backend endpoint and Web3Auth token validity
4. **Different Wallet Addresses:** Ensure all connections use the same grouped connection ID

### Debug Information

The implementation includes comprehensive logging:
- Web3Auth token details
- Backend response data
- User information
- Error messages

Check the browser console for detailed debug information.

## Security Considerations

1. **Token Storage:** Custom JWT tokens are stored securely in localStorage
2. **Token Validation:** Automatic expiration checking and refresh
3. **Error Handling:** Secure error messages without sensitive data exposure
4. **Backend Validation:** All Web3Auth tokens are validated by your backend

## Next Steps

1. Configure the connections in Web3Auth Dashboard
2. Test with the example component
3. Integrate into your application
4. Customize the UI as needed
5. Add additional authentication methods if required

For more information, refer to the [MetaMask Web3Auth documentation](https://docs.metamask.io/embedded-wallets/authentication/group-connections).
