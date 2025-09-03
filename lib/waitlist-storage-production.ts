// Backend API configuration
const BACKEND_API_URL = process.env.BACKEND_API_URL || 'http://localhost:8000';

export const loadWaitlist = async (): Promise<string[]> => {
    try {
        const response = await fetch(`${BACKEND_API_URL}/api/waitlist`);
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
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
        const response = await fetch(`${BACKEND_API_URL}/api/waitlist`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                name: name.trim(),
                email: email.toLowerCase(),
            }),
        });

        if (!response.ok) {
            if (response.status === 409) {
                return false; // Email already exists
            }
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        return true; // Successfully added
    } catch (error) {
        console.error('Error adding to waitlist:', error);
        return false;
    }
};

export const getWaitlistCount = async (): Promise<number> => {
    try {
        const response = await fetch(`${BACKEND_API_URL}/api/waitlist/count`);
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        return data.count || 0;
    } catch (error) {
        console.error('Error getting waitlist count:', error);
        return 0;
    }
};