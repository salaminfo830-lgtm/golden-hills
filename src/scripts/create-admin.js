import { createClient } from '@supabase/supabase-js'
import dotenv from 'dotenv'
dotenv.config({ path: '.env.local' })

const supabaseUrl = process.env.VITE_SUPABASE_URL
const supabaseAnonKey = process.env.VITE_SUPABASE_ANON_KEY

const supabase = createClient(supabaseUrl, supabaseAnonKey)

async function checkAdminStatus() {
  const { data, error } = await supabase.auth.signInWithPassword({
    email: 'admin@gmail.com',
    password: '123456',
  })
  if (error) {
    console.error('Login error:', error.message)
  } else {
    console.log('Admin login successful:', data.user?.id)
  }
}

checkAdminStatus()
