"use client";
import { useState } from 'react';
import { WaitlistApiClient } from '../api-client';
import type { WaitlistSignupProps } from '../types';

const WaitlistSignup = ({
    title = "🚀 Get Early Access",
    description = "Be among the first to experience the future of remittances",
    className = ""
}: WaitlistSignupProps): JSX.Element => {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [message, setMessage] = useState('');
    const [status, setStatus] = useState<'idle' | 'success' | 'error' | 'loading'>('idle');

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        
        if (!name.trim() || !email.trim()) {
            setStatus('error');
            setMessage('Please fill in all fields');
            return;
        }

        setStatus('loading');
        setMessage('');

        try {
            const result = await WaitlistApiClient.addToWaitlist({
                name: name.trim(),
                email: email.trim(),
            });

            // Check if the API call was successful
            if (result.success) {
                setStatus('success');
                setMessage(result.message || 'Successfully joined the waitlist!');
                setName('');
                setEmail('');
            } else {
                setStatus('error');
                setMessage(result.error || 'An error occurred. Please try again.');
            }
        } catch (error) {
            setStatus('error');
            setMessage('Something went wrong. Please try again.');
        } finally {
            // Status is already set in the try/catch blocks
        }
    };

    return (
        <div className={`bg-gradient-to-r from-indigo-600 to-purple-600 rounded-lg p-6 md:p-8 text-white ${className}`}>
            <div className="max-w-md mx-auto text-center">
                <h3 className="text-xl md:text-2xl font-bold mb-2">{title}</h3>
                <p className="text-indigo-100 mb-6">{description}</p>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="space-y-3">
                        <input
                            type="text"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            placeholder="Enter your name"
                            className="w-full px-4 py-3 rounded-md text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-white"
                            disabled={status === 'loading'}
                        />
                        <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="Enter your email"
                            className="w-full px-4 py-3 rounded-md text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-white"
                            disabled={status === 'loading'}
                        />
                        <button
                            type="submit"
                            disabled={status === 'loading' || status === 'success'}
                            className="w-full bg-white text-indigo-600 px-6 py-3 rounded-md font-medium hover:bg-gray-100 transition disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {status === 'loading' ? 'Joining...' : 'Join Waitlist'}
                        </button>
                    </div>

                    {message && (
                        <div className={`text-sm ${status === 'success' ? 'text-green-200' : 'text-red-200'
                            }`}>
                            {message}
                        </div>
                    )}
                </form>

                <p className="text-xs text-indigo-200 mt-6">
                    We'll only email you about the launch. No spam, ever.
                </p>
            </div>
        </div>
    );
};

export default WaitlistSignup;