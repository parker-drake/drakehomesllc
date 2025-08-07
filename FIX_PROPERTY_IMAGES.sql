-- Script to fix property image display issues
-- Run this in your Supabase SQL Editor

-- 1. First, let's see which properties have no main_image set
SELECT 
    p.id,
    p.title,
    p.location,
    p.main_image,
    COUNT(pi.id) as image_count,
    MIN(pi.image_url) as first_image_url
FROM properties p
LEFT JOIN property_images pi ON p.id = pi.property_id
WHERE p.main_image IS NULL OR p.main_image = ''
GROUP BY p.id, p.title, p.location, p.main_image
ORDER BY p.created_at DESC;

-- 2. Update properties that have images in property_images but no main_image
-- This will set the main_image to the first image marked as main, or the first image by display_order
UPDATE properties p
SET main_image = COALESCE(
    -- First try to get an image marked as main
    (SELECT image_url FROM property_images 
     WHERE property_id = p.id AND is_main = true 
     ORDER BY display_order 
     LIMIT 1),
    -- Otherwise get the first image by display order
    (SELECT image_url FROM property_images 
     WHERE property_id = p.id 
     ORDER BY display_order, created_at 
     LIMIT 1)
)
WHERE (p.main_image IS NULL OR p.main_image = '')
AND EXISTS (
    SELECT 1 FROM property_images 
    WHERE property_id = p.id
);

-- 3. Ensure at least one image is marked as main for properties with images
-- For properties that have property_images but none marked as main
WITH properties_needing_main AS (
    SELECT DISTINCT pi.property_id
    FROM property_images pi
    WHERE NOT EXISTS (
        SELECT 1 FROM property_images 
        WHERE property_id = pi.property_id AND is_main = true
    )
)
UPDATE property_images
SET is_main = true
WHERE (property_id, display_order) IN (
    SELECT property_id, MIN(display_order)
    FROM property_images
    WHERE property_id IN (SELECT property_id FROM properties_needing_main)
    GROUP BY property_id
);

-- 4. Create a view to make querying easier (optional)
CREATE OR REPLACE VIEW properties_with_images AS
SELECT 
    p.*,
    COALESCE(
        p.main_image,
        (SELECT image_url FROM property_images 
         WHERE property_id = p.id AND is_main = true 
         ORDER BY display_order LIMIT 1),
        (SELECT image_url FROM property_images 
         WHERE property_id = p.id 
         ORDER BY display_order LIMIT 1)
    ) as display_image
FROM properties p;

-- 5. Verify the fixes
SELECT 
    COUNT(*) as total_properties,
    COUNT(main_image) as properties_with_main_image,
    COUNT(*) - COUNT(main_image) as properties_without_main_image
FROM properties;
