import { createClient } from '@supabase/supabase-js'
import dotenv from 'dotenv'

dotenv.config({ path: '.env.local' })

const supabaseUrl = process.env.VITE_SUPABASE_URL
const supabaseAnonKey = process.env.VITE_SUPABASE_ANON_KEY

const supabase = createClient(supabaseUrl, supabaseAnonKey)

async function checkStorage() {
  console.log('--- STORAGE DIAGNOSTIC ---')
  
  // 1. Check Buckets
  const { data: buckets, error: bucketError } = await supabase.storage.listBuckets()
  if (bucketError) {
    console.error('Error listing buckets:', bucketError.message)
  } else {
    console.log('Available Buckets:', buckets.map(b => `${b.name} (${b.public ? 'Public' : 'Private'})`))
  }

  // 2. Try to list files in 'rooms'
  const { data: files, error: fileError } = await supabase.storage.from('rooms').list()
  if (fileError) {
    console.error('Error listing files in "rooms":', fileError.message)
  } else {
    console.log(`Files in "rooms" bucket (${files.length}):`)
    files.slice(0, 5).forEach(f => {
        const { data: { publicUrl } } = supabase.storage.from('rooms').getPublicUrl(f.name)
        console.log(` - ${f.name} -> URL: ${publicUrl}`)
    })
  }

  // 3. Try to list files in 'branding'
  const { data: bFiles, error: bFileError } = await supabase.storage.from('branding').list()
  if (!bFileError) {
    console.log(`Files in "branding" bucket (${bFiles.length}):`)
    bFiles.slice(0, 5).forEach(f => {
        const { data: { publicUrl } } = supabase.storage.from('branding').getPublicUrl(f.name)
        console.log(` - ${f.name} -> URL: ${publicUrl}`)
    })
  }
}

checkStorage()
