// Contact domain types aligned with data model and OpenAPI specification

export interface Contact {
    id: string;
    ownerId: string;
    contactUserId?: string | undefined;
    email?: string | undefined;
    phone?: string | undefined;
    displayName: string;
    walletAddress?: string | undefined;
    isAppUser: boolean;
    createdAt: string;
    updatedAt: string;
}

export interface AddContactRequest {
    email?: string;
    phone?: string;
    displayName: string;
}

export interface UpdateContactRequest {
    displayName?: string;
    email?: string;
    phone?: string;
    walletAddress?: string;
}

export interface ContactResponse {
    id: string;
    contactUserId?: string;
    displayName: string;
    email?: string;
    phone?: string;
    walletAddress?: string;
    isAppUser: boolean;
    createdAt: string;
    updatedAt: string;
}

export interface ContactListResponse {
    contacts: ContactResponse[];
}

export interface ContactStats {
    totalContacts: number;
    appUserContacts: number;
    nonAppUserContacts: number;
}

export interface ContactSyncResponse {
    message: string;
    syncedCount: number;
    syncedContacts: Array<{
        id: string;
        displayName: string;
        isAppUser: boolean;
        walletAddress?: string;
    }>;
}

export interface ContactState {
    contacts: Contact[];
    isLoading: boolean;
    error: string | null;
    filters: {
        search: string;
        type: 'all' | 'app' | 'non-app';
    };
}

export interface ContactListProps {
    onContactSelect?: (contact: Contact) => void;
    onContactEdit?: (contact: Contact) => void;
    onContactDelete?: (contactId: string) => void;
    className?: string;
}
