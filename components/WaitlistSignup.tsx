import { useState } from 'react';
import { Button } from './ui/button';

interface WaitlistSignupProps {
  title?: string;
  description?: string;
  className?: string;
  onSuccess?: (email: string) => void;
  onError?: (error: string) => void;
}

interface WaitlistResponse {
  success: boolean;
  message?: string;
  error?: string;
  count?: number;
}

const WaitlistSignup: React.FC<WaitlistSignupProps> = ({
  title = "🚀 Get Early Access",
  description = "Join our waitlist and be the first to know when we launch",
  className = "",
  onSuccess,
  onError
}) => {
  const [email, setEmail] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [message, setMessage] = useState<string>('');
  const [isSuccess, setIsSuccess] = useState<boolean>(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>): Promise<void> => {
    e.preventDefault();
    
    if (!email.trim()) {
      setMessage('Please enter your email address');
      setIsSuccess(false);
      onError?.('Please enter your email address');
      return;
    }

    setIsLoading(true);
    setMessage('');

    try {
      const response = await fetch('/api/waitlist', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email: email.trim() }),
      });

      const data: WaitlistResponse = await response.json();

      if (data.success) {
        setMessage(data.message || 'Successfully joined the waitlist!');
        setIsSuccess(true);
        setEmail('');
        onSuccess?.(email.trim());
      } else {
        setMessage(data.error || 'Failed to join waitlist');
        setIsSuccess(false);
        onError?.(data.error || 'Failed to join waitlist');
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Network error occurred';
      setMessage('Failed to join waitlist. Please try again.');
      setIsSuccess(false);
      onError?.(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className={`bg-white p-6 rounded-lg shadow-sm border ${className}`}>
      <h3 className="text-xl font-bold mb-2">{title}</h3>
      <p className="text-gray-600 mb-4">{description}</p>
      
      <form onSubmit={handleSubmit} className="space-y-3">
        <div>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Enter your email address"
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
            disabled={isLoading}
            required
          />
        </div>
        
        <Button
          type="submit"
          disabled={isLoading}
          className="w-full bg-indigo-600 text-white py-2 px-4 rounded-md font-medium hover:bg-indigo-700 transition disabled:opacity-50"
        >
          {isLoading ? 'Joining...' : 'Join Waitlist'}
        </Button>
      </form>
      
      {message && (
        <div className={`mt-3 p-2 rounded text-sm ${
          isSuccess 
            ? 'bg-green-100 text-green-700 border border-green-200' 
            : 'bg-red-100 text-red-700 border border-red-200'
        }`}>
          {message}
        </div>
      )}
    </div>
  );
};

export default WaitlistSignup;