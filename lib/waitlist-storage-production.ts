import { Redis } from '@upstash/redis';

console.log('🔍 Using Vector database as Redis storage');

// Use your existing Vector database credentials
const redis = new Redis({
  url: process.env.UPSTASH_VECTOR_REST_URL!,
  token: process.env.UPSTASH_VECTOR_REST_TOKEN!,
});

const WAITLIST_KEY = 'rampa-waitlist';

export const loadWaitlist = async (): Promise<string[]> => {
  try {
    console.log('📡 Loading waitlist from Vector database...');
    const emails = await redis.get<string[]>(WAITLIST_KEY);
    const result = emails || [];
    console.log('📁 Loaded emails:', result);
    return result;
  } catch (error) {
    console.error('❌ Error loading waitlist:', error);
    return [];
  }
};

export const saveWaitlist = async (emails: string[]): Promise<void> => {
  try {
    console.log('💾 Saving emails:', emails);
    await redis.set(WAITLIST_KEY, emails);
    console.log(`✅ Successfully saved ${emails.length} emails`);
  } catch (error) {
    console.error('❌ Error saving waitlist:', error);
  }
};

export const addToWaitlist = async (email: string): Promise<boolean> => {
  console.log('🚀 addToWaitlist called with:', email);
  
  const emails = await loadWaitlist();
  const emailLower = email.toLowerCase();
  
  if (!emails.includes(emailLower)) {
    console.log('✅ Email is new, adding to list');
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