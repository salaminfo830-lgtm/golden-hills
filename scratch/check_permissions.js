import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

dotenv.config({ path: '.env.local' });

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY;

const supabase = createClient(supabaseUrl, supabaseKey);

async function checkRLS() {
  console.log('Checking permissions for "Room" table...');
  const { data: testUpdate, error: updateError } = await supabase
    .from('Room')
    .update({ description: 'Test update at ' + new Date().toISOString() })
    .eq('id', 1) // Just a guess at an ID
    .select();
  
  if (updateError) {
    console.error('Update failed for Room table:', updateError);
  } else {
    console.log('Update succeeded for Room table:', testUpdate);
  }

  console.log('Checking permissions for "Settings" table...');
  const { data: testSettings, error: settingsError } = await supabase
    .from('Settings')
    .update({ hotel_name: 'Golden Hills Test' })
    .eq('id', 'global')
    .select();
  
  if (settingsError) {
    console.error('Update failed for Settings table:', settingsError);
  } else {
    console.log('Update succeeded for Settings table:', testSettings);
  }
}

checkRLS();
