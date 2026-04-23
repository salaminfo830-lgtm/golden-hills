-- SQL Script to fix Supabase Storage for Golden Hills
-- Run this in your Supabase SQL Editor

-- 1. Create buckets if they don't exist and set them to public
-- We use a DO block to handle errors gracefully if permissions are tight
DO $$
BEGIN
    INSERT INTO storage.buckets (id, name, public) 
    VALUES ('rooms', 'rooms', true)
    ON CONFLICT (id) DO UPDATE SET public = true;

    INSERT INTO storage.buckets (id, name, public) 
    VALUES ('branding', 'branding', true)
    ON CONFLICT (id) DO UPDATE SET public = true;

    INSERT INTO storage.buckets (id, name, public) 
    VALUES ('staff', 'staff', true)
    ON CONFLICT (id) DO UPDATE SET public = true;
END $$;

-- 2. Create permissive policies for development
-- We don't use ALTER TABLE here as it often causes permission errors in the SQL editor.
-- RLS is usually enabled by default for storage.

-- Drop existing policies to avoid conflicts
DROP POLICY IF EXISTS "Public Access" ON storage.objects;
DROP POLICY IF EXISTS "Public Insert" ON storage.objects;
DROP POLICY IF EXISTS "Public Update" ON storage.objects;
DROP POLICY IF EXISTS "Public Delete" ON storage.objects;

-- Allow public read access to all buckets
CREATE POLICY "Public Access" ON storage.objects FOR SELECT USING (true);

-- Allow public uploads to our specific buckets
CREATE POLICY "Public Insert" ON storage.objects FOR INSERT WITH CHECK (
  bucket_id IN ('rooms', 'branding', 'staff')
);

-- Allow public updates/deletes for convenience in development
CREATE POLICY "Public Update" ON storage.objects FOR UPDATE USING (
  bucket_id IN ('rooms', 'branding', 'staff')
);

CREATE POLICY "Public Delete" ON storage.objects FOR DELETE USING (
  bucket_id IN ('rooms', 'branding', 'staff')
);

