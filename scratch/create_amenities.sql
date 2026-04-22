-- Check if Amenity table exists, and add room_id if it's missing
DO $$ 
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_tables WHERE tablename = 'Amenity') THEN
        CREATE TABLE "Amenity" (
            "id" SERIAL PRIMARY KEY,
            "name" TEXT NOT NULL,
            "icon" TEXT,
            "room_id" INTEGER REFERENCES "Room"("id") ON DELETE CASCADE,
            "created_at" TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
        );
    ELSE
        -- Table exists, check if room_id column exists
        IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'Amenity' AND column_name = 'room_id') THEN
            ALTER TABLE "Amenity" ADD COLUMN "room_id" INTEGER REFERENCES "Room"("id") ON DELETE CASCADE;
        END IF;
    END IF;
END $$;

-- Enable RLS
ALTER TABLE "Amenity" ENABLE ROW LEVEL SECURITY;

-- Permissive Policy
DO $$ 
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Full access for all' AND tablename = 'Amenity') THEN
        CREATE POLICY "Full access for all" ON "Amenity" FOR ALL USING (true) WITH CHECK (true);
    END IF;
END $$;

-- Add to realtime (ignore error if already added)
DO $$
BEGIN
    BEGIN
        ALTER PUBLICATION supabase_realtime ADD TABLE "Amenity";
    EXCEPTION
        WHEN duplicate_object THEN
            NULL;
        WHEN others THEN
            NULL;
    END;
END $$;

-- Clear existing and insert foundational amenities
DELETE FROM "Amenity";

INSERT INTO "Amenity" (name, icon, room_id) VALUES
('High-Speed WiFi', 'Wifi', 1),
('Smart TV', 'Tv', 1),
('Coffee Machine', 'Coffee', 1),
('Climate Control', 'Wind', 1),
('Rain Shower', 'Bath', 1),
('City View', 'Sun', 1),
('High-Speed WiFi', 'Wifi', 2),
('Smart TV', 'Tv', 2),
('Coffee Machine', 'Coffee', 2),
('Climate Control', 'Wind', 2),
('High-Speed WiFi', 'Wifi', 6),
('Smart TV', 'Tv', 6),
('Ocean View', 'Waves', 6);
