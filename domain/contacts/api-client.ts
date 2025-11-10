import { serverRequest } from '../../lib/api-client';
import { API_ENDPOINTS } from '../../lib/constants';
import type {
    AddContactRequest,
    UpdateContactRequest,
    ContactResponse,
    ContactStats,
    ContactSyncResponse,
} from './types';

/**
 * Contact feature-specific API client
 * Handles all contact-related API calls to the backend
 * Aligned with OpenAPI specification
 */
export class ContactApiClient {
    /**
     * Get user contacts
     * GET /contacts
     */
    static async getContacts(token: string): Promise<ContactResponse[]> {
        return serverRequest<ContactResponse[]>(
            'GET',
            API_ENDPOINTS.contacts.list,
            token
        );
    }

    /**
     * Add new contact
     * POST /contacts
     */
    static async addContact(
        data: AddContactRequest,
        token: string
    ): Promise<ContactResponse> {
        return serverRequest<ContactResponse>(
            'POST',
            API_ENDPOINTS.contacts.create,
            token,
            data
        );
    }

    /**
     * Get app user contacts
     * GET /contacts/app-users
     */
    static async getAppUserContacts(token: string): Promise<ContactResponse[]> {
        return serverRequest<ContactResponse[]>(
            'GET',
            API_ENDPOINTS.contacts.appUsers,
            token
        );
    }

    /**
     * Get non-app user contacts
     * GET /contacts/non-app-users
     */
    static async getNonAppUserContacts(
        token: string
    ): Promise<ContactResponse[]> {
        return serverRequest<ContactResponse[]>(
            'GET',
            API_ENDPOINTS.contacts.nonAppUsers,
            token
        );
    }

    /**
     * Search contacts
     * GET /contacts/search?q={query}
     */
    static async searchContacts(
        query: string,
        token: string
    ): Promise<ContactResponse[]> {
        return serverRequest<ContactResponse[]>(
            'GET',
            `${API_ENDPOINTS.contacts.search}?q=${encodeURIComponent(query)}`,
            token
        );
    }

    /**
     * Get contact statistics
     * GET /contacts/stats
     */
    static async getContactStats(token: string): Promise<ContactStats> {
        return serverRequest<ContactStats>(
            'GET',
            API_ENDPOINTS.contacts.stats,
            token
        );
    }

    /**
     * Sync contacts with app users
     * GET /contacts/sync
     */
    static async syncContacts(token: string): Promise<ContactSyncResponse> {
        return serverRequest<ContactSyncResponse>(
            'GET',
            API_ENDPOINTS.contacts.sync,
            token
        );
    }

    /**
     * Get contact by email
     * GET /contacts/by-email/{email}
     */
    static async getContactByEmail(
        email: string,
        token: string
    ): Promise<ContactResponse> {
        return serverRequest<ContactResponse>(
            'GET',
            `${API_ENDPOINTS.contacts.byEmail}/${encodeURIComponent(email)}`,
            token
        );
    }

    /**
     * Get contact by phone
     * GET /contacts/by-phone/{phone}
     */
    static async getContactByPhone(
        phone: string,
        token: string
    ): Promise<ContactResponse> {
        return serverRequest<ContactResponse>(
            'GET',
            `${API_ENDPOINTS.contacts.byPhone}/${encodeURIComponent(phone)}`,
            token
        );
    }

    /**
     * Get contact by wallet address
     * GET /contacts/by-wallet/{walletAddress}
     */
    static async getContactByWallet(
        walletAddress: string,
        token: string
    ): Promise<ContactResponse> {
        return serverRequest<ContactResponse>(
            'GET',
            `${API_ENDPOINTS.contacts.byWallet}/${encodeURIComponent(walletAddress)}`,
            token
        );
    }

    /**
     * Get specific contact
     * GET /contacts/{contactId}
     */
    static async getContact(
        contactId: string,
        token: string
    ): Promise<ContactResponse> {
        return serverRequest<ContactResponse>(
            'GET',
            `${API_ENDPOINTS.contacts.get}/${contactId}`,
            token
        );
    }

    /**
     * Update contact
     * PUT /contacts/{contactId}
     */
    static async updateContact(
        contactId: string,
        data: UpdateContactRequest,
        token: string
    ): Promise<ContactResponse> {
        return serverRequest<ContactResponse>(
            'PUT',
            `${API_ENDPOINTS.contacts.update}/${contactId}`,
            token,
            data
        );
    }

    /**
     * Remove contact
     * DELETE /contacts/{contactId}
     */
    static async deleteContact(
        contactId: string,
        token: string
    ): Promise<{ message: string }> {
        return serverRequest<{ message: string }>(
            'DELETE',
            `${API_ENDPOINTS.contacts.delete}/${contactId}`,
            token
        );
    }
}
