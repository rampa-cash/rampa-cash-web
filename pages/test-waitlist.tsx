import { useState } from 'react';

const TestWaitlist = (): JSX.Element => {
  const [email, setEmail] = useState('');
  const [result, setResult] = useState('');
  const [loading, setLoading] = useState(false);

  const testSubmit = async (): Promise<void> => {
    setLoading(true);
    setResult('Testing...');
    
    try {
      const response = await fetch('/api/waitlist', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      });
      
      const data = await response.json();
      
      setResult(`Status: ${response.status}\n${JSON.stringify(data, null, 2)}`);
      
    } catch (error) {
      setResult(`Error: ${error}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-8 max-w-2xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">🧪 Test Waitlist API</h1>
      
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-2">Test Email:</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="test@example.com"
            className="border border-gray-300 p-3 rounded w-full"
          />
        </div>
        
        <button
          onClick={testSubmit}
          disabled={loading || !email}
          className="bg-blue-500 text-white px-6 py-3 rounded hover:bg-blue-600 disabled:opacity-50"
        >
          {loading ? 'Testing...' : 'Test Submit'}
        </button>
        
        {result && (
          <div>
            <h3 className="font-bold mb-2">Result:</h3>
            <pre className="bg-gray-100 p-4 rounded overflow-auto text-sm border">
              {result}
            </pre>
          </div>
        )}
        
        <div className="mt-8 p-4 bg-yellow-50 border border-yellow-200 rounded">
          <h3 className="font-bold mb-2">🔍 How to Debug:</h3>
          <ol className="list-decimal list-inside space-y-1 text-sm">
            <li>Open Browser DevTools (F12)</li>
            <li>Go to Console tab</li>
            <li>Enter an email and click &quot;Test Submit&quot;</li>
            <li>Check console for logs</li>
            <li>Check Network tab for API request</li>
          </ol>
        </div>
      </div>
    </div>
  );
};

export default TestWaitlist;