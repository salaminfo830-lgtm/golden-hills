import { createClient } from '@supabase/supabase-js'
import dotenv from 'dotenv'

dotenv.config({ path: '.env.local' })

const supabaseUrl = process.env.VITE_SUPABASE_URL
const supabaseAnonKey = process.env.VITE_SUPABASE_ANON_KEY

const supabase = createClient(supabaseUrl, supabaseAnonKey)

async function checkRoomData() {
  console.log('--- ROOM DATA CHECK ---')
  
  const { data: rooms, error } = await supabase
    .from('Room')
    .select('id, number, type, image_url')
    .order('created_at', { ascending: false })
    .limit(10)

  if (error) {
    console.error('Error:', error.message)
  } else {
    console.log('Rooms in DB:')
    rooms.forEach(r => {
      console.log(` - #${r.number} (${r.type}): ${r.image_url || 'MISSING'}`)
    })
  }
}

checkRoomData()
