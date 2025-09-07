import { serverRequest } from '../../lib/api-client';
import { API_ENDPOINTS } from '../../lib/constants';
import type { WaitlistEntry, WaitlistRequest, WaitlistResponse } from './types';

/**
 * Waitlist feature-specific API client
 * Handles all waitlist-related API calls to the backend
 */
export class WaitlistApiClient {
    /**
     * Add a new entry to the waitlist
     */
    static async addToWaitlist(data: WaitlistRequest): Promise<WaitlistResponse> {
        try {
            // The backend returns the created entry on success (201 status)
            await serverRequest<WaitlistEntry>(
                'POST',
                API_ENDPOINTS.waitlist,
                undefined, // token
                data
            );
            
            // Convert the created entry to our expected response format
            return {
                success: true,
                message: 'Successfully joined the waitlist!',
                count: 1 // We know one entry was created
            };
        } catch (error) {
            // If there's an error, return the error response format
            return {
                success: false,
                error: error instanceof Error ? error.message : 'An error occurred'
            };
        }
    }

    /**
     * Get all waitlist entries
     */
    static async getWaitlistEntries(): Promise<WaitlistEntry[]> {
        return serverRequest<WaitlistEntry[]>(
            'GET',
            API_ENDPOINTS.waitlist,
            undefined // token
        );
    }

    /**
     * Get waitlist count
     */
    static async getWaitlistCount(): Promise<number> {
        const response = await serverRequest<{ count: number }>(
            'GET',
            API_ENDPOINTS.waitlistCount,
            undefined // token
        );
        return response.count;
    }
}
