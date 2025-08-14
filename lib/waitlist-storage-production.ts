import prisma from './prisma';

export const loadWaitlist = async (): Promise<string[]> => {
  try {
    const contacts = await prisma.contact.findMany({
      where: { type: 'WAITLIST' },
      select: { email: true }
    });
    
    return contacts.map(contact => contact.email);
  } catch (error) {
    console.error('Error loading waitlist:', error);
    return [];
  }
};

export const saveWaitlist = async (emails: string[]): Promise<void> => {
  // This function is kept for compatibility but not used with Prisma
  // Prisma handles individual record creation/updates
  console.warn('saveWaitlist called with emails:', emails);
};

export const addToWaitlist = async (name: string, email: string): Promise<boolean> => {
  try {
    const emailLower = email.toLowerCase();
    
    // Check if email already exists
    const existingContact = await prisma.contact.findFirst({
      where: { 
        email: emailLower,
        type: 'WAITLIST'
      }
    });
    
    if (existingContact) {
      return false; // Email already exists
    }
    
    // Create new waitlist entry
    await prisma.contact.create({
      data: {
        name: name.trim(),
        email: emailLower,
        type: 'WAITLIST'
      }
    });
    
    return true; // Successfully added
  } catch (error) {
    console.error('Error adding to waitlist:', error);
    return false;
  }
};

export const getWaitlistCount = async (): Promise<number> => {
  try {
    const count = await prisma.contact.count({
      where: { type: 'WAITLIST' }
    });
    return count;
  } catch (error) {
    console.error('Error getting waitlist count:', error);
    return 0;
  }
};