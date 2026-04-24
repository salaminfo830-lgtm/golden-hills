-- Update Settings table with missing identity and policy columns
ALTER TABLE "Settings" ADD COLUMN IF NOT EXISTS "tagline" TEXT;
ALTER TABLE "Settings" ADD COLUMN IF NOT EXISTS "secondary_tagline" TEXT;
ALTER TABLE "Settings" ADD COLUMN IF NOT EXISTS "instagram_handle" TEXT;
ALTER TABLE "Settings" ADD COLUMN IF NOT EXISTS "check_in_time" TEXT DEFAULT '14:00';
ALTER TABLE "Settings" ADD COLUMN IF NOT EXISTS "check_out_time" TEXT DEFAULT '12:00';
ALTER TABLE "Settings" ADD COLUMN IF NOT EXISTS "breakfast_hours" TEXT;
ALTER TABLE "Settings" ADD COLUMN IF NOT EXISTS "spa_policy" TEXT;
ALTER TABLE "Settings" ADD COLUMN IF NOT EXISTS "spa_offer" TEXT;
ALTER TABLE "Settings" ADD COLUMN IF NOT EXISTS "city_tax_info" TEXT;

-- Ensure Service table has auto-generating UUID if missing
-- (Assuming table exists but might not have default gen_random_uuid())
DO $$ 
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'Service' AND column_name = 'id' AND column_default LIKE 'gen_random_uuid%') THEN
        ALTER TABLE "Service" ALTER COLUMN "id" SET DEFAULT gen_random_uuid();
    END IF;
END $$;

-- Ensure Room table updated_at has a default
ALTER TABLE "Room" ALTER COLUMN "updated_at" SET DEFAULT CURRENT_TIMESTAMP;
