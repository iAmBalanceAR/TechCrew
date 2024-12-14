-- Add is_band_override column to schedules table
ALTER TABLE schedules
ADD COLUMN is_band_override BOOLEAN DEFAULT false;

-- Set all existing records to false
UPDATE schedules
SET is_band_override = false;

-- Then update only the records with band_name to true
UPDATE schedules
SET is_band_override = true
WHERE band_name IS NOT NULL; 