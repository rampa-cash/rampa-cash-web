import { GetServerSideProps } from 'next';
import { loadWaitlist } from '../../lib/waitlist-storage';

interface WaitlistAdminProps {
  emails: string[];
  count: number;
}

const WaitlistAdmin = ({ emails, count }: WaitlistAdminProps) => {
  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4">
        <h1 className="text-2xl font-bold mb-6">Waitlist Signups ({count})</h1>
        
        <div className="bg-white rounded-lg shadow p-6">
          {emails.length === 0 ? (
            <p className="text-gray-500">No signups yet.</p>
          ) : (
            <>
              {/* Export Button */}
              <div className="mb-4">
                <button
                  onClick={() => {
                    const csvContent = emails.join('\n');
                    const blob = new Blob([csvContent], { type: 'text/csv' });
                    const url = window.URL.createObjectURL(blob);
                    const a = document.createElement('a');
                    a.href = url;
                    a.download = `waitlist-${new Date().toISOString().split('T')[0]}.csv`;
                    a.click();
                  }}
                  className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
                >
                  📥 Export CSV
                </button>
              </div>
              
              {/* Email List */}
              <div className="space-y-2 max-h-96 overflow-y-auto">
                {emails.map((email, index) => (
                  <div key={index} className="p-3 bg-gray-50 rounded flex justify-between items-center">
                    <span>{email}</span>
                    <span className="text-sm text-gray-500">#{index + 1}</span>
                  </div>
                ))}
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export const getServerSideProps: GetServerSideProps = async () => {
  const emails = loadWaitlist();
  
  return {
    props: {
      emails,
      count: emails.length,
    },
  };
};

export default WaitlistAdmin;