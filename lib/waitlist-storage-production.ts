import { Redis } from '@upstash/redis';

// Use Redis.fromEnv() which handles the configuration automatically
const redis = Redis.fromEnv();

const WAITLIST_KEY = 'rampa-waitlist';

export const loadWaitlist = async (): Promise<string[]> => {
  try {
    console.log('📡 Loading waitlist from Upstash Redis...');
    const emails = await redis.get<string[]>(WAITLIST_KEY);
    const result = emails || [];
    console.log('📁 Loaded emails from Redis:', result);
    return result;
  } catch (error) {
    console.error('❌ Error loading waitlist from Redis:', error);
    return [];
  }
};

export const saveWaitlist = async (emails: string[]): Promise<void> => {
  try {
    console.log('💾 Saving emails to Upstash Redis:', emails);
    await redis.set(WAITLIST_KEY, emails);
    console.log(`✅ Successfully saved ${emails.length} emails to Redis`);
  } catch (error) {
    console.error('❌ Error saving waitlist to Redis:', error);
  }
};

export const addToWaitlist = async (email: string): Promise<boolean> => {
  console.log('🚀 addToWaitlist (Redis) called with:', email);
  
  const emails = await loadWaitlist();
  const emailLower = email.toLowerCase();
  
  console.log('📋 Current emails loaded from Redis:', emails);
  console.log('🔍 Checking if email exists:', emailLower);
  
  if (!emails.includes(emailLower)) {
    console.log('✅ Email is new, adding to Redis list');
    emails.push(emailLower);
    await saveWaitlist(emails);
    return true;
  }
  
  console.log('⚠️ Email already exists in Redis');
  return false;
};

export const getWaitlistCount = async (): Promise<number> => {
  const emails = await loadWaitlist();
  return emails.length;
};