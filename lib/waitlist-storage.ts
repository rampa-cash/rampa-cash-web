import fs from 'fs';
import path from 'path';

const WAITLIST_FILE = path.join(process.cwd(), 'data', 'waitlist.json');

// Ensure data directory exists
const ensureDataDir = () => {
  const dataDir = path.dirname(WAITLIST_FILE);
  if (!fs.existsSync(dataDir)) {
    fs.mkdirSync(dataDir, { recursive: true });
  }
};

export const loadWaitlist = (): string[] => {
  try {
    ensureDataDir();
    if (fs.existsSync(WAITLIST_FILE)) {
      const data = fs.readFileSync(WAITLIST_FILE, 'utf8');
      const emails = JSON.parse(data);
      console.log('📁 Loaded emails from file:', emails);
      return emails;
    }
    console.log('📁 No waitlist file found, returning empty array');
  } catch (error) {
    console.error('❌ Error loading waitlist:', error);
  }
  return [];
};

export const saveWaitlist = (emails: string[]): void => {
  try {
    ensureDataDir();
    const jsonData = JSON.stringify(emails, null, 2);
    console.log('💾 Attempting to save emails:', emails);
    console.log('💾 File path:', WAITLIST_FILE);
    
    fs.writeFileSync(WAITLIST_FILE, jsonData);
    console.log(`✅ Successfully saved ${emails.length} emails to file`);
    
    // Verify the save worked
    const verification = fs.readFileSync(WAITLIST_FILE, 'utf8');
    console.log('🔍 File contents after save:', verification);
  } catch (error) {
    console.error('❌ Error saving waitlist:', error);
  }
};

export const addToWaitlist = (email: string): boolean => {
  console.log('🚀 addToWaitlist called with:', email);
  
  const emails = loadWaitlist();
  const emailLower = email.toLowerCase();
  
  console.log('📋 Current emails loaded:', emails);
  console.log('🔍 Checking if email exists:', emailLower);
  console.log('🔍 Email already in list?', emails.includes(emailLower));
  
  if (!emails.includes(emailLower)) {
    console.log('✅ Email is new, adding to list');
    emails.push(emailLower);
    console.log('📝 New email list:', emails);
    saveWaitlist(emails);
    return true;
  }
  
  console.log('⚠️ Email already exists in list');
  return false;
};

export const getWaitlistCount = (): number => {
  return loadWaitlist().length;
};