import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

dotenv.config({ path: '.env.local' });

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY;

const supabase = createClient(supabaseUrl, supabaseKey);

async function listFiles() {
  console.log('Listing files in "rooms":');
  const { data: roomsFiles, error: roomsError } = await supabase.storage.from('rooms').list('');
  console.log(roomsFiles);

  console.log('Listing files in "branding":');
  const { data: brandingFiles, error: brandingError } = await supabase.storage.from('branding').list('');
  console.log(brandingFiles);
}

listFiles();
