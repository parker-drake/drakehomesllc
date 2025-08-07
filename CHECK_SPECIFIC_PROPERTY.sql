-- Check the specific property "2044 White Dove Ln" for image issues
-- Run this in your Supabase SQL Editor

-- 1. Check the property details and image status
SELECT 
    p.id,
    p.title,
    p.location,
    p.main_image,
    p.status,
    p.availability_status,
    COUNT(pi.id) as property_images_count,
    ARRAY_AGG(pi.image_url ORDER BY pi.display_order) as all_image_urls,
    bool_or(pi.is_main) as has_main_in_property_images
FROM properties p
LEFT JOIN property_images pi ON p.id = pi.property_id
WHERE p.location LIKE '%2044 White Dove%' 
   OR p.title LIKE '%2044 White Dove%'
GROUP BY p.id, p.title, p.location, p.main_image, p.status, p.availability_status;

-- 2. If property found, also check the property_images table details
SELECT 
    pi.*,
    p.title,
    p.main_image as property_main_image
FROM property_images pi
JOIN properties p ON pi.property_id = p.id
WHERE p.location LIKE '%2044 White Dove%' 
   OR p.title LIKE '%2044 White Dove%'
ORDER BY pi.display_order;

-- 3. Check if there are any properties with "Kaukauna" in the location without images
SELECT 
    p.id,
    p.title,
    p.location,
    p.main_image,
    COUNT(pi.id) as image_count
FROM properties p
LEFT JOIN property_images pi ON p.id = pi.property_id
WHERE p.location LIKE '%Kaukauna%'
  AND (p.main_image IS NULL OR p.main_image = '')
  AND NOT EXISTS (
    SELECT 1 FROM property_images 
    WHERE property_id = p.id
  )
GROUP BY p.id, p.title, p.location, p.main_image
ORDER BY p.created_at DESC;
