import { PrismaClient } from '@prisma/client';
import dotenv from 'dotenv';

dotenv.config({ path: '.env.local' });

const prisma = new PrismaClient();

async function fixStorage() {
  try {
    console.log('Fixing storage permissions and buckets...');

    // 1. Ensure buckets exist and are public
    await prisma.$executeRawUnsafe(`
      INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
      VALUES 
        ('rooms', 'rooms', true, 5242880, '{image/*}'),
        ('branding', 'branding', true, 2097152, '{image/*}')
      ON CONFLICT (id) DO UPDATE SET 
        public = true,
        file_size_limit = 5242880,
        allowed_mime_types = '{image/*}';
    `);

    // 2. Enable RLS on storage.objects
    await prisma.$executeRawUnsafe(`
      ALTER TABLE storage.objects ENABLE ROW LEVEL SECURITY;
    `);

    // 3. Drop existing problematic policies to avoid conflicts
    await prisma.$executeRawUnsafe(`
      DROP POLICY IF EXISTS "Public Access" ON storage.objects;
      DROP POLICY IF EXISTS "Allow All" ON storage.objects;
      DROP POLICY IF EXISTS "Public Select" ON storage.objects;
      DROP POLICY IF EXISTS "Public Insert" ON storage.objects;
      DROP POLICY IF EXISTS "Public Update" ON storage.objects;
      DROP POLICY IF EXISTS "Public Delete" ON storage.objects;
    `);

    // 4. Create clean public policies
    await prisma.$executeRawUnsafe(`
      CREATE POLICY "Public Select" ON storage.objects FOR SELECT USING (true);
      CREATE POLICY "Public Insert" ON storage.objects FOR INSERT WITH CHECK (true);
      CREATE POLICY "Public Update" ON storage.objects FOR UPDATE USING (true);
      CREATE POLICY "Public Delete" ON storage.objects FOR DELETE USING (true);
    `);

    console.log('Storage fixed successfully!');
  } catch (error) {
    console.error('Error fixing storage:', error);
  } finally {
    await prisma.$disconnect();
  }
}

fixStorage();
