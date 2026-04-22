-- Drop potential unique constraint on name
DO $$
BEGIN
    IF EXISTS (SELECT 1 FROM information_schema.table_constraints WHERE table_name = 'Amenity' AND constraint_type = 'UNIQUE') THEN
        -- Find the constraint name
        DECLARE
            constr_name TEXT;
        BEGIN
            SELECT constraint_name INTO constr_name FROM information_schema.table_constraints WHERE table_name = 'Amenity' AND constraint_type = 'UNIQUE' LIMIT 1;
            IF constr_name IS NOT NULL THEN
                EXECUTE 'ALTER TABLE "Amenity" DROP CONSTRAINT "' || constr_name || '"';
            END IF;
        END;
    END IF;
END $$;
