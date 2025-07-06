import { useState } from 'react';

interface WaitlistSignupProps {
  title?: string;
  description?: string;
  className?: string;
}

const WaitlistSignup = ({ 
  title = "Join the Waitlist", 
  description = "Be the first to know when RAMPA MVP launches",
  className = ""
}: WaitlistSignupProps): JSX.Element => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [message, setMessage] = useState('');

  const handleSubmit = async (e: React.FormEvent): Promise<void> => {
    e.preventDefault();
    
    if (!name.trim()) {
      setStatus('error');
      setMessage('Please enter your name');
      return;
    }

    if (!email) {
      setStatus('error');
      setMessage('Please enter your email address');
      return;
    }

    setStatus('loading');
    setMessage('');

    try {
      const response = await fetch('/api/waitlist', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name: name.trim(), email }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Something went wrong');
      }

      setStatus('success');
      setMessage('🎉 You\'re on the list! We\'ll notify you when we launch.');
      setName('');
      setEmail('');
      
      // Reset after 5 seconds
      setTimeout(() => {
        setStatus('idle');
        setMessage('');
      }, 5000);

    } catch (error) {
      setStatus('error');
      setMessage(error instanceof Error ? error.message : 'Failed to join waitlist');
      
      // Reset error after 3 seconds
      setTimeout(() => {
        setStatus('idle');
        setMessage('');
      }, 3000);
    }
  };

  return (
    <div className={`bg-gradient-to-r from-indigo-600 to-purple-600 rounded-lg p-6 md:p-8 text-white ${className}`}>
      <div className="max-w-md mx-auto text-center">
        <h3 className="text-xl md:text-2xl font-bold mb-2">{title}</h3>
        <p className="text-indigo-100 mb-6">{description}</p>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="flex flex-col gap-3">
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Enter your name"
              className="px-4 py-3 rounded-md text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-white"
              disabled={status === 'loading'}
            />
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email"
              className="px-4 py-3 rounded-md text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-white"
              disabled={status === 'loading'}
            />
            <button
              type="submit"
              disabled={status === 'loading' || status === 'success'}
              className="bg-white text-indigo-600 px-6 py-3 rounded-md font-medium hover:bg-gray-100 transition disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {status === 'loading' ? 'Joining...' : 'Join Waitlist'}
            </button>
          </div>
          
          {message && (
            <div className={`text-sm ${
              status === 'success' ? 'text-green-200' : 'text-red-200'
            }`}>
              {message}
            </div>
          )}
        </form>
        
        <p className="text-xs text-indigo-200 mt-4">
          We'll only email you about the launch. No spam, ever.
        </p>
      </div>
    </div>
  );
};

export default WaitlistSignup;