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
            <div className="space-y-2">
              {emails.map((email, index) => (
                <div key={index} className="p-3 bg-gray-50 rounded">
                  {email}
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
  const emails = loadWaitlist();
  
  return {
    props: {
      emails,
      count: emails.length,
    },
  };
};

export default WaitlistAdmin;