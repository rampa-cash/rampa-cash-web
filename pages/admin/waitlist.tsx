import { GetServerSideProps } from 'next';

interface WaitlistAdminProps {
  entries: { name: string; email: string }[];
  count: number;
  environment: string;
  error?: string;
}

const WaitlistAdmin = ({ entries, count, environment, error }: WaitlistAdminProps): JSX.Element => {
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
          {entries.length === 0 ? (
            <p className="text-gray-500">No signups yet.</p>
          ) : (
            <div className="space-y-2">
              {entries.map((entry, index) => (
                <div key={index} className="p-3 bg-gray-50 rounded flex justify-between items-center">
                  <div>
                    <span className="font-medium">{entry.name}</span>
                    <span className="ml-2 text-gray-600">{entry.email}</span>
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

export const getServerSideProps: GetServerSideProps = async () => {
  try {
    // Import Prisma with better error handling
    let prisma;
    try {
      const prismaModule = await import('../../lib/prisma');
      prisma = prismaModule.default;
    } catch (importError) {
      console.error('Failed to import Prisma:', importError);
      return {
        props: {
          entries: [],
          count: 0,
          environment: 'Error - Prisma import failed',
          error: `Failed to import Prisma: ${importError instanceof Error ? importError.message : 'Unknown import error'}`,
        },
      };
    }

    // Test database connection
    try {
      await prisma.$connect();
    } catch (connectionError) {
      console.error('Failed to connect to database:', connectionError);
      return {
        props: {
          entries: [],
          count: 0,
          environment: 'Error - Database connection failed',
          error: `Database connection failed: ${connectionError instanceof Error ? connectionError.message : 'Unknown connection error'}. Check POSTGRES_PRISMA_URL environment variable.`,
        },
      };
    }

    const contacts = await prisma.contact.findMany({
      where: { type: 'WAITLIST' },
      select: { name: true, email: true },
      orderBy: { createdAt: 'desc' },
    });
    
    return {
      props: {
        entries: contacts,
        count: contacts.length,
        environment: 'PostgreSQL (Prisma)',
      },
    };
  } catch (error) {
    console.error('Error in getServerSideProps:', error);
    return {
      props: {
        entries: [],
        count: 0,
        environment: 'Error',
        error: error instanceof Error ? error.message : 'Unknown error',
      },
    };
  }
};

export default WaitlistAdmin;