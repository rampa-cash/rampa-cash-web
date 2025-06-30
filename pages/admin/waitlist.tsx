import { GetServerSideProps } from 'next';

interface WaitlistAdminProps {
  emails: string[];
  count: number;
  environment: string;
  error?: string;
}

const WaitlistAdmin = ({ emails, count, environment, error }: WaitlistAdminProps): JSX.Element => {
  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4">
        <h1 className="text-2xl font-bold mb-6">
          Waitlist Signups ({count}) 
          <span className="text-sm text-gray-500 ml-2">- {environment}</span>
        </h1>
        
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            <strong>Error:</strong> {error}
          </div>
        )}
        
        <div className="bg-white rounded-lg shadow p-6">
          {emails.length === 0 ? (
            <p className="text-gray-500">No signups yet.</p>
          ) : (
            <div className="space-y-2">
              {emails.map((email, index) => (
                <div key={index} className="p-3 bg-gray-50 rounded flex justify-between">
                  <span>{email}</span>
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

export const getServerSideProps: GetServerSideProps = async () => {
  try {
    const isProduction = process.env.NODE_ENV === 'production' || process.env.VERCEL;
    
    if (isProduction) {
      const { loadWaitlist } = await import('../../lib/waitlist-storage-production');
      const emails = await loadWaitlist();
      
      return {
        props: {
          emails,
          count: emails.length,
          environment: 'Production (Vector Database)',
        },
      };
    } else {
      const { loadWaitlist } = await import('../../lib/waitlist-storage');
      const emails = loadWaitlist();
      
      return {
        props: {
          emails,
          count: emails.length,
          environment: 'Development (File)',
        },
      };
    }
  } catch (error) {
    return {
      props: {
        emails: [],
        count: 0,
        environment: 'Error',
        error: error instanceof Error ? error.message : 'Unknown error',
      },
    };
  }
};

export default WaitlistAdmin;