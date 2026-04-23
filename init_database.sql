-- Golden Hills Complete Database Initialization & Setup Script
-- Includes schema structure based on Prisma, constraints, and real foundational data.

-- 1. Create Tables
CREATE TABLE IF NOT EXISTS "Profile" (
    "id" UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    "email" TEXT UNIQUE NOT NULL,
    "full_name" TEXT,
    "role" TEXT DEFAULT 'staff',
    "avatar_url" TEXT,
    "created_at" TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

DROP TABLE IF EXISTS "Guest" CASCADE;
CREATE TABLE IF NOT EXISTS "Guest" (
    "id" UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    "full_name" TEXT NOT NULL,
    "email" TEXT UNIQUE NOT NULL,
    "phone" TEXT,
    "avatar_url" TEXT,
    "created_at" TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS "Room" (
    "id" SERIAL PRIMARY KEY,
    "number" TEXT UNIQUE NOT NULL,
    "type" TEXT NOT NULL,
    "price" DOUBLE PRECISION NOT NULL,
    "status" TEXT DEFAULT 'Vacant',
    "occupancy" TEXT DEFAULT 'Clean',
    "housekeeper" TEXT,
    "image_url" TEXT,
    "created_at" TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

DROP TABLE IF EXISTS "Reservation" CASCADE;
CREATE TABLE IF NOT EXISTS "Reservation" (
    "id" UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    "guest_id" UUID,
    "guest_name" TEXT NOT NULL,
    "guests_count" INTEGER DEFAULT 1,
    "nights" INTEGER NOT NULL,
    "room_id" INTEGER REFERENCES "Room"("id") ON DELETE SET NULL,
    "room_type" TEXT NOT NULL,
    "start_date" TIMESTAMP WITH TIME ZONE NOT NULL,
    "end_date" TIMESTAMP WITH TIME ZONE NOT NULL,
    "total_price" DOUBLE PRECISION DEFAULT 0,
    "status" TEXT DEFAULT 'Pending Approval',
    "source" TEXT DEFAULT 'Direct Site',
    "created_at" TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS "Staff" (
    "id" UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    "name" TEXT NOT NULL,
    "role" TEXT NOT NULL,
    "department" TEXT NOT NULL,
    "status" TEXT DEFAULT 'Off Shift',
    "phone" TEXT,
    "email" TEXT,
    "avatar_url" TEXT,
    "permissions" JSONB DEFAULT '[]'::jsonb,
    "created_at" TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

DROP TABLE IF EXISTS "Task" CASCADE;
CREATE TABLE IF NOT EXISTS "Task" (
    "id" UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    "title" TEXT NOT NULL,
    "description" TEXT,
    "area" TEXT,
    "time" TEXT,
    "priority" TEXT DEFAULT 'Normal',
    "status" TEXT DEFAULT 'Pending',
    "assigned_to" TEXT,
    "room_id" INTEGER REFERENCES "Room"("id") ON DELETE SET NULL,
    "created_at" TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS "KitchenOrder" (
    "id" UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    "table_id" TEXT NOT NULL,
    "items" JSONB NOT NULL,
    "status" TEXT DEFAULT 'Pending',
    "time" TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    "priority" TEXT DEFAULT 'Normal',
    "created_at" TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS "StockItem" (
    "id" UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    "name" TEXT NOT NULL,
    "level" TEXT NOT NULL,
    "status" TEXT DEFAULT 'Regular',
    "category" TEXT DEFAULT 'General',
    "created_at" TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS "SecurityLog" (
    "id" UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    "event" TEXT NOT NULL,
    "status" TEXT DEFAULT 'Info',
    "time" TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    "location" TEXT,
    "created_at" TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS "Settings" (
    "id" TEXT PRIMARY KEY DEFAULT 'global',
    "hotel_name" TEXT DEFAULT 'Golden Hills Hotel Setif',
    "address" TEXT,
    "contact_email" TEXT,
    "contact_phone" TEXT,
    "language" TEXT DEFAULT 'English',
    "timezone" TEXT DEFAULT '(GMT+01:00) Algiers, Casablanca, Tunis',
    "currency" TEXT DEFAULT 'DZD',
    "brand_color_primary" TEXT DEFAULT '#D4AF37',
    "brand_color_secondary" TEXT DEFAULT '#002349',
    "font_family" TEXT DEFAULT 'Inter',
    "hero_image_url" TEXT,
    "logo_url" TEXT,
    "password_min_length" INTEGER DEFAULT 8,
    "session_timeout" INTEGER DEFAULT 30,
    "two_factor_enabled" BOOLEAN DEFAULT FALSE,
    "data_retention_days" INTEGER DEFAULT 365,
    "email_notifications_reservations" BOOLEAN DEFAULT TRUE,
    "email_notifications_stock" BOOLEAN DEFAULT TRUE,
    "email_notifications_staff" BOOLEAN DEFAULT FALSE,
    "created_at" TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS "SecuritySystemStatus" (
    "id" TEXT PRIMARY KEY DEFAULT 'current',
    "lockdown_active" BOOLEAN DEFAULT FALSE,
    "biometric_locks" TEXT DEFAULT 'Active',
    "infrared_scanners" TEXT DEFAULT 'Active',
    "radio_silent" TEXT DEFAULT 'Inactive',
    "last_audit" TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    "system_health" INTEGER DEFAULT 100
);

DROP TABLE IF EXISTS "FinanceTransaction" CASCADE;
CREATE TABLE IF NOT EXISTS "FinanceTransaction" (
    "id" UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    "label" TEXT NOT NULL,
    "value" DOUBLE PRECISION NOT NULL,
    "type" TEXT NOT NULL,
    "category" TEXT NOT NULL,
    "is_up" BOOLEAN DEFAULT TRUE,
    "trend" TEXT,
    "date" TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

DROP TABLE IF EXISTS "Service" CASCADE;
CREATE TABLE IF NOT EXISTS "Service" (
    "id" UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    "name" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "description" TEXT,
    "image_url" TEXT,
    "hours" TEXT,
    "location" TEXT,
    "specialty" TEXT,
    "price" TEXT,
    "created_at" TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

DROP TABLE IF EXISTS "Review" CASCADE;
CREATE TABLE IF NOT EXISTS "Review" (
    "id" UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    "guest_id" UUID REFERENCES "Guest"("id") ON DELETE CASCADE,
    "room_id" INTEGER REFERENCES "Room"("id") ON DELETE SET NULL,
    "rating" INTEGER CHECK (rating >= 1 AND rating <= 5),
    "comment" TEXT,
    "created_at" TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Enable RLS on all tables
ALTER TABLE "Profile" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "Room" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "Reservation" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "Staff" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "Task" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "KitchenOrder" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "StockItem" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "SecurityLog" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "FinanceTransaction" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "Guest" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "Review" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "Service" ENABLE ROW LEVEL SECURITY;

-- Create Permissive Policies (FOR DEVELOPMENT)
DO $$ 
BEGIN
    BEGIN
        CREATE POLICY "Full access for all" ON "Profile" FOR ALL USING (true) WITH CHECK (true);
    EXCEPTION WHEN duplicate_object THEN NULL; END;

    BEGIN
        CREATE POLICY "Full access for all" ON "Room" FOR ALL USING (true) WITH CHECK (true);
    EXCEPTION WHEN duplicate_object THEN NULL; END;

    BEGIN
        CREATE POLICY "Full access for all" ON "Reservation" FOR ALL USING (true) WITH CHECK (true);
    EXCEPTION WHEN duplicate_object THEN NULL; END;

    BEGIN
        CREATE POLICY "Full access for all" ON "Staff" FOR ALL USING (true) WITH CHECK (true);
    EXCEPTION WHEN duplicate_object THEN NULL; END;

    BEGIN
        CREATE POLICY "Full access for all" ON "Task" FOR ALL USING (true) WITH CHECK (true);
    EXCEPTION WHEN duplicate_object THEN NULL; END;

    BEGIN
        CREATE POLICY "Full access for all" ON "KitchenOrder" FOR ALL USING (true) WITH CHECK (true);
    EXCEPTION WHEN duplicate_object THEN NULL; END;

    BEGIN
        CREATE POLICY "Full access for all" ON "StockItem" FOR ALL USING (true) WITH CHECK (true);
    EXCEPTION WHEN duplicate_object THEN NULL; END;

    BEGIN
        CREATE POLICY "Full access for all" ON "SecurityLog" FOR ALL USING (true) WITH CHECK (true);
    EXCEPTION WHEN duplicate_object THEN NULL; END;

    BEGIN
        CREATE POLICY "Full access for all" ON "FinanceTransaction" FOR ALL USING (true) WITH CHECK (true);
    EXCEPTION WHEN duplicate_object THEN NULL; END;

    BEGIN
        CREATE POLICY "Full access for all" ON "Guest" FOR ALL USING (true) WITH CHECK (true);
    EXCEPTION WHEN duplicate_object THEN NULL; END;

    BEGIN
        CREATE POLICY "Full access for all" ON "Review" FOR ALL USING (true) WITH CHECK (true);
    EXCEPTION WHEN duplicate_object THEN NULL; END;

    BEGIN
        CREATE POLICY "Full access for all" ON "Service" FOR ALL USING (true) WITH CHECK (true);
    EXCEPTION WHEN duplicate_object THEN NULL; END;

    BEGIN
        CREATE POLICY "Full access for all" ON "Settings" FOR ALL USING (true) WITH CHECK (true);
    EXCEPTION WHEN duplicate_object THEN NULL; END;

    BEGIN
        CREATE POLICY "Full access for all" ON "SecuritySystemStatus" FOR ALL USING (true) WITH CHECK (true);
    EXCEPTION WHEN duplicate_object THEN NULL; END;
END $$;

-- 2. Insert Base Foundational Data

-- Admin Profile
INSERT INTO "Profile" ("id", "email", "full_name", "role") 
VALUES (gen_random_uuid(), 'fares@goldenhills.dz', 'Fares Ahmed', 'admin')
ON CONFLICT ("email") DO NOTHING;

-- Foundational Guests
INSERT INTO "Guest" ("id", "full_name", "email", "phone", "avatar_url") VALUES
(gen_random_uuid(), 'Elena Romanov', 'elena.r@luxury.com', '+44 7700 900000', 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=150'),
(gen_random_uuid(), 'Mourad Brahimi', 'mourad.b@business.dz', '+213 550 11 22 33', NULL),
(gen_random_uuid(), 'Sarah Mansour', 'sarah.m@travel.fr', '+33 6 12 34 56 78', 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&q=80&w=150')
ON CONFLICT ("email") DO NOTHING;

-- Initial Guest Reviews
INSERT INTO "Review" ("guest_id", "rating", "comment")
SELECT id, 5, 'Exceptional service and stunning views of Sétif!' FROM "Guest" WHERE full_name = 'Elena Romanov'
UNION ALL
SELECT id, 4, 'Very comfortable stay, the spa is world-class.' FROM "Guest" WHERE full_name = 'Sarah Mansour'
ON CONFLICT DO NOTHING;

-- Realistic Floor 1 Rooms Setup (Heritage Deluxe)
INSERT INTO "Room" ("number", "type", "price", "status", "occupancy", "updated_at") VALUES
('101', 'Heritage Deluxe', 320, 'Vacant', 'Clean', CURRENT_TIMESTAMP),
('102', 'Heritage Deluxe', 320, 'Occupied', 'Clean', CURRENT_TIMESTAMP),
('103', 'Heritage Deluxe', 320, 'Vacant', 'Dirty', CURRENT_TIMESTAMP),
('104', 'Heritage Deluxe', 320, 'Cleaning', 'Cleaning', CURRENT_TIMESTAMP),
('105', 'Heritage Deluxe', 320, 'Maintenance', 'Dirty', CURRENT_TIMESTAMP)
ON CONFLICT ("number") DO NOTHING;

-- Realistic Floor 2 Rooms Setup (Royal Gold Suite)
INSERT INTO "Room" ("number", "type", "price", "status", "occupancy", "updated_at") VALUES
('201', 'Royal Gold Suite', 450, 'Vacant', 'Clean', CURRENT_TIMESTAMP),
('202', 'Royal Gold Suite', 450, 'Occupied', 'Clean', CURRENT_TIMESTAMP),
('203', 'Royal Gold Suite', 450, 'Occupied', 'Dirty', CURRENT_TIMESTAMP),
('204', 'Royal Gold Suite', 450, 'Vacant', 'Clean', CURRENT_TIMESTAMP)
ON CONFLICT ("number") DO NOTHING;

-- Floor 3: Presidential
INSERT INTO "Room" ("number", "type", "price", "status", "occupancy", "updated_at") VALUES
('301', 'Presidential Panorama', 850, 'Occupied', 'Clean', CURRENT_TIMESTAMP),
('302', 'Presidential Panorama', 850, 'Vacant', 'Clean', CURRENT_TIMESTAMP)
ON CONFLICT ("number") DO NOTHING;

-- Floor 4: Executive & Garden
INSERT INTO "Room" ("number", "type", "price", "status", "occupancy", "updated_at") VALUES
('401', 'Executive Hillside', 280, 'Vacant', 'Clean', CURRENT_TIMESTAMP),
('402', 'Executive Hillside', 280, 'Occupied', 'Clean', CURRENT_TIMESTAMP),
('403', 'Sapphire Garden Room', 190, 'Vacant', 'Clean', CURRENT_TIMESTAMP),
('404', 'Sapphire Garden Room', 190, 'Vacant', 'Clean', CURRENT_TIMESTAMP)
ON CONFLICT ("number") DO NOTHING;

-- Floor 5: Family Wing
INSERT INTO "Room" ("number", "type", "price", "status", "occupancy", "updated_at") VALUES
('501', 'Imperial Family Wing', 550, 'Vacant', 'Clean', CURRENT_TIMESTAMP),
('502', 'Imperial Family Wing', 550, 'Occupied', 'Clean', CURRENT_TIMESTAMP)
ON CONFLICT ("number") DO NOTHING;

-- Key Staff Members
INSERT INTO "Staff" ("id", "name", "role", "department", "status", "phone", "email") VALUES
(gen_random_uuid(), 'Youssef Benali', 'Executive Chef', 'Kitchen', 'On Shift', '+213 550 12 34 56', 'chef@goldenhills.dz'),
(gen_random_uuid(), 'Amina Kaddour', 'Head of Housekeeping', 'Housekeeping', 'On Shift', '+213 550 98 76 54', 'housekeeping@goldenhills.dz'),
(gen_random_uuid(), 'Karim Mansour', 'Security Chief', 'Security', 'Off Shift', '+213 551 22 33 44', 'security@goldenhills.dz'),
(gen_random_uuid(), 'Lina Haddad', 'Front Desk Manager', 'Reservations', 'On Shift', '+213 552 44 55 66', 'desk@goldenhills.dz');

-- Foundational Kitchen Inventory
INSERT INTO "StockItem" ("id", "name", "level", "status", "category") VALUES
(gen_random_uuid(), 'Fresh Saffron', '250g', 'Low', 'Spices'),
(gen_random_uuid(), 'Wagyu Beef Ribeye', '15kg', 'Regular', 'Meat'),
(gen_random_uuid(), 'Artemis Still Water', '120 Bottles', 'Regular', 'Beverages'),
(gen_random_uuid(), 'Truffle Oil', '2L', 'Critical', 'Condiments');

-- Recent Financial Transactions Context
INSERT INTO "FinanceTransaction" ("id", "label", "value", "type", "category", "is_up", "trend") VALUES
(gen_random_uuid(), 'Royal Suite Booking (3 Nights)', 1350, 'Revenue', 'Room Booking', TRUE, '+15%'),
(gen_random_uuid(), 'Grand Dining Service (Table 4)', 420, 'Revenue', 'F&B', TRUE, '+5%'),
(gen_random_uuid(), 'Maintenance Supplies (Q3)', 850, 'Expense', 'Maintenance', FALSE, '-2%'),
(gen_random_uuid(), 'Heritage Deluxe Booking', 320, 'Revenue', 'Room Booking', TRUE, '+0%');

-- Active Reservations
INSERT INTO "Reservation" ("id", "guest_name", "room_type", "room_id", "start_date", "end_date", "guests_count", "nights", "total_price", "status", "source") VALUES
(gen_random_uuid(), 'Elena Romanov', 'Royal Gold Suite', 1, CURRENT_DATE, CURRENT_DATE + INTERVAL '5 days', 2, 5, 2250, 'Checked-in', 'Luxury Web Portal'),
(gen_random_uuid(), 'Mourad Brahimi', 'Heritage Deluxe', 2, CURRENT_DATE - INTERVAL '1 day', CURRENT_DATE + INTERVAL '2 days', 2, 3, 960, 'Checked-in', 'GHE Member Portal'),
(gen_random_uuid(), 'Sarah Mansour', 'Presidential Panorama', 3, CURRENT_DATE + INTERVAL '2 days', CURRENT_DATE + INTERVAL '7 days', 3, 5, 4250, 'Confirmed', 'Concierge Service')
ON CONFLICT ("id") DO NOTHING;

-- Active Staff Tasks
INSERT INTO "Task" ("id", "title", "description", "priority", "status", "assigned_to", "room_id") VALUES
(gen_random_uuid(), 'Room 101 Deep Clean', 'Prepare for VIP arrival', 'High', 'Pending', 'Karim Brahimi', 1),
(gen_random_uuid(), 'Mini-bar Restock', 'Check inventory for Room 201', 'Normal', 'Pending', 'Karim Brahimi', 6),
(gen_random_uuid(), 'Lobby AC Inspection', 'Routine maintenance check', 'Normal', 'In Progress', 'Technical Team', NULL)
ON CONFLICT ("id") DO NOTHING;

-- Foundational Services
INSERT INTO "Service" ("id", "name", "type", "description", "hours", "location", "specialty", "image_url") VALUES
(gen_random_uuid(), 'Atlas Sky Lounge', 'Dining', 'Panoramic views of Setif with signature cocktails.', '18:00 - 01:00', 'Rooftop', 'Saffron Martini', 'https://images.unsplash.com/photo-1514362545857-3bc16c4c7d1b?auto=format&fit=crop&q=80&w=2070'),
(gen_random_uuid(), 'The Heritage Kitchen', 'Dining', 'Traditional Algerian cuisine with a modern twist.', '07:00 - 23:00', 'Lobby Level', 'Slow-cooked Couscous', 'https://images.unsplash.com/photo-1550966842-2849a2249821?auto=format&fit=crop&q=80&w=2070'),
(gen_random_uuid(), 'Numidian Spa', 'Spa', 'Ancient healing rituals using local botanical oils.', '09:00 - 21:00', 'Wellness Level', 'Atlas Stone Massage', 'https://images.unsplash.com/photo-1544161515-436cefb6579a?auto=format&fit=crop&q=80&w=2070')
ON CONFLICT DO NOTHING;

-- Initial Security Status
INSERT INTO "SecuritySystemStatus" ("id", "lockdown_active") VALUES ('current', FALSE) ON CONFLICT DO NOTHING;

-- Enable Realtime in Supabase for all these tables
-- You must run these in the Supabase SQL editor if not done automatically via Prisma
DROP PUBLICATION IF EXISTS supabase_realtime;
CREATE PUBLICATION supabase_realtime FOR TABLE "Room", "Reservation", "KitchenOrder", "Staff", "Task", "FinanceTransaction", "Guest", "Review", "Service", "SecurityLog", "Settings", "SecuritySystemStatus";
