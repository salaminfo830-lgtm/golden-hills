import { createClient } from '@supabase/supabase-js'
import dotenv from 'dotenv'

dotenv.config({ path: '.env.local' })

const supabaseUrl = process.env.VITE_SUPABASE_URL
const supabaseAnonKey = process.env.VITE_SUPABASE_ANON_KEY

const supabase = createClient(supabaseUrl, supabaseAnonKey)

async function sanitizeDatabase() {
  console.log('--- DATABASE SANITIZATION ---')
  
  // 1. Fix Room table
  const { data: rooms, error: fetchError } = await supabase
    .from('Room')
    .select('id, number, image_url')

  if (fetchError) {
    console.error('Error fetching rooms:', fetchError.message)
  } else {
    for (const room of rooms) {
      if (room.image_url && (room.image_url.startsWith('C:\\') || room.image_url.startsWith('"C:\\'))) {
        console.log(`Fixing Room #${room.number} (Found local path: ${room.image_url})`)
        const { error: updateError } = await supabase
          .from('Room')
          .update({ image_url: 'https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?auto=format&fit=crop&q=80&w=2070' })
          .eq('id', room.id)
        
        if (updateError) console.error(`Failed to fix room ${room.id}:`, updateError.message)
      }
    }
  }

  // 2. Fix Settings table
  const { data: settings, sError } = await supabase
    .from('Settings')
    .select('id, hero_image_url, logo_url')

  if (!sError && settings) {
    for (const s of settings) {
        let updates = {}
        if (s.hero_image_url && (s.hero_image_url.startsWith('C:\\') || s.hero_image_url.startsWith('"C:\\'))) {
            updates.hero_image_url = 'https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?auto=format&fit=crop&q=80&w=2070'
        }
        if (s.logo_url && (s.logo_url.startsWith('C:\\') || s.logo_url.startsWith('"C:\\'))) {
            updates.logo_url = ''
        }

        if (Object.keys(updates).length > 0) {
            console.log('Fixing Settings record...')
            await supabase.from('Settings').update(updates).eq('id', s.id)
        }
    }
  }

  console.log('Sanitization complete.')
}

sanitizeDatabase()
