-- Enable Realtime for the tables used by the application
-- This ensures the UI updates instantly when you save changes

-- 1. Create the publication if it doesn't exist
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_publication WHERE pubname = 'supabase_realtime') THEN
        CREATE PUBLICATION supabase_realtime;
    END IF;
END
$$;

-- 2. Add the tables to the publication
-- This is what actually triggers the "Realtime" updates in the browser
ALTER PUBLICATION supabase_realtime ADD TABLE "Room";
ALTER PUBLICATION supabase_realtime ADD TABLE "Settings";

-- 3. Ensure REPLICA IDENTITY is set to FULL if you want to receive old values (optional but good for debugging)
ALTER TABLE "Room" REPLICA IDENTITY FULL;
ALTER TABLE "Settings" REPLICA IDENTITY FULL;
