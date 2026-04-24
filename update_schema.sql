-- Golden Hills Security & Payments Schema Update

-- 1. Extend Reservation Table
ALTER TABLE "Reservation" ADD COLUMN IF NOT EXISTS "payment_status" TEXT DEFAULT 'Unpaid';
ALTER TABLE "Reservation" ADD COLUMN IF NOT EXISTS "payment_method" TEXT;
ALTER TABLE "Reservation" ADD COLUMN IF NOT EXISTS "cancellation_policy" TEXT DEFAULT 'Standard (24h Free)';
ALTER TABLE "Reservation" ADD COLUMN IF NOT EXISTS "special_requests" TEXT;
ALTER TABLE "Reservation" ADD COLUMN IF NOT EXISTS "check_in_time" TIMESTAMP WITH TIME ZONE;
ALTER TABLE "Reservation" ADD COLUMN IF NOT EXISTS "reference_number" TEXT;
ALTER TABLE "Reservation" ADD COLUMN IF NOT EXISTS "modification_log" JSONB DEFAULT '[]'::jsonb;

-- 2. Extend Settings Table for Business Logic
ALTER TABLE "Settings" ADD COLUMN IF NOT EXISTS "no_show_threshold_hours" INTEGER DEFAULT 18; -- 6PM
ALTER TABLE "Settings" ADD COLUMN IF NOT EXISTS "bank_transfer_deadline_hours" INTEGER DEFAULT 24;
ALTER TABLE "Settings" ADD COLUMN IF NOT EXISTS "cancellation_free_window_hours" INTEGER DEFAULT 24;
ALTER TABLE "Settings" ADD COLUMN IF NOT EXISTS "paypal_client_id" TEXT;
ALTER TABLE "Settings" ADD COLUMN IF NOT EXISTS "deposit_required_percent" INTEGER DEFAULT 0;

-- 3. Create Audit Log / Security Log Table (if not exists with right structure)
CREATE TABLE IF NOT EXISTS "AuditLog" (
    "id" UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    "actor_id" UUID,
    "actor_name" TEXT,
    "action" TEXT NOT NULL,
    "entity_type" TEXT, -- Reservation, Payment, Auth, Admin
    "entity_id" TEXT,
    "details" JSONB,
    "ip_address" TEXT,
    "created_at" TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Security Log Table
CREATE TABLE IF NOT EXISTS "SecurityLog" (
    "id" UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    "event" TEXT NOT NULL,
    "location" TEXT,
    "status" TEXT DEFAULT 'Info', -- Critical, Warning, Info
    "time" TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Security System Status Table
CREATE TABLE IF NOT EXISTS "SecuritySystemStatus" (
    "id" TEXT PRIMARY KEY DEFAULT 'current',
    "lockdown_active" BOOLEAN DEFAULT false,
    "biometric_locks" TEXT DEFAULT 'Active',
    "infrared_scanners" TEXT DEFAULT 'Active',
    "radio_silent" TEXT DEFAULT 'Inactive',
    "system_health" INTEGER DEFAULT 100,
    "last_audit" TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Seed initial status if not exists
INSERT INTO "SecuritySystemStatus" (id, lockdown_active, biometric_locks, infrared_scanners, radio_silent, system_health, last_audit)
VALUES ('current', false, 'Active', 'Active', 'Inactive', 100, CURRENT_TIMESTAMP)
ON CONFLICT (id) DO NOTHING;

-- 4. Double Booking Prevention Function & Trigger
CREATE OR REPLACE FUNCTION check_room_availability()
RETURNS TRIGGER AS $$
BEGIN
    IF EXISTS (
        SELECT 1 FROM "Reservation"
        WHERE room_id = NEW.room_id
        AND status NOT IN ('Cancelled', 'No-Show')
        AND (
            (NEW.start_date >= start_date AND NEW.start_date < end_date) OR
            (NEW.end_date > start_date AND NEW.end_date <= end_date) OR
            (NEW.start_date <= start_date AND NEW.end_date >= end_date)
        )
        AND id != NEW.id
    ) THEN
        RAISE EXCEPTION 'Room is already booked for these dates.';
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trg_check_room_availability ON "Reservation";
CREATE TRIGGER trg_check_room_availability
BEFORE INSERT OR UPDATE ON "Reservation"
FOR EACH ROW EXECUTE FUNCTION check_room_availability();

-- 5. Realtime support
ALTER PUBLICATION supabase_realtime ADD TABLE "AuditLog", "SecurityLog", "SecuritySystemStatus";

-- 6. RLS Hardening (Sample for Reservation)
ALTER TABLE "Reservation" ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Guests can see their own reservations" ON "Reservation";
CREATE POLICY "Guests can see their own reservations" ON "Reservation"
    FOR SELECT USING (auth.uid() = guest_id);

DROP POLICY IF EXISTS "Staff can see all reservations" ON "Reservation";
CREATE POLICY "Staff can see all reservations" ON "Reservation"
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM "Profile"
            WHERE id = auth.uid() AND (role = 'admin' OR role = 'staff')
        )
    );
