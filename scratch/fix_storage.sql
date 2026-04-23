-- SQL Script to fix Supabase Storage for Golden Hills
-- Run this in your Supabase SQL Editor

-- 1. Create buckets if they don't exist and set them to public
INSERT INTO storage.buckets (id, name, public) 
VALUES ('rooms', 'rooms', true)
ON CONFLICT (id) DO UPDATE SET public = true;

INSERT INTO storage.buckets (id, name, public) 
VALUES ('branding', 'branding', true)
ON CONFLICT (id) DO UPDATE SET public = true;

INSERT INTO storage.buckets (id, name, public) 
VALUES ('staff', 'staff', true)
ON CONFLICT (id) DO UPDATE SET public = true;

-- 2. Enable RLS on storage.objects (if not already enabled)
ALTER TABLE storage.objects ENABLE ROW LEVEL SECURITY;

-- 3. Drop existing policies to avoid conflicts (optional but recommended for a clean fix)
DROP POLICY IF EXISTS "Public Access" ON storage.objects;
DROP POLICY IF EXISTS "Public Insert" ON storage.objects;
DROP POLICY IF EXISTS "Public Update" ON storage.objects;
DROP POLICY IF EXISTS "Public Delete" ON storage.objects;

-- 4. Create permissive policies for development
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
