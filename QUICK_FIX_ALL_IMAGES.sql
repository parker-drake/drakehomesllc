-- Quick fix to ensure all properties with images have a main_image set
-- Run this in Supabase SQL Editor

-- 1. First, show properties without any images at all
SELECT 
    id,
    title,
    location,
    status,
    created_at
FROM properties p
WHERE (main_image IS NULL OR main_image = '')
  AND NOT EXISTS (
    SELECT 1 FROM property_images 
    WHERE property_id = p.id
  )
ORDER BY created_at DESC;

-- 2. Fix properties that have images but no main_image set
UPDATE properties p
SET main_image = (
    SELECT image_url 
    FROM property_images 
    WHERE property_id = p.id 
    ORDER BY 
        CASE WHEN is_main THEN 0 ELSE 1 END,
        display_order,
        created_at
    LIMIT 1
)
WHERE (p.main_image IS NULL OR p.main_image = '')
  AND EXISTS (
    SELECT 1 FROM property_images 
    WHERE property_id = p.id
  );

-- 3. Show the results after the fix
SELECT 
    'Fixed' as status,
    COUNT(*) as count
FROM properties
WHERE main_image IS NOT NULL AND main_image != ''
UNION ALL
SELECT 
    'Still Missing Images',
    COUNT(*)
FROM properties
WHERE (main_image IS NULL OR main_image = '')
  AND NOT EXISTS (
    SELECT 1 FROM property_images 
    WHERE property_id = properties.id
  );
