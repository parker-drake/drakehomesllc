-- RLS Policies for property_images table
-- This allows authenticated admin users to insert, update, and delete property images
-- And allows public read access for displaying images on the website

-- First, ensure the property_images table has RLS enabled
ALTER TABLE property_images ENABLE ROW LEVEL SECURITY;

-- Policy 1: Allow public read access (so images show on website)
CREATE POLICY "Public can view property images"
ON property_images
FOR SELECT
USING (true);

-- Policy 2: Allow authenticated users to insert images (admin uploads)
CREATE POLICY "Authenticated users can insert property images"
ON property_images
FOR INSERT
WITH CHECK (auth.role() = 'authenticated');

-- Policy 3: Allow authenticated users to update images (e.g., set as main image)
CREATE POLICY "Authenticated users can update property images"
ON property_images
FOR UPDATE
USING (auth.role() = 'authenticated')
WITH CHECK (auth.role() = 'authenticated');

-- Policy 4: Allow authenticated users to delete images (admin removes images)
CREATE POLICY "Authenticated users can delete property images"
ON property_images
FOR DELETE
USING (auth.role() = 'authenticated');

