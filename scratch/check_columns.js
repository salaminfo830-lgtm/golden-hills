import { createClient } from '@supabase/supabase-js'
import dotenv from 'dotenv'

dotenv.config({ path: '.env.local' })

const supabase = createClient(process.env.VITE_SUPABASE_URL, process.env.VITE_SUPABASE_ANON_KEY)

async function run() {
  const { data, error } = await supabase.from('Amenity').select('*').limit(1)
  if (error) {
    console.log('Error:', error)
  } else {
    console.log('Data:', data)
    // Try to get column names if possible or just try to select room_id
    const { error: error2 } = await supabase.from('Amenity').select('room_id').limit(1)
    if (error2) {
      console.log('room_id error:', error2.message)
    } else {
      console.log('room_id exists')
    }
  }
}

run()
