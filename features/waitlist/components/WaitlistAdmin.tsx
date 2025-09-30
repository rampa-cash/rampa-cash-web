"use client";
import { useWaitlistEntries } from '../hooks/useWaitlist';
import type { InquiryResponse } from '../types';

const WaitlistAdmin = (): JSX.Element => {
    const { data: entries = [], isLoading, error } = useWaitlistEntries();

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-20 md:py-32">
            <div className="max-w-4xl mx-auto px-4">
                <h1 className="text-2xl font-bold mb-6 text-gray-900 dark:text-white">
                    Waitlist Signups ({entries.length})
                </h1>

                {error && (
                    <div className="bg-red-100 dark:bg-red-900/20 border border-red-400 dark:border-red-800 text-red-700 dark:text-red-300 px-4 py-3 rounded mb-4">
                        <strong>Error:</strong> {error.message || 'Failed to load waitlist entries'}
                    </div>
                )}

                <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 p-6">
                    {isLoading ? (
                        <div className="flex items-center justify-center py-8">
                            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-indigo-600"></div>
                            <span className="ml-3 text-gray-600 dark:text-gray-300">Loading entries...</span>
                        </div>
                    ) : entries.length === 0 ? (
                        <p className="text-gray-500 dark:text-gray-400 text-center py-8">No signups yet.</p>
                    ) : (
                        <div className="space-y-3">
                            {entries.map((entry: InquiryResponse, index) => (
                                <div key={entry.id} className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg border border-gray-300 dark:border-gray-600 shadow-md hover:shadow-lg transition-shadow duration-200">
                                    <div className="flex justify-between items-start mb-2">
                                        <div>
                                            <span className="font-medium text-gray-900 dark:text-white">{entry.name}</span>
                                            <span className="ml-2 text-gray-700 dark:text-gray-300">{entry.email}</span>
                                        </div>
                                        <span className="text-sm text-gray-600 dark:text-gray-400">#{index + 1}</span>
                                    </div>
                                    {entry.inquiry && (
                                        <div className="text-sm text-gray-700 dark:text-gray-200 mb-2 p-2 bg-gray-100 dark:bg-gray-600 rounded border-l-2 border-indigo-200 dark:border-indigo-400">
                                            <strong>Message:</strong> {entry.inquiry}
                                        </div>
                                    )}
                                    <div className="flex justify-between items-center text-xs text-gray-600 dark:text-gray-400">
                                        <span>Joined: {new Date(entry.createdAt).toLocaleDateString()}</span>
                                        <span className="px-2 py-1 bg-gray-200 dark:bg-gray-600 rounded-full text-xs text-gray-700 dark:text-gray-300">
                                            {entry.status}
                                        </span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default WaitlistAdmin;
