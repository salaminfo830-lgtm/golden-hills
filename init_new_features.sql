-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create Settings table
CREATE TABLE IF NOT EXISTS "Settings" (
    "id" TEXT PRIMARY KEY DEFAULT 'global',
    "hotel_name" TEXT DEFAULT 'Golden Hills Hotel Setif',
    "address" TEXT DEFAULT 'Blvd des Orangers, Setif, Algeria',
    "contact_email" TEXT DEFAULT 'contact@goldenhills.dz',
    "contact_phone" TEXT DEFAULT '+213 36 00 00 00',
    "language" TEXT DEFAULT 'English',
    "timezone" TEXT DEFAULT '(GMT+01:00) Algiers, Casablanca, Tunis',
    "currency" TEXT DEFAULT 'DZD',
    "logo_url" TEXT,
    "brand_color_primary" TEXT DEFAULT '#D4AF37', -- Gold
    "brand_color_secondary" TEXT DEFAULT '#002349', -- Deep Blue
    "font_family" TEXT DEFAULT 'Inter',
    "hero_image_url" TEXT DEFAULT 'https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?auto=format&fit=crop&q=80&w=2070',
    "password_min_length" INTEGER DEFAULT 8,
    "session_timeout" INTEGER DEFAULT 30, -- minutes
    "two_factor_enabled" BOOLEAN DEFAULT false,
    "data_retention_days" INTEGER DEFAULT 365,
    "updated_at" TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Insert default settings if not exists
INSERT INTO "Settings" (id) VALUES ('global') ON CONFLICT (id) DO NOTHING;

-- Create Notification table
CREATE TABLE IF NOT EXISTS "Notification" (
    "id" UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    "user_id" TEXT REFERENCES "Profile"("id") ON DELETE CASCADE,
    "title" TEXT NOT NULL,
    "message" TEXT NOT NULL,
    "type" TEXT DEFAULT 'info', -- info, success, warning, error
    "read" BOOLEAN DEFAULT false,
    "created_at" TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Update Staff table to include link to Profile if needed
-- (Assuming Profile and Staff already share the same ID based on RegisterPage logic)
