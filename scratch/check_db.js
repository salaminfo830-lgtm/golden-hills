import { createClient } from '@supabase/supabase-js'
import dotenv from 'dotenv'

dotenv.config({ path: '.env.local' })

const supabaseUrl = process.env.VITE_SUPABASE_URL
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY // Should ideally use service role key for migrations

const supabase = createClient(supabaseUrl, supabaseKey)

async function run() {
  console.log('Checking database status...')
  
  // We can't run raw SQL via the JS client unless there is an RPC.
  // But we can check if the table exists by trying to select from it.
  const { error } = await supabase.from('Amenity').select('id').limit(1)
  
  if (error && error.code === 'PGRST116') {
     console.log('Amenity table seems to be missing or accessible.')
  } else if (error) {
     console.log('Error checking Amenity table:', error.message)
  } else {
     console.log('Amenity table exists.')
  }
}

run()
