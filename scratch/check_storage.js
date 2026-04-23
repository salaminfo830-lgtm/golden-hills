import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

dotenv.config({ path: '.env.local' });

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('Supabase URL or Key is missing');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function checkStorage() {
  console.log('Checking Supabase Storage buckets...');
  const { data, error } = await supabase.storage.listBuckets();
  
  if (error) {
    console.error('Error listing buckets:', error);
    return;
  }
  
  console.log('Buckets:', data.map(b => ({ name: b.name, public: b.public })));

  for (const bucket of data) {
    const { data: files, error: filesError } = await supabase.storage.from(bucket.name).list('rooms');
    console.log(`Files in bucket "${bucket.name}" (rooms path):`, files?.length || 0);
  }
}

checkStorage();
