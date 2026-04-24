import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.resolve(__dirname, '../../.env') });

const supabase = createClient(
  process.env.VITE_SUPABASE_URL,
  process.env.VITE_SUPABASE_ANON_KEY
);

async function checkSchema() {
  console.log('--- Settings Table ---');
  const { data: sData, error: sError } = await supabase.from('Settings').select('*').limit(1);
  if (sData && sData.length > 0) console.log(Object.keys(sData[0]));
  else console.log('Empty or Error:', sError);

  console.log('--- Room Table ---');
  const { data: rData, error: rError } = await supabase.from('Room').select('*').limit(1);
  if (rData && rData.length > 0) console.log(Object.keys(rData[0]));
  else console.log('Empty or Error:', rError);

  console.log('--- Service Table ---');
  const { data: svData, error: svError } = await supabase.from('Service').select('*').limit(1);
  if (svData && svData.length > 0) console.log(Object.keys(svData[0]));
  else console.log('Empty or Error:', svError);
}

checkSchema();
