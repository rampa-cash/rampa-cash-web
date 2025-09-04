import { apiClient } from './api-client';
import { API_ENDPOINTS } from './constants';
import { waitlistRequestSchema } from './validators';

export const loadWaitlist = async (): Promise<string[]> => {
    try {
        const data = await apiClient.get<{ emails: string[] }>(API_ENDPOINTS.waitlist);
        return data.emails || [];
    } catch (error) {
        console.error('Error loading waitlist:', error);
        return [];
    }
};

export const saveWaitlist = async (emails: string[]): Promise<void> => {
    // This function is kept for compatibility but not used with backend API
    // Backend API handles individual record creation/updates
    console.warn('saveWaitlist called with emails:', emails);
};

export const addToWaitlist = async (name: string, email: string): Promise<boolean> => {
    try {
        // Validate input data
        const validatedData = waitlistRequestSchema.parse({
            name: name.trim(),
            email: email.toLowerCase(),
        });

        await apiClient.post(API_ENDPOINTS.waitlist, validatedData);
        return true; // Successfully added
    } catch (error) {
        if (error instanceof Error && error.message.includes('409')) {
            return false; // Email already exists
        }
        console.error('Error adding to waitlist:', error);
        return false;
    }
};

export const getWaitlistCount = async (): Promise<number> => {
    try {
        const data = await apiClient.get<{ count: number }>(API_ENDPOINTS.waitlistCount);
        return data.count || 0;
    } catch (error) {
        console.error('Error getting waitlist count:', error);
        return 0;
    }
};