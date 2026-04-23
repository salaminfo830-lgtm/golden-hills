-- FINAL COMPREHENSIVE STORAGE & DB FIX
-- Run this once in the Supabase SQL Editor

-- 1. FIX STORAGE BUCKETS
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES 
  ('rooms', 'rooms', true, 5242880, '{image/*}'),
  ('branding', 'branding', true, 2097152, '{image/*}')
ON CONFLICT (id) DO UPDATE SET public = true;

-- 2. ENABLE REALTIME
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_publication WHERE pubname = 'supabase_realtime') THEN
        CREATE PUBLICATION supabase_realtime;
    END IF;
EXCEPTION WHEN OTHERS THEN 
    RAISE NOTICE 'Publication already exists or cannot be created';
END $$;

-- 3. ADD TABLES TO REALTIME
-- Ignore errors if they are already added
DO $$
BEGIN
    ALTER PUBLICATION supabase_realtime ADD TABLE "Room";
EXCEPTION WHEN OTHERS THEN NULL;
END $$;

DO $$
BEGIN
    ALTER PUBLICATION supabase_realtime ADD TABLE "Settings";
EXCEPTION WHEN OTHERS THEN NULL;
END $$;

-- 4. FIX RLS POLICIES (GENTLE VERSION)
-- This allows anyone (Anon) to Read/Write to these specific tables and buckets
-- For a production app, you would eventually restrict this to authenticated admins.

-- Storage Policies
DO $$
BEGIN
    DROP POLICY IF EXISTS "Public Select" ON storage.objects;
    DROP POLICY IF EXISTS "Public Insert" ON storage.objects;
    DROP POLICY IF EXISTS "Public Update" ON storage.objects;
    
    CREATE POLICY "Public Select" ON storage.objects FOR SELECT USING (bucket_id IN ('rooms', 'branding'));
    CREATE POLICY "Public Insert" ON storage.objects FOR INSERT WITH CHECK (bucket_id IN ('rooms', 'branding'));
    CREATE POLICY "Public Update" ON storage.objects FOR UPDATE USING (bucket_id IN ('rooms', 'branding'));
END $$;

-- Table Policies (Room & Settings)
DO $$
BEGIN
    -- Room Table
    ALTER TABLE IF EXISTS "Room" ENABLE ROW LEVEL SECURITY;
    DROP POLICY IF EXISTS "Public All" ON "Room";
    CREATE POLICY "Public All" ON "Room" FOR ALL USING (true) WITH CHECK (true);

    -- Settings Table
    ALTER TABLE IF EXISTS "Settings" ENABLE ROW LEVEL SECURITY;
    DROP POLICY IF EXISTS "Public All" ON "Settings";
    CREATE POLICY "Public All" ON "Settings" FOR ALL USING (true) WITH CHECK (true);
END $$;
