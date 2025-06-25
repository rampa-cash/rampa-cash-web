import { Redis } from '@upstash/redis';

// Convert your Redis URL to the format Upstash expects
const REDIS_URL = 'redis://default:Sk4YJrNlcKtvGVEjsj8IInjbKuZFxQKC@redis-10317.c325.us-east-1-4.ec2.redns.redis-cloud.com:10317';

// Extract the parts from Redis URL
const url = REDIS_URL.replace('redis://', 'https://').replace('default:', '');
const [credentials, host] = url.split('@');
const token = credentials.replace('https://', '');

console.log('🔍 Using manual Redis URL with @upstash/redis');

const redis = new Redis({
  url: `https://${host}`,
  token: token,
});

const WAITLIST_KEY = 'rampa-waitlist';

export const loadWaitlist = async (): Promise<string[]> => {
  try {
    console.log('📡 Loading waitlist from manual Redis URL...');
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
    console.log('💾 Saving emails to Redis:', emails);
    await redis.set(WAITLIST_KEY, emails);
    console.log(`✅ Successfully saved ${emails.length} emails to Redis`);
  } catch (error) {
    console.error('❌ Error saving waitlist to Redis:', error);
  }
};

export const addToWaitlist = async (email: string): Promise<boolean> => {
  console.log('🚀 addToWaitlist (manual Redis) called with:', email);
  
  const emails = await loadWaitlist();
  const emailLower = email.toLowerCase();
  
  if (!emails.includes(emailLower)) {
    console.log('✅ Email is new, adding to Redis');
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