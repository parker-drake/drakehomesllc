-- Add Property Information fields to properties table
-- Run this in your Supabase SQL Editor

ALTER TABLE properties 
ADD COLUMN lot_size TEXT,
ADD COLUMN year_built INTEGER,
ADD COLUMN property_type TEXT DEFAULT 'Single Family Home',
ADD COLUMN garage_spaces INTEGER,
ADD COLUMN heating_cooling TEXT,
ADD COLUMN flooring_type TEXT,
ADD COLUMN school_district TEXT,
ADD COLUMN hoa_fee TEXT,
ADD COLUMN utilities_included TEXT,
ADD COLUMN exterior_materials TEXT;

-- Add comments for documentation
COMMENT ON COLUMN properties.lot_size IS 'Property lot size (e.g., "0.25 acres", "8,500 sq ft")';
COMMENT ON COLUMN properties.year_built IS 'Year the property was built';
COMMENT ON COLUMN properties.property_type IS 'Type of property (Single Family Home, Townhome, Condo, etc.)';
COMMENT ON COLUMN properties.garage_spaces IS 'Number of garage spaces';
COMMENT ON COLUMN properties.heating_cooling IS 'Heating and cooling system type';
COMMENT ON COLUMN properties.flooring_type IS 'Primary flooring material';
COMMENT ON COLUMN properties.school_district IS 'School district name';
COMMENT ON COLUMN properties.hoa_fee IS 'HOA fee amount and frequency';
COMMENT ON COLUMN properties.utilities_included IS 'Which utilities are included';
COMMENT ON COLUMN properties.exterior_materials IS 'Exterior building materials'; 