import { createClient } from '@supabase/supabase-js'
import dotenv from 'dotenv'

dotenv.config({ path: '.env.local' })

const supabaseUrl = process.env.VITE_SUPABASE_URL
const supabaseAnonKey = process.env.VITE_SUPABASE_ANON_KEY

const supabase = createClient(supabaseUrl, supabaseAnonKey)

async function testPublicAccess() {
  console.log('--- PUBLIC ACCESS TEST (IMAGE) ---')
  
  const testFile = 'test-' + Date.now() + '.png'
  // A 1x1 transparent PNG pixel
  const content = Buffer.from('iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8/5+hHgAHggJ/PchI7wAAAABJRU5ErkJggg==', 'base64')
  
  // 1. Upload
  console.log('Uploading test image...')
  const { error: uploadError } = await supabase.storage
    .from('rooms')
    .upload(testFile, content, { contentType: 'image/png' })

  if (uploadError) {
    console.error('Upload failed:', uploadError.message)
    return
  }

  // 2. Get Public URL
  const { data: { publicUrl } } = supabase.storage
    .from('rooms')
    .getPublicUrl(testFile)
  
  console.log('Public URL generated:', publicUrl)

  // 3. Try to fetch it using standard fetch
  try {
    const response = await fetch(publicUrl)
    if (response.ok) {
        console.log('SUCCESS: Public URL is reachable!')
        console.log('Status:', response.status)
        console.log('Content-Type:', response.headers.get('content-type'))
    } else {
        console.error(`FAILURE: Public URL returned status ${response.status} ${response.statusText}`)
        const text = await response.text()
        console.log('Error Body:', text)
    }
  } catch (err) {
    console.error('Fetch error:', err.message)
  }

  // Cleanup
  await supabase.storage.from('rooms').remove([testFile])
}

testPublicAccess()
