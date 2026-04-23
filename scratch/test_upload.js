import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import fs from 'fs';

dotenv.config({ path: '.env.local' });

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY;

const supabase = createClient(supabaseUrl, supabaseKey);

async function testUpload() {
  console.log('Testing upload to "rooms" bucket...');
  
  // Create a dummy file
  const fileName = `test-${Date.now()}.txt`;
  const fileContent = 'Hello Supabase Storage';
  
  const { data, error } = await supabase.storage
    .from('rooms')
    .upload(fileName, fileContent, {
      contentType: 'text/plain',
      upsert: true
    });

  if (error) {
    console.error('Upload failed:', error);
  } else {
    console.log('Upload succeeded:', data);
    const { data: { publicUrl } } = supabase.storage
      .from('rooms')
      .getPublicUrl(fileName);
    console.log('Public URL:', publicUrl);
  }
}

testUpload();
