import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

dotenv.config({ path: '.env.local' });

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY;

const supabase = createClient(supabaseUrl, supabaseKey);

async function checkData() {
  const { data: rooms, error: roomsError } = await supabase.from('Room').select('number, image_url');
  console.log('Rooms image URLs:');
  console.log(rooms);

  const { data: settings, error: settingsError } = await supabase.from('Settings').select('id, logo_url, hero_image_url');
  console.log('Settings image URLs:');
  console.log(settings);
}

checkData();
