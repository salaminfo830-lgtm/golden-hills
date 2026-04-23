import { createClient } from '@supabase/supabase-js'
import dotenv from 'dotenv'

dotenv.config({ path: '.env.local' })

const supabaseUrl = process.env.VITE_SUPABASE_URL
const supabaseAnonKey = process.env.VITE_SUPABASE_ANON_KEY

const supabase = createClient(supabaseUrl, supabaseAnonKey)

async function checkServicesData() {
  console.log('--- SERVICES DATA CHECK ---')
  
  const { data: services, error } = await supabase
    .from('Service')
    .select('id, name, type, image_url')
    .order('created_at', { ascending: false })

  if (error) {
    console.error('Error:', error.message)
  } else {
    console.log('Services in DB:')
    services.forEach(s => {
      console.log(` - ${s.name} (${s.type}): ${s.image_url || 'MISSING'}`)
    })
  }
}

checkServicesData()
