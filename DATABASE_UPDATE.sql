-- Add latitude and longitude columns to properties table for map functionality
-- Run this in your Supabase SQL Editor

ALTER TABLE properties 
ADD COLUMN latitude DECIMAL(10,8),
ADD COLUMN longitude DECIMAL(11,8);

-- Update existing properties with example coordinates
-- (You can update these to actual coordinates later)

UPDATE properties 
SET latitude = 29.7604, longitude = -95.3698 
WHERE location LIKE '%Willowbrook%';

UPDATE properties 
SET latitude = 32.7767, longitude = -96.7970 
WHERE location LIKE '%Heritage Hills%';

UPDATE properties 
SET latitude = 30.2672, longitude = -97.7431 
WHERE location LIKE '%Oak Ridge%';

-- You can add more coordinate updates for other properties as needed 