import { createClient } from '@supabase/supabase-js'
import dotenv from 'dotenv'

dotenv.config({ path: '.env.local' })

const supabaseUrl = process.env.VITE_SUPABASE_URL
const supabaseAnonKey = process.env.VITE_SUPABASE_ANON_KEY

const supabase = createClient(supabaseUrl, supabaseAnonKey)

async function checkSchema() {
  console.log('--- SCHEMA DIAGNOSTIC ---')
  
  const { data, error } = await supabase
    .from('Room')
    .select('*')
    .limit(1)

  if (error) {
    console.error('Error fetching room:', error.message)
  } else if (data && data[0]) {
    console.log('Columns in "Room" table:', Object.keys(data[0]).join(', '))
  } else {
    console.log('No rooms found in table.')
  }
}

checkSchema()
