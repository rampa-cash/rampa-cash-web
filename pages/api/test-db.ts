import type { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    // Test Prisma import
    let prisma;
    try {
      const prismaModule = await import('../../lib/prisma');
      prisma = prismaModule.default;
    } catch (importError) {
      return res.status(500).json({
        error: 'Prisma import failed',
        details: importError instanceof Error ? importError.message : 'Unknown error',
        environment: process.env.NODE_ENV,
        hasPostgresUrl: !!process.env.POSTGRES_PRISMA_URL,
      });
    }

    // Test database connection
    try {
      await prisma.$connect();
      
      // Test a simple query
      const count = await prisma.contact.count();
      
      await prisma.$disconnect();
      
      return res.status(200).json({
        success: true,
        message: 'Database connection successful',
        contactCount: count,
        environment: process.env.NODE_ENV,
        hasPostgresUrl: !!process.env.POSTGRES_PRISMA_URL,
      });
    } catch (connectionError) {
      return res.status(500).json({
        error: 'Database connection failed',
        details: connectionError instanceof Error ? connectionError.message : 'Unknown error',
        environment: process.env.NODE_ENV,
        hasPostgresUrl: !!process.env.POSTGRES_PRISMA_URL,
        postgresUrl: process.env.POSTGRES_PRISMA_URL ? 'Set (hidden for security)' : 'Not set',
      });
    }
  } catch (error) {
    return res.status(500).json({
      error: 'Unexpected error',
      details: error instanceof Error ? error.message : 'Unknown error',
      environment: process.env.NODE_ENV,
    });
  }
} 