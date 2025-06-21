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
      return JSON.parse(data);
    }
  } catch (error) {
    console.error('Error loading waitlist:', error);
  }
  return [];
};

export const saveWaitlist = (emails: string[]): void => {
  try {
    ensureDataDir();
    fs.writeFileSync(WAITLIST_FILE, JSON.stringify(emails, null, 2));
  } catch (error) {
    console.error('Error saving waitlist:', error);
  }
};

export const addToWaitlist = (email: string): boolean => {
  const emails = loadWaitlist();
  if (!emails.includes(email.toLowerCase())) {
    emails.push(email.toLowerCase());
    saveWaitlist(emails);
    return true;
  }
  return false;
};