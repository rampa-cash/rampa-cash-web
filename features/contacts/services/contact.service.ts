import { ContactApiClient } from '../api-client';
import type { 
    Contact, 
    AddContactRequest,
    UpdateContactRequest,
    ContactStats
} from '../types';

/**
 * Contact service for handling contact logic
 * Uses ContactApiClient for API calls and manages local state
 */
export class ContactService {
    /**
     * Get contacts for a user
     */
    static async getContacts(_userId: string, _filters?: any): Promise<Contact[]> {
        try {
            const token = localStorage.getItem('accessToken');
            if (!token) {
                throw new Error('No authentication token available');
            }

            const response = await ContactApiClient.getContacts(token);
            
            return response.map(contact => ({
                id: contact.id,
                ownerId: _userId,
                contactUserId: contact.contactUserId || undefined,
                email: contact.email || undefined,
                phone: contact.phone || undefined,
                displayName: contact.displayName,
                walletAddress: contact.walletAddress || undefined,
                isAppUser: contact.isAppUser,
                createdAt: contact.createdAt,
                updatedAt: contact.updatedAt,
            }));
        } catch (error) {
            console.error('Failed to get contacts:', error);
            throw error;
        }
    }

    /**
     * Add a new contact
     */
    static async addContact(_userId: string, contactData: AddContactRequest): Promise<Contact> {
        try {
            const token = localStorage.getItem('accessToken');
            if (!token) {
                throw new Error('No authentication token available');
            }

            const response = await ContactApiClient.addContact(contactData, token);
            
            return {
                id: response.id,
                ownerId: _userId,
                contactUserId: response.contactUserId,
                email: response.email,
                phone: response.phone,
                displayName: response.displayName,
                walletAddress: response.walletAddress,
                isAppUser: response.isAppUser,
                createdAt: response.createdAt,
                updatedAt: response.updatedAt,
            };
        } catch (error) {
            console.error('Failed to add contact:', error);
            throw error;
        }
    }

    /**
     * Update a contact
     */
    static async updateContact(_userId: string, contactId: string, contactData: UpdateContactRequest): Promise<Contact> {
        try {
            const token = localStorage.getItem('accessToken');
            if (!token) {
                throw new Error('No authentication token available');
            }

            const response = await ContactApiClient.updateContact(contactId, contactData, token);
            
            return {
                id: response.id,
                ownerId: _userId,
                contactUserId: response.contactUserId,
                email: response.email,
                phone: response.phone,
                displayName: response.displayName,
                walletAddress: response.walletAddress,
                isAppUser: response.isAppUser,
                createdAt: response.createdAt,
                updatedAt: response.updatedAt,
            };
        } catch (error) {
            console.error('Failed to update contact:', error);
            throw error;
        }
    }

    /**
     * Delete a contact
     */
    static async deleteContact(_userId: string, contactId: string): Promise<void> {
        try {
            const token = localStorage.getItem('accessToken');
            if (!token) {
                throw new Error('No authentication token available');
            }

            await ContactApiClient.deleteContact(contactId, token);
        } catch (error) {
            console.error('Failed to delete contact:', error);
            throw error;
        }
    }

    /**
     * Toggle favorite status
     */
    static async toggleFavorite(_userId: string, contactId: string, isFavorite: boolean): Promise<{ id: string; isFavorite: boolean }> {
        try {
            // This would be implemented based on the actual API
            // For now, return a mock response
            return {
                id: contactId,
                isFavorite,
            };
        } catch (error) {
            console.error('Failed to toggle favorite:', error);
            throw error;
        }
    }

    /**
     * Search contacts
     */
    static async searchContacts(_userId: string, query: string): Promise<Contact[]> {
        try {
            const token = localStorage.getItem('accessToken');
            if (!token) {
                throw new Error('No authentication token available');
            }

            const response = await ContactApiClient.searchContacts(query, token);
            
            return response.map(contact => ({
                id: contact.id,
                ownerId: _userId,
                contactUserId: contact.contactUserId || undefined,
                email: contact.email || undefined,
                phone: contact.phone || undefined,
                displayName: contact.displayName,
                walletAddress: contact.walletAddress || undefined,
                isAppUser: contact.isAppUser,
                createdAt: contact.createdAt,
                updatedAt: contact.updatedAt,
            }));
        } catch (error) {
            console.error('Failed to search contacts:', error);
            throw error;
        }
    }

    /**
     * Get contact statistics
     */
    static async getContactStats(_userId: string): Promise<ContactStats> {
        try {
            const token = localStorage.getItem('accessToken');
            if (!token) {
                throw new Error('No authentication token available');
            }

            return await ContactApiClient.getContactStats(token);
        } catch (error) {
            console.error('Failed to get contact stats:', error);
            throw error;
        }
    }

    /**
     * Sync contacts with app users
     */
    static async syncContacts(_userId: string): Promise<{ syncedCount: number; syncedContacts: Contact[] }> {
        try {
            const token = localStorage.getItem('accessToken');
            if (!token) {
                throw new Error('No authentication token available');
            }

            const response = await ContactApiClient.syncContacts(token);
            
            const syncedContacts: Contact[] = response.syncedContacts.map(contact => ({
                id: contact.id,
                ownerId: _userId,
                contactUserId: undefined, // Not available in sync response
                email: undefined, // Not available in sync response
                phone: undefined, // Not available in sync response
                displayName: contact.displayName,
                walletAddress: contact.walletAddress || undefined,
                isAppUser: contact.isAppUser,
                createdAt: new Date().toISOString(),
                updatedAt: new Date().toISOString(),
            }));

            return {
                syncedCount: response.syncedCount,
                syncedContacts,
            };
        } catch (error) {
            console.error('Failed to sync contacts:', error);
            throw error;
        }
    }
}