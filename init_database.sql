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

CREATE TABLE IF NOT EXISTS "Reservation" (
    "id" UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    "guest_name" TEXT NOT NULL,
    "guests_count" INTEGER DEFAULT 1,
    "nights" INTEGER NOT NULL,
    "room_id" INTEGER REFERENCES "Room"("id") ON DELETE SET NULL,
    "room_type" TEXT NOT NULL,
    "start_date" TIMESTAMP WITH TIME ZONE NOT NULL,
    "end_date" TIMESTAMP WITH TIME ZONE NOT NULL,
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
    "created_at" TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS "Task" (
    "id" UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    "title" TEXT NOT NULL,
    "area" TEXT NOT NULL,
    "time" TEXT,
    "priority" TEXT DEFAULT 'Normal',
    "type" TEXT NOT NULL,
    "completed" BOOLEAN DEFAULT FALSE,
    "staff_id" UUID REFERENCES "Staff"("id") ON DELETE SET NULL,
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

-- 2. Insert Base Foundational Data

-- Admin Profile
INSERT INTO "Profile" ("id", "email", "full_name", "role") 
VALUES (gen_random_uuid()::text, 'fares@goldenhills.dz', 'Fares Ahmed', 'admin')
ON CONFLICT ("email") DO NOTHING;

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

-- Key Staff Members
INSERT INTO "Staff" ("id", "name", "role", "department", "status", "phone", "email") VALUES
(gen_random_uuid()::text, 'Youssef Benali', 'Executive Chef', 'Kitchen', 'On Shift', '+213 550 12 34 56', 'chef@goldenhills.dz'),
(gen_random_uuid()::text, 'Amina Kaddour', 'Head of Housekeeping', 'Housekeeping', 'On Shift', '+213 550 98 76 54', 'housekeeping@goldenhills.dz'),
(gen_random_uuid()::text, 'Karim Mansour', 'Security Chief', 'Security', 'Off Shift', '+213 551 22 33 44', 'security@goldenhills.dz'),
(gen_random_uuid()::text, 'Lina Haddad', 'Front Desk Manager', 'Reservations', 'On Shift', '+213 552 44 55 66', 'desk@goldenhills.dz');

-- Foundational Kitchen Inventory
INSERT INTO "StockItem" ("id", "name", "level", "status", "category") VALUES
(gen_random_uuid()::text, 'Fresh Saffron', '250g', 'Low', 'Spices'),
(gen_random_uuid()::text, 'Wagyu Beef Ribeye', '15kg', 'Regular', 'Meat'),
(gen_random_uuid()::text, 'Artemis Still Water', '120 Bottles', 'Regular', 'Beverages'),
(gen_random_uuid()::text, 'Truffle Oil', '2L', 'Critical', 'Condiments');

-- Recent Financial Transactions Context
INSERT INTO "FinanceTransaction" ("id", "label", "value", "type", "category", "is_up", "trend") VALUES
(gen_random_uuid()::text, 'Royal Suite Booking (3 Nights)', 1350, 'Revenue', 'Room Booking', TRUE, '+15%'),
(gen_random_uuid()::text, 'Grand Dining Service (Table 4)', 420, 'Revenue', 'F&B', TRUE, '+5%'),
(gen_random_uuid()::text, 'Maintenance Supplies (Q3)', 850, 'Expense', 'Maintenance', FALSE, '-2%'),
(gen_random_uuid()::text, 'Heritage Deluxe Booking', 320, 'Revenue', 'Room Booking', TRUE, '+0%');

-- Enable Realtime in Supabase for all these tables
-- You must run these in the Supabase SQL editor if not done automatically via Prisma
-- alter publication supabase_realtime add table "Room";
-- alter publication supabase_realtime add table "Reservation";
-- alter publication supabase_realtime add table "KitchenOrder";
-- alter publication supabase_realtime add table "Staff";
-- alter publication supabase_realtime add table "Task";
