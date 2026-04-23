import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

dotenv.config({ path: '.env.local' });

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY;

const supabase = createClient(supabaseUrl, supabaseKey);

async function checkRecent() {
  const { data: rooms, error } = await supabase
    .from('Room')
    .select('*')
    .order('updated_at', { ascending: false })
    .limit(5);
  
  console.log('Recent Rooms:');
  console.log(JSON.stringify(rooms, null, 2));

  const { data: settings } = await supabase
    .from('Settings')
    .select('*')
    .eq('id', 'global')
    .single();
  
  console.log('Current Settings:');
  console.log(JSON.stringify(settings, null, 2));
}

checkRecent();
