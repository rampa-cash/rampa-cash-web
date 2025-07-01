import fs from 'fs';
import path from 'path';

const WAITLIST_FILE = path.join(process.cwd(), 'data', 'waitlist.json');

// Ensure data directory exists
const ensureDataDir = (): void => {
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
      return emails;
    }
  } catch (error) {
    // Error loading waitlist
  }
  return [];
};

export const saveWaitlist = (emails: string[]): void => {
  try {
    ensureDataDir();
    const jsonData = JSON.stringify(emails, null, 2);
    
    fs.writeFileSync(WAITLIST_FILE, jsonData);
    
    // Verify the save worked
    fs.readFileSync(WAITLIST_FILE, 'utf8');
  } catch (error) {
    // Error saving waitlist
  }
};

export const addToWaitlist = (email: string): boolean => {
  const emails = loadWaitlist();
  const emailLower = email.toLowerCase();
  
  if (!emails.includes(emailLower)) {
    emails.push(emailLower);
    saveWaitlist(emails);
    return true;
  }
  
  return false;
};

export const getWaitlistCount = (): number => {
  return loadWaitlist().length;
};