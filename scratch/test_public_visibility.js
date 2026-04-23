import { createClient } from '@supabase/supabase-js'
import dotenv from 'dotenv'

dotenv.config({ path: '.env.local' })

const supabaseUrl = process.env.VITE_SUPABASE_URL
const supabaseAnonKey = process.env.VITE_SUPABASE_ANON_KEY

const supabase = createClient(supabaseUrl, supabaseAnonKey)

async function testPublicAccess() {
  console.log('--- PUBLIC ACCESS TEST ---')
  
  const testFile = 'test-' + Date.now() + '.txt'
  const content = 'This is a test for public visibility.'
  
  // 1. Upload
  console.log('Uploading test file...')
  const { error: uploadError } = await supabase.storage
    .from('rooms')
    .upload(testFile, content, { contentType: 'text/plain' })

  if (uploadError) {
    console.error('Upload failed:', uploadError.message)
    return
  }

  // 2. Get Public URL
  const { data: { publicUrl } } = supabase.storage
    .from('rooms')
    .getPublicUrl(testFile)
  
  console.log('Public URL generated:', publicUrl)

  // 3. Try to fetch it using standard fetch (to simulate browser)
  try {
    const response = await fetch(publicUrl)
    if (response.ok) {
        console.log('SUCCESS: Public URL is reachable!')
        console.log('Content:', await response.text())
    } else {
        console.error(`FAILURE: Public URL returned status ${response.status} ${response.statusText}`)
        if (response.status === 403) {
            console.error('Reason: Bucket might be PRIVATE or RLS is blocking SELECT.')
        }
    }
  } catch (err) {
    console.error('Fetch error:', err.message)
  }

  // Cleanup
  await supabase.storage.from('rooms').remove([testFile])
}

testPublicAccess()
