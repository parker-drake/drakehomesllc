-- Add multiple images support to properties table
-- Run this in your Supabase SQL Editor

-- First, rename the existing image column to main_image for clarity
ALTER TABLE properties 
RENAME COLUMN image TO main_image;

-- Add a new images column to store array of additional images
ALTER TABLE properties 
ADD COLUMN images TEXT[] DEFAULT '{}';

-- Add a main_image_index column to track which image is the main one (if using images array)
ALTER TABLE properties 
ADD COLUMN main_image_index INTEGER DEFAULT 0;

-- Alternative approach: Create a separate images table for better normalization
CREATE TABLE IF NOT EXISTS property_images (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  property_id UUID REFERENCES properties(id) ON DELETE CASCADE,
  image_url TEXT NOT NULL,
  is_main BOOLEAN DEFAULT FALSE,
  display_order INTEGER DEFAULT 0,
  alt_text TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create index for better performance
CREATE INDEX IF NOT EXISTS idx_property_images_property_id ON property_images(property_id);
CREATE INDEX IF NOT EXISTS idx_property_images_main ON property_images(property_id, is_main);

-- Enable RLS on property_images table
ALTER TABLE property_images ENABLE ROW LEVEL SECURITY;

-- Create policy for property_images (allow all operations)
CREATE POLICY "Allow all operations on property images" ON property_images
FOR ALL USING (true);

-- Function to ensure only one main image per property
CREATE OR REPLACE FUNCTION ensure_single_main_image()
RETURNS TRIGGER AS $$
BEGIN
  -- If setting this image as main, unset all other main images for this property
  IF NEW.is_main = TRUE THEN
    UPDATE property_images 
    SET is_main = FALSE 
    WHERE property_id = NEW.property_id AND id != NEW.id;
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger to enforce single main image
DROP TRIGGER IF EXISTS ensure_single_main_image_trigger ON property_images;
CREATE TRIGGER ensure_single_main_image_trigger
  BEFORE INSERT OR UPDATE ON property_images
  FOR EACH ROW
  EXECUTE FUNCTION ensure_single_main_image();

-- Example: Migrate existing main_image data to new structure
-- INSERT INTO property_images (property_id, image_url, is_main, display_order)
-- SELECT id, main_image, true, 0 
-- FROM properties 
-- WHERE main_image IS NOT NULL AND main_image != '';

COMMENT ON TABLE property_images IS 'Stores multiple images for each property with main image designation';
COMMENT ON COLUMN property_images.is_main IS 'Only one image per property should have is_main = true';
COMMENT ON COLUMN property_images.display_order IS 'Order for displaying images in gallery (0 = first)'; 