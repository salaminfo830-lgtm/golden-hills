import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

dotenv.config({ path: '.env.local' });

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY;

const supabase = createClient(supabaseUrl, supabaseKey);

async function listFiles() {
  console.log('Listing files in "rooms" bucket...');
  const { data, error } = await supabase.storage.from('rooms').list();
  
  if (error) {
    console.error('Error listing files in rooms:', error);
  } else {
    console.log('Files in rooms:', JSON.stringify(data, null, 2));
  }

  console.log('Listing files in "branding" bucket...');
  const { data: bData, error: bError } = await supabase.storage.from('branding').list();
  
  if (bError) {
    console.error('Error listing files in branding:', bError);
  } else {
    console.log('Files in branding:', JSON.stringify(bData, null, 2));
  }
}

listFiles();
