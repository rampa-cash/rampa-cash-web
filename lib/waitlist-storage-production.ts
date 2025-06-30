import { Index } from '@upstash/vector';

console.log('🔍 Using Vector database for key-value storage');

// Use the Vector database with proper client
const index = new Index({
  url: process.env.UPSTASH_VECTOR_REST_URL!,
  token: process.env.UPSTASH_VECTOR_REST_TOKEN!,
});

const WAITLIST_KEY = 'rampa-waitlist';

// Create a dummy 1536-dimensional vector (all zeros)
const dummyVector = new Array(1536).fill(0);

export const loadWaitlist = async (): Promise<string[]> => {
  try {
    console.log('📡 Loading waitlist from Vector database...');
    
    // Try to fetch by ID directly instead of using query
    try {
      const result = await index.fetch([WAITLIST_KEY], { includeMetadata: true });
      
      if (result.length > 0 && result[0]?.metadata?.emails) {
        const emails = JSON.parse(result[0].metadata.emails as string);
        console.log('📁 Loaded emails from Vector (fetch):', emails);
        return emails;
      }
    } catch (fetchError) {
      console.log('📡 Fetch failed, trying query method...');
      
      // Fallback to query method
      const result = await index.query({
        vector: dummyVector,
        topK: 10, // Increase to make sure we find it
        includeMetadata: true,
        filter: `type = "waitlist"` // Use metadata filter instead of id
      });
      
      if (result.length > 0 && result[0]?.metadata?.emails) {
        const emails = JSON.parse(result[0].metadata.emails as string);
        console.log('📁 Loaded emails from Vector (query):', emails);
        return emails;
      }
    }
    
    console.log('📁 No emails found, returning empty array');
    return [];
  } catch (error) {
    console.error('❌ Error loading waitlist from Vector:', error);
    return [];
  }
};

export const saveWaitlist = async (emails: string[]): Promise<void> => {
  try {
    console.log('💾 Saving emails to Vector database:', emails);
    
    // First, try to delete existing entry
    try {
      await index.delete([WAITLIST_KEY]);
    } catch (e) {
      console.log('🗑️ No existing entry to delete');
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
    
    console.log(`✅ Successfully saved ${emails.length} emails to Vector`);
  } catch (error) {
    console.error('❌ Error saving waitlist to Vector:', error);
  }
};

export const addToWaitlist = async (email: string): Promise<boolean> => {
  console.log('🚀 addToWaitlist (Vector) called with:', email);
  
  try {
    const emails = await loadWaitlist();
    const emailLower = email.toLowerCase();
    
    if (!emails.includes(emailLower)) {
      console.log('✅ Email is new, adding to Vector');
      emails.push(emailLower);
      await saveWaitlist(emails);
      return true;
    }
    
    console.log('⚠️ Email already exists');
    return false;
  } catch (error) {
    console.error('❌ Error in addToWaitlist:', error);
    return false;
  }
};

export const getWaitlistCount = async (): Promise<number> => {
  try {
    const emails = await loadWaitlist();
    return emails.length;
  } catch (error) {
    console.error('❌ Error getting waitlist count:', error);
    return 0;
  }
};