-- Add availability status field to properties table
-- Run this in your Supabase SQL Editor

ALTER TABLE properties 
ADD COLUMN availability_status TEXT DEFAULT 'Available' CHECK (availability_status IN ('Available', 'Under Contract', 'Coming Soon', 'Sold'));

-- Update existing properties to have 'Available' status by default
UPDATE properties 
SET availability_status = 'Available' 
WHERE availability_status IS NULL;

-- Add comment for documentation
COMMENT ON COLUMN properties.availability_status IS 'Property availability status: Available, Under Contract, Coming Soon, or Sold'; 