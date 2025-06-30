import { Index } from '@upstash/vector';

// Use the Vector database with proper client
const index = new Index({
  url: process.env.UPSTASH_VECTOR_REST_URL ?? '',
  token: process.env.UPSTASH_VECTOR_REST_TOKEN ?? '',
})

const WAITLIST_KEY = 'rampa-waitlist';

// Create a dummy 1536-dimensional vector (all zeros)
const dummyVector = new Array(1536).fill(0);

export const loadWaitlist = async (): Promise<string[]> => {
  try {
    // Try to fetch by ID directly instead of using query
    try {
      const result = await index.fetch([WAITLIST_KEY], { includeMetadata: true });
      
      if (result.length > 0 && result[0]?.metadata?.emails) {
        const emails = JSON.parse(result[0].metadata.emails as string);
        return emails;
      }
    } catch (fetchError) {
      // Fallback to query method
      const result = await index.query({
        vector: dummyVector,
        topK: 10, // Increase to make sure we find it
        includeMetadata: true,
        filter: `type = "waitlist"` // Use metadata filter instead of id
      });
      
      if (result.length > 0 && result[0]?.metadata?.emails) {
        const emails = JSON.parse(result[0].metadata.emails as string);
        return emails;
      }
    }
    
    return [];
  } catch (error) {
    return [];
  }
};

export const saveWaitlist = async (emails: string[]): Promise<void> => {
  try {
    // First, try to delete existing entry
    try {
      await index.delete([WAITLIST_KEY]);
    } catch (e) {
      // No existing entry to delete
    }
    
    // Upsert with emails in metadata using correct vector dimension
    await index.upsert([{
      id: WAITLIST_KEY,
      vector: dummyVector, // Use 1536-dimensional vector
      metadata: {
        emails: JSON.stringify(emails),
        type: 'waitlist',
        count: emails.length,
        timestamp: new Date().toISOString()
      }
    }]);
  } catch (error) {
    // Error saving waitlist
  }
};

export const addToWaitlist = async (email: string): Promise<boolean> => {
  try {
    const emails = await loadWaitlist();
    const emailLower = email.toLowerCase();
    
    if (!emails.includes(emailLower)) {
      emails.push(emailLower);
      await saveWaitlist(emails);
      return true;
    }
    
    return false;
  } catch (error) {
    return false;
  }
};

export const getWaitlistCount = async (): Promise<number> => {
  try {
    const emails = await loadWaitlist();
    return emails.length;
  } catch (error) {
    return 0;
  }
};