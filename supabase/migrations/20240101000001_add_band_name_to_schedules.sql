-- Add band_name column and make band_id nullable
ALTER TABLE schedules 
    ADD COLUMN band_name TEXT,
    ALTER COLUMN band_id DROP NOT NULL; 