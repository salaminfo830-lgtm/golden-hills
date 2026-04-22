import { createClient } from '@supabase/supabase-js'
import dotenv from 'dotenv'

dotenv.config({ path: '.env.local' })

const supabase = createClient(process.env.VITE_SUPABASE_URL, process.env.VITE_SUPABASE_ANON_KEY)

async function run() {
  const { data, error } = await supabase.rpc('get_table_info', { t_name: 'Amenity' })
  // Since we don't have get_table_info, we'll try to guess or use a query that fails informativeley
  const { data: d, error: e } = await supabase.from('Amenity').insert([{ name: 'Test', icon: 'Test', room_id: 1 }])
  console.log('Insert error:', e)
}
run()
