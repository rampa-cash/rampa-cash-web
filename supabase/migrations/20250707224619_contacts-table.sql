-- Create the ContactType enum
CREATE TYPE "ContactType" AS ENUM ('WAITLIST', 'CONTACT');

-- Create the contacts table
CREATE TABLE IF NOT EXISTS "contacts" (
  "id" SERIAL PRIMARY KEY,
  "name" TEXT NOT NULL,
  "email" TEXT NOT NULL,
  "inquiry" TEXT,
  "type" "ContactType" NOT NULL DEFAULT 'WAITLIST',
  "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updated_at" TIMESTAMP(3) NOT NULL
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS "contacts_type_idx" ON "contacts"("type");
CREATE INDEX IF NOT EXISTS "contacts_email_idx" ON "contacts"("email");
CREATE INDEX IF NOT EXISTS "contacts_created_at_idx" ON "contacts"("created_at"); 