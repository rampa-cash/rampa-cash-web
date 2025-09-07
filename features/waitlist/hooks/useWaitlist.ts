import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { WaitlistApiClient } from '../api-client';
import type { WaitlistRequest } from '../types';

/**
 * Hook to fetch all waitlist entries
 */
export const useWaitlistEntries = () => {
    return useQuery({
        queryKey: ['waitlist', 'entries'],
        queryFn: () => WaitlistApiClient.getWaitlistEntries(),
        staleTime: 5 * 60 * 1000, // 5 minutes
        refetchOnWindowFocus: true,
    });
};

/**
 * Hook to get waitlist count
 */
export const useWaitlistCount = () => {
    return useQuery({
        queryKey: ['waitlist', 'count'],
        queryFn: () => WaitlistApiClient.getWaitlistCount(),
        staleTime: 5 * 60 * 1000, // 5 minutes
        refetchOnWindowFocus: true,
    });
};

/**
 * Hook to create a new waitlist entry
 */
export const useCreateWaitlistEntry = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (entryData: WaitlistRequest) =>
            WaitlistApiClient.addToWaitlist(entryData),
        onSuccess: () => {
            // Invalidate and refetch waitlist data
            queryClient.invalidateQueries({ queryKey: ['waitlist'] });
        },
        onError: (error) => {
            console.error('Failed to create waitlist entry:', error);
        },
    });
};
