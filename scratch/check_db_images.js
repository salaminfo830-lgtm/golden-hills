import { createClient } from '@supabase/supabase-js'
import dotenv from 'dotenv'

dotenv.config({ path: '.env.local' })

const supabaseUrl = process.env.VITE_SUPABASE_URL
const supabaseAnonKey = process.env.VITE_SUPABASE_ANON_KEY

const supabase = createClient(supabaseUrl, supabaseAnonKey)

async function checkDatabase() {
  console.log('--- DATABASE DIAGNOSTIC ---')
  
  const { data: rooms, error } = await supabase
    .from('Room')
    .select('id, room_name, image_url')
    .order('created_at', { ascending: false })
    .limit(5)

  if (error) {
    console.error('Error fetching rooms:', error.message)
  } else {
    console.log('Last 5 Rooms in DB:')
    rooms.forEach(r => {
      console.log(` - [${r.id}] ${r.room_name}: ${r.image_url}`)
    })
  }

  const { data: settings, sError } = await supabase
    .from('Settings')
    .select('hero_image_url, logo_url')
    .limit(1)

  if (sError) {
    console.error('Error fetching settings:', sError.message)
  } else if (settings && settings[0]) {
    console.log('Settings in DB:')
    console.log(` - Hero: ${settings[0].hero_image_url}`)
    console.log(` - Logo: ${settings[0].logo_url}`)
  }
}

checkDatabase()
