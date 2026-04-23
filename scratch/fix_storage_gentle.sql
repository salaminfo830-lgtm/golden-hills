-- GENTLE VERSION: Only adds policies, does not try to alter system tables

-- 1. Ensure buckets are public
-- If this fails, please go to the "Storage" tab in the Supabase Dashboard, 
-- select the bucket, and click "Make Public" in the settings.
UPDATE storage.buckets SET public = true WHERE id IN ('rooms', 'branding');

-- 2. Add policies using the helper functions if possible, 
-- or just simple policy creation.
-- We use 'IF NOT EXISTS' logic via DO blocks to be safe.

DO $$
BEGIN
    -- Policy for viewing images
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Anyone can view images') THEN
        CREATE POLICY "Anyone can view images" ON storage.objects FOR SELECT USING (bucket_id IN ('rooms', 'branding'));
    END IF;

    -- Policy for uploading images
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Anyone can upload images') THEN
        CREATE POLICY "Anyone can upload images" ON storage.objects FOR INSERT WITH CHECK (bucket_id IN ('rooms', 'branding'));
    END IF;

    -- Policy for updating images
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Anyone can update images') THEN
        CREATE POLICY "Anyone can update images" ON storage.objects FOR UPDATE USING (bucket_id IN ('rooms', 'branding'));
    END IF;
END
$$;
