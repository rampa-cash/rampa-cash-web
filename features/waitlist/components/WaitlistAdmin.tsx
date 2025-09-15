"use client";
import { useWaitlistEntries } from '../hooks/useWaitlist';

const WaitlistAdmin = (): JSX.Element => {
    const { data: entries = [], isLoading, error } = useWaitlistEntries();

    return (
        <div className="min-h-screen bg-gray-50 py-20 md:py-32">
            <div className="max-w-4xl mx-auto px-4">
                <h1 className="text-2xl font-bold mb-6">
                    Waitlist Signups ({entries.length})
                </h1>

                {error && (
                    <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
                        <strong>Error:</strong> {error.message || 'Failed to load waitlist entries'}
                    </div>
                )}

                <div className="bg-white rounded-lg shadow p-6">
                    {isLoading ? (
                        <div className="flex items-center justify-center py-8">
                            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-indigo-600"></div>
                            <span className="ml-3 text-gray-600">Loading entries...</span>
                        </div>
                    ) : entries.length === 0 ? (
                        <p className="text-gray-500 text-center py-8">No signups yet.</p>
                    ) : (
                        <div className="space-y-2">
                            {entries.map((entry, index) => (
                                <div key={entry.id} className="p-3 bg-gray-50 rounded flex justify-between items-center">
                                    <div>
                                        <span className="font-medium">{entry.name}</span>
                                        <span className="ml-2 text-gray-600">{entry.email}</span>
                                        <div className="text-xs text-gray-500 mt-1">
                                            Joined: {new Date(entry.createdAt).toLocaleDateString()}
                                        </div>
                                    </div>
                                    <span className="text-sm text-gray-500">#{index + 1}</span>
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