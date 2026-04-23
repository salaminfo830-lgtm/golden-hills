-- Run this SQL in your Supabase Dashboard SQL Editor to ensure storage is correctly configured

-- 1. Ensure buckets are created and public
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES 
  ('rooms', 'rooms', true, 5242880, '{image/*}'),
  ('branding', 'branding', true, 2097152, '{image/*}')
ON CONFLICT (id) DO UPDATE SET 
  public = true,
  file_size_limit = 5242880,
  allowed_mime_types = '{image/*}';

-- 2. Enable RLS on storage.objects if not already enabled
ALTER TABLE storage.objects ENABLE ROW LEVEL SECURITY;

-- 3. Drop any existing conflicting policies
DROP POLICY IF EXISTS "Public Select" ON storage.objects;
DROP POLICY IF EXISTS "Public Insert" ON storage.objects;
DROP POLICY IF EXISTS "Public Update" ON storage.objects;
DROP POLICY IF EXISTS "Public Delete" ON storage.objects;

-- 4. Create public policies for full administrative control
-- Note: In a production app, you might want to restrict INSERT/UPDATE to authenticated users only.
-- For now, we enable them for all to ensure the admin panel works.

CREATE POLICY "Public Select" ON storage.objects FOR SELECT USING (true);
CREATE POLICY "Public Insert" ON storage.objects FOR INSERT WITH CHECK (true);
CREATE POLICY "Public Update" ON storage.objects FOR UPDATE USING (true);
CREATE POLICY "Public Delete" ON storage.objects FOR DELETE USING (true);
