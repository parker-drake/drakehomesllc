-- Database Performance Optimization for Drake Homes LLC
-- Run these commands in your Supabase SQL Editor

-- Create indexes for properties table
CREATE INDEX IF NOT EXISTS idx_properties_status ON properties(status);
CREATE INDEX IF NOT EXISTS idx_properties_availability_status ON properties(availability_status);
CREATE INDEX IF NOT EXISTS idx_properties_location ON properties(location);
CREATE INDEX IF NOT EXISTS idx_properties_price ON properties(price);
CREATE INDEX IF NOT EXISTS idx_properties_created_at ON properties(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_properties_beds_baths ON properties(beds, baths);

-- Create composite index for common queries
CREATE INDEX IF NOT EXISTS idx_properties_search ON properties(status, availability_status, price, beds, baths);

-- Create indexes for property_images table
CREATE INDEX IF NOT EXISTS idx_property_images_property_id ON property_images(property_id);
CREATE INDEX IF NOT EXISTS idx_property_images_is_main ON property_images(is_main);
CREATE INDEX IF NOT EXISTS idx_property_images_display_order ON property_images(display_order);

-- Create indexes for plans table
CREATE INDEX IF NOT EXISTS idx_plans_price ON plans(price);
CREATE INDEX IF NOT EXISTS idx_plans_beds_baths ON plans(bedrooms, bathrooms);
CREATE INDEX IF NOT EXISTS idx_plans_created_at ON plans(created_at DESC);

-- Create indexes for lots table
CREATE INDEX IF NOT EXISTS idx_lots_status ON lots(status);
CREATE INDEX IF NOT EXISTS idx_lots_price ON lots(price);
CREATE INDEX IF NOT EXISTS idx_lots_created_at ON lots(created_at DESC);

-- Create indexes for gallery table
CREATE INDEX IF NOT EXISTS idx_gallery_project_id ON gallery(project_id);
CREATE INDEX IF NOT EXISTS idx_gallery_display_order ON gallery(display_order);
CREATE INDEX IF NOT EXISTS idx_gallery_created_at ON gallery(created_at DESC);

-- Create text search configurations for better search performance
ALTER TABLE properties ADD COLUMN IF NOT EXISTS search_vector tsvector;

-- Update search vector for existing properties
UPDATE properties 
SET search_vector = to_tsvector('english', 
  coalesce(title, '') || ' ' || 
  coalesce(location, '') || ' ' || 
  coalesce(description, '') || ' ' || 
  coalesce(status, '') || ' ' ||
  coalesce(school_district, '')
);

-- Create index on search vector
CREATE INDEX IF NOT EXISTS idx_properties_search_vector ON properties USING gin(search_vector);

-- Create trigger to automatically update search vector
CREATE OR REPLACE FUNCTION update_properties_search_vector()
RETURNS trigger AS $$
BEGIN
  NEW.search_vector := to_tsvector('english',
    coalesce(NEW.title, '') || ' ' ||
    coalesce(NEW.location, '') || ' ' ||
    coalesce(NEW.description, '') || ' ' ||
    coalesce(NEW.status, '') || ' ' ||
    coalesce(NEW.school_district, '')
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER properties_search_vector_update 
BEFORE INSERT OR UPDATE ON properties
FOR EACH ROW 
EXECUTE FUNCTION update_properties_search_vector();

-- Optimize table statistics
ANALYZE properties;
ANALYZE property_images;
ANALYZE plans;
ANALYZE lots;
ANALYZE gallery;

-- Enable query performance insights (if not already enabled)
-- Note: These are suggestions for monitoring - verify with your Supabase plan
-- ALTER DATABASE postgres SET log_statement = 'all';
-- ALTER DATABASE postgres SET log_duration = on;
-- ALTER DATABASE postgres SET log_min_duration_statement = 100; 