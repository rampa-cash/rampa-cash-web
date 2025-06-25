import { Index } from '@upstash/vector';

console.log('🔍 Using Vector database for key-value storage');

// Use the Vector database with proper client
const index = new Index({
  url: process.env.UPSTASH_VECTOR_REST_URL!,
  token: process.env.UPSTASH_VECTOR_REST_TOKEN!,
});

const WAITLIST_KEY = 'rampa-waitlist';

export const loadWaitlist = async (): Promise<string[]> => {
  try {
    console.log('📡 Loading waitlist from Vector database...');
    // Use metadata to store our emails list
    const result = await index.query({
      vector: [0], // dummy vector
      topK: 1,
      includeMetadata: true,
      filter: `id = "${WAITLIST_KEY}"`
    });
    
    if (result.length > 0 && result[0].metadata?.emails) {
      const emails = JSON.parse(result[0].metadata.emails as string);
      console.log('📁 Loaded emails from Vector:', emails);
      return emails;
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
      await index.delete(WAITLIST_KEY);
    } catch (e) {
      // Ignore if doesn't exist
    }
    
    // Upsert with emails in metadata
    await index.upsert({
      id: WAITLIST_KEY,
      vector: [0], // dummy vector
      metadata: {
        emails: JSON.stringify(emails),
        type: 'waitlist',
        count: emails.length
      }
    });
    
    console.log(`✅ Successfully saved ${emails.length} emails to Vector`);
  } catch (error) {
    console.error('❌ Error saving waitlist to Vector:', error);
  }
};

export const addToWaitlist = async (email: string): Promise<boolean> => {
  console.log('🚀 addToWaitlist (Vector) called with:', email);
  
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
};

export const getWaitlistCount = async (): Promise<number> => {
  const emails = await loadWaitlist();
  return emails.length;
};