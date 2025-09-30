import { serverRequest } from '../../lib/api-client';
import { API_ENDPOINTS } from '../../lib/constants';
import type { WaitlistRequest, InquiryResponse } from './types';

/**
 * Waitlist feature-specific API client
 * Handles all waitlist-related API calls to the backend
 */
export class WaitlistApiClient {
    /**
     * Add a new entry to the waitlist
     */
    static async addToWaitlist(data: WaitlistRequest): Promise<InquiryResponse> {
        try {
            // The backend returns the created entry on success (201 status)
            const response = await serverRequest<InquiryResponse>(
                'POST',
                API_ENDPOINTS.waitlist,
                undefined, // token
                {
                    ...data,
                    type: 'WAITLIST'
                }
            );
            
            return response;
        } catch (error) {
            // Re-throw the error to be handled by the calling code
            throw error;
        }
    }

    /**
     * Get all waitlist entries
     */
    static async getWaitlistEntries(): Promise<InquiryResponse[]> {
        return serverRequest<InquiryResponse[]>(
            'GET',
            API_ENDPOINTS.waitlist,
            undefined // token
        );
    }

}
