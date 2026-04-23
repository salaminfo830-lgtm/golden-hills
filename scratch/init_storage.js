import { PrismaClient } from '@prisma/client';
import dotenv from 'dotenv';

dotenv.config({ path: '.env.local' });

const prisma = new PrismaClient();

async function initStorage() {
  try {
    // Create buckets if they don't exist
    // Note: We use raw SQL because Prisma doesn't manage the 'storage' schema by default
    console.log('Initializing storage buckets...');
    
    await prisma.$executeRawUnsafe(`
      INSERT INTO storage.buckets (id, name, public)
      VALUES ('rooms', 'rooms', true)
      ON CONFLICT (id) DO NOTHING;
    `);

    await prisma.$executeRawUnsafe(`
      INSERT INTO storage.buckets (id, name, public)
      VALUES ('branding', 'branding', true)
      ON CONFLICT (id) DO NOTHING;
    `);

    // Ensure RLS policies allow anonymous uploads for now (or at least public reads)
    // In a real app, you'd want more restrictive policies, but for this fix:
    await prisma.$executeRawUnsafe(`
      DO $$
      BEGIN
        IF NOT EXISTS (
          SELECT 1 FROM pg_policies WHERE policyname = 'Public Access' AND tablename = 'objects' AND schemaname = 'storage'
        ) THEN
          CREATE POLICY "Public Access" ON storage.objects FOR SELECT USING (bucket_id = 'rooms' OR bucket_id = 'branding');
        END IF;
        
        IF NOT EXISTS (
          SELECT 1 FROM pg_policies WHERE policyname = 'Allow All' AND tablename = 'objects' AND schemaname = 'storage'
        ) THEN
          CREATE POLICY "Allow All" ON storage.objects FOR ALL WITH CHECK (true);
        END IF;
      END
      $$;
    `);

    console.log('Storage buckets initialized successfully.');
  } catch (error) {
    console.error('Error initializing storage:', error);
  } finally {
    await prisma.$disconnect();
  }
}

initStorage();
