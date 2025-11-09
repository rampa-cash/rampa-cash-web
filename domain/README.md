# Domain Layer - Port and Adapters Architecture

## Overview

The domain layer contains all **business logic** and **port definitions** (interfaces). It is completely independent of external services and SDKs, following the **Port and Adapters (Hexagonal Architecture)** pattern.

---

## 📁 Folder Structure

```
domain/
└── auth/                          # DOMAIN LAYER (Application Core)
    ├── interfaces/                 # PORT DEFINITIONS
    │   └── authentication-service.interface.ts  # ← PORT (Interface)
    │
    ├── services/                   # DOMAIN SERVICES (Use PORT)
    │   ├── auth.service.ts        # ← Uses PORT, not adapter
    │   └── api-client.ts          # ← Uses PORT for token injection
    │
    ├── contexts/                  # REACT CONTEXTS (Use PORT)
    │   └── AuthContext.tsx        # ← Uses PORT via adapter injection
    │
    ├── guards/                    # DOMAIN GUARDS (Use PORT)
    │   └── AuthGuard.tsx          # ← Route protection using PORT
    │
    ├── hooks/                     # REACT HOOKS (Use PORT)
    │   └── useAuth.ts             # ← Convenience hooks
    │
    ├── types.ts                   # Domain Types
    └── index.ts                   # Public API exports
```

---

## 🎯 Key Components

### 1. PORT (Interface) - Domain Layer

**Location:** `domain/auth/interfaces/authentication-service.interface.ts`

**Purpose:** Defines the contract for authentication operations. This is what the application **needs** from authentication, not how it's implemented.

**Key Elements:**

- `IAuthPort` interface - The PORT contract
- Domain types: `AuthUser`, `AuthToken`, `LoginOptions`, `AuthError`

**Characteristics:**

- ✅ **Technology-agnostic** - No mention of Para SDK, HTTP, or specific implementations
- ✅ **Business-focused** - Methods represent business operations (login, logout, getUser, etc.)
- ✅ **Stable** - Changes to external providers don't require changes here

```typescript
// PORT Definition
export interface IAuthPort {
    initialize(): Promise<void>;
    login(options?: LoginOptions): Promise<AuthUser>;
    logout(): Promise<void>;
    getUser(): Promise<AuthUser | null>;
    getToken(): Promise<string | null>;
    // ... other methods
}
```

---

### 2. Domain Services (Use PORT)

**Location:** `domain/auth/services/`

**Purpose:** Domain logic that uses authentication but doesn't know about specific providers.

**Key Services:**

- `auth.service.ts` - General auth business logic using PORT
- `api-client.ts` - API client that injects tokens from PORT

**How They Use PORT:**

```typescript
export class AuthService {
    private adapter: IAuthPort; // ← Uses PORT (interface)

    constructor(adapter: IAuthPort) {
        this.adapter = adapter;
    }

    async login(options?: LoginOptions): Promise<AuthUser> {
        // Uses PORT, doesn't know about Para SDK
        return await this.adapter.login(options);
    }
}
```

---

### 3. React Contexts (Use PORT)

**Location:** `domain/auth/contexts/`

**Purpose:** React context that provides authentication state and methods to components.

**Key Files:**

- `AuthContext.tsx` - Main auth context that uses PORT via adapter injection

**How It Works:**

```typescript
export const AuthProvider: React.FC<{ adapter: IAuthPort }> = ({
    children,
    adapter, // ← PORT injected from infrastructure
}) => {
    // Uses adapter (which implements PORT)
    const login = useCallback(async () => {
        await adapter.login();
    }, [adapter]);

    // ... provides to components
};
```

---

### 4. Guards (Use PORT)

**Location:** `domain/auth/guards/`

**Purpose:** Route protection based on authentication status.

**Key Files:**

- `AuthGuard.tsx` - Protects routes using auth context (which uses PORT)

---

## 🔄 Data Flow

### Authentication Flow

```
1. Component
   └─> useAuth() hook
       └─> AuthContext (Domain)
           └─> Uses IAuthPort (PORT)
               └─> ParaAdapter (Infrastructure)
                   └─> Para SDK
```

### Dependency Direction

```
Domain Layer (Business Logic)
    ↓ depends on
PORT (Interface)
    ↑ implements
Infrastructure Layer (Adapters)
```

**Key Principle:** Domain depends on PORT, not on adapters!

---

## 🎨 Architecture Principles

### 1. Dependency Inversion Principle (DIP)

**Domain depends on abstractions (PORT), not concretions (ADAPTER)**

```
❌ BAD (Tight Coupling):
Domain → ParaAdapter (concrete class)

✅ GOOD (Loose Coupling):
Domain → IAuthPort (interface/PORT)
Infrastructure → ParaAdapter implements IAuthPort
```

### 2. Separation of Concerns

- **Domain Layer:** Business logic, validation rules, session management
- **Infrastructure Layer:** External service integration, SDK usage

### 3. Single Responsibility

- **PORT:** Defines what authentication operations are needed
- **ADAPTER:** Implements how those operations work with a specific provider
- **Domain Services:** Orchestrate authentication in business context

---

## 🔀 Switching Authentication Providers

To switch from Para SDK to another provider (e.g., Magic, Auth0):

### Step 1: Create New Adapter (Infrastructure)

```typescript
// lib/adapters/auth/magic/MagicAdapter.ts
import { IAuthPort } from '@/domain/auth/interfaces/authentication-service.interface';

export class MagicAdapter implements IAuthPort {
    // Implement all IAuthPort methods
}
```

### Step 2: Update Provider (Only Change!)

```typescript
// pages/_app.tsx
import { MagicContextProvider } from '@/lib/adapters/auth/magic';

// Use MagicContextProvider instead of ParaContextProvider
```

**That's it!** No changes needed in:

- ✅ Domain services
- ✅ Contexts
- ✅ Guards
- ✅ Hooks
- ✅ Any other domain code

---

## ✅ Benefits of This Architecture

1. **Provider Independence**
    - Domain code doesn't know about Para SDK
    - Easy to switch providers or support multiple simultaneously

2. **Testability**
    - Mock PORT interface for unit tests
    - Test domain logic without external dependencies

3. **Maintainability**
    - Changes to Para SDK only affect adapter
    - Domain logic remains stable

4. **Scalability**
    - Can add multiple adapters (Para SDK + Magic + Auth0)
    - Use factory pattern to select adapter based on user/provider

5. **DDD Compliance**
    - Domain layer is pure business logic
    - Infrastructure concerns isolated

---

## 📊 Current Implementation Status

### ✅ Correctly Implemented

- ✅ PORT interface defined in domain layer (`interfaces/`)
- ✅ ADAPTER implementation in infrastructure layer (`lib/adapters/`)
- ✅ Domain services use PORT via dependency injection
- ✅ React contexts use PORT via adapter injection
- ✅ No direct dependencies on Para SDK in domain layer

---

## 📚 References

- [Ports and Adapters Pattern (Hexagonal Architecture)](https://alistair.cockburn.us/hexagonal-architecture/)
- [Dependency Inversion Principle](https://en.wikipedia.org/wiki/Dependency_inversion_principle)
- [Domain-Driven Design](https://martinfowler.com/bliki/DomainDrivenDesign.html)

---

## 🎯 Summary

The domain layer follows Port and Adapters architecture:

- **PORT** = `IAuthPort` interface (`domain/auth/interfaces/`)
- **ADAPTER** = `ParaAdapter` implementation (`lib/adapters/auth/para/`)
- **Binding** = React context injection in `_app.tsx`
- **Usage** = Domain services/contexts use PORT, not adapter directly

This architecture ensures the domain remains independent of external authentication providers, making the system flexible, testable, and maintainable.
