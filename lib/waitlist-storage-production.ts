import { Redis } from '@upstash/redis';

// The REDIS_URL from your rampa-waitlist-redis database should work
console.log('🔍 Environment check:');
console.log('REDIS_URL exists:', !!process.env.REDIS_URL);

// Parse the REDIS_URL to extract URL and token
const redisUrl = process.env.REDIS_URL;
if (!redisUrl) {
  throw new Error('REDIS_URL environment variable is not set');
}

// Extract URL and token from the REDIS_URL
// Format is usually: redis://default:password@host:port
const url = redisUrl.replace('redis://', 'https://').split('@')[1];
const token = redisUrl.split('//')[1].split('@')[0].split(':')[1];

const redis = new Redis({
  url: `https://${url}`,
  token: token,
});

const WAITLIST_KEY = 'rampa-waitlist';

export const loadWaitlist = async (): Promise<string[]> => {
  try {
    console.log('📡 Loading waitlist from rampa-waitlist-redis...');
    const emails = await redis.get<string[]>(WAITLIST_KEY);
    const result = emails || [];
    console.log('📁 Loaded emails from Redis:', result);
    return result;
  } catch (error) {
    console.error('❌ Error loading waitlist from Redis:', error);
    console.error('❌ Error details:', error);
    return [];
  }
};

export const saveWaitlist = async (emails: string[]): Promise<void> => {
  try {
    console.log('💾 Saving emails to rampa-waitlist-redis:', emails);
    await redis.set(WAITLIST_KEY, emails);
    console.log(`✅ Successfully saved ${emails.length} emails to Redis`);
  } catch (error) {
    console.error('❌ Error saving waitlist to Redis:', error);
    console.error('❌ Error details:', error);
  }
};

export const addToWaitlist = async (email: string): Promise<boolean> => {
  console.log('🚀 addToWaitlist (rampa-waitlist-redis) called with:', email);
  
  try {
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