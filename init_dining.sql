-- Phase 4: Gastronomy Integration & System Core

-- 1. Ensure Settings table is robustly initialized
CREATE TABLE IF NOT EXISTS "Settings" (
    "id" TEXT PRIMARY KEY DEFAULT 'global',
    "hotel_name" TEXT DEFAULT 'Golden Hills Hotel Setif',
    "address" TEXT DEFAULT 'Blvd des Orangers, Setif, Algeria',
    "contact_email" TEXT DEFAULT 'contact@goldenhills.dz',
    "contact_phone" TEXT DEFAULT '+213 36 00 00 00',
    "language" TEXT DEFAULT 'English',
    "timezone" TEXT DEFAULT '(GMT+01:00) Algiers, Casablanca, Tunis',
    "currency" TEXT DEFAULT 'DZD',
    "logo_url" TEXT DEFAULT '/brand-logo.jpg',
    "brand_color_primary" TEXT DEFAULT '#D4AF37',
    "brand_color_secondary" TEXT DEFAULT '#002349',
    "font_family" TEXT DEFAULT 'Inter',
    "hero_image_url" TEXT DEFAULT 'https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?auto=format&fit=crop&q=80&w=2070',
    "password_min_length" INTEGER DEFAULT 8,
    "session_timeout" INTEGER DEFAULT 30,
    "two_factor_enabled" BOOLEAN DEFAULT false,
    "data_retention_days" INTEGER DEFAULT 365,
    "updated_at" TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Insert default settings if not exists
INSERT INTO "Settings" (id) VALUES ('global') ON CONFLICT (id) DO NOTHING;

-- 2. Create DiningReservation table
CREATE TABLE IF NOT EXISTS "DiningReservation" (
    "id" UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    "venue_name" TEXT NOT NULL,
    "guest_name" TEXT NOT NULL,
    "guest_email" TEXT,
    "guest_phone" TEXT,
    "party_size" INTEGER NOT NULL,
    "reservation_date" DATE NOT NULL,
    "reservation_time" TIME NOT NULL,
    "status" TEXT DEFAULT 'Confirmed', -- Confirmed, Cancelled, Completed
    "notes" TEXT,
    "created_at" TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 3. Enable RLS
ALTER TABLE "Settings" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "DiningReservation" ENABLE ROW LEVEL SECURITY;

-- 4. Permissive policies
CREATE POLICY "Full access for all settings" ON "Settings" FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Full access for all dining_res" ON "DiningReservation" FOR ALL USING (true) WITH CHECK (true);

-- 5. Add realtime support
ALTER PUBLICATION supabase_realtime ADD TABLE "Settings", "DiningReservation";
