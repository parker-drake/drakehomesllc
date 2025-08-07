-- Diagnostic queries to understand the current state of property images
-- Run these in your Supabase SQL Editor to diagnose the issue

-- 1. Overview of all properties and their image status
SELECT 
    'Total Properties' as metric,
    COUNT(*) as count
FROM properties
UNION ALL
SELECT 
    'Properties with main_image',
    COUNT(*)
FROM properties
WHERE main_image IS NOT NULL AND main_image != ''
UNION ALL
SELECT 
    'Properties without main_image',
    COUNT(*)
FROM properties
WHERE main_image IS NULL OR main_image = ''
UNION ALL
SELECT 
    'Properties with images in property_images table',
    COUNT(DISTINCT property_id)
FROM property_images;

-- 2. Detailed breakdown of properties missing images
SELECT 
    p.id,
    p.title,
    p.location,
    p.status,
    p.availability_status,
    p.created_at,
    CASE 
        WHEN p.main_image IS NOT NULL AND p.main_image != '' THEN 'Has main_image'
        WHEN pi.image_count > 0 THEN 'Has property_images only'
        ELSE 'No images'
    END as image_status,
    p.main_image,
    pi.image_count,
    pi.first_image_url
FROM properties p
LEFT JOIN (
    SELECT 
        property_id,
        COUNT(*) as image_count,
        MIN(image_url) as first_image_url,
        bool_or(is_main) as has_main_marked
    FROM property_images
    GROUP BY property_id
) pi ON p.id = pi.property_id
ORDER BY 
    CASE 
        WHEN p.main_image IS NULL AND pi.image_count IS NULL THEN 0
        WHEN p.main_image IS NULL AND pi.image_count > 0 THEN 1
        ELSE 2
    END,
    p.created_at DESC;

-- 3. Properties with mismatched main image settings
-- (main_image set but different from what's marked as main in property_images)
SELECT 
    p.id,
    p.title,
    p.main_image as properties_main_image,
    pi.image_url as property_images_main_image,
    CASE 
        WHEN p.main_image = pi.image_url THEN 'Matched'
        ELSE 'Mismatched'
    END as sync_status
FROM properties p
INNER JOIN property_images pi ON p.id = pi.property_id AND pi.is_main = true
WHERE p.main_image IS NOT NULL
ORDER BY sync_status, p.created_at DESC;

-- 4. Check for orphaned images (images in property_images for non-existent properties)
SELECT 
    pi.id,
    pi.property_id,
    pi.image_url,
    'Orphaned Image' as issue
FROM property_images pi
LEFT JOIN properties p ON pi.property_id = p.id
WHERE p.id IS NULL;

-- 5. Summary report for quick overview
WITH image_stats AS (
    SELECT 
        p.id,
        p.title,
        CASE 
            WHEN p.main_image IS NOT NULL THEN 1 ELSE 0 
        END as has_main_image,
        COALESCE(pi.image_count, 0) as property_images_count,
        COALESCE(pi.has_main_marked, false) as has_marked_main
    FROM properties p
    LEFT JOIN (
        SELECT 
            property_id,
            COUNT(*) as image_count,
            bool_or(is_main) as has_main_marked
        FROM property_images
        GROUP BY property_id
    ) pi ON p.id = pi.property_id
)
SELECT 
    'Properties needing attention' as category,
    COUNT(*) as count,
    STRING_AGG(title, ', ' ORDER BY title) as property_titles
FROM image_stats
WHERE has_main_image = 0 AND property_images_count = 0
UNION ALL
SELECT 
    'Properties with images but no main_image field',
    COUNT(*),
    STRING_AGG(title, ', ' ORDER BY title)
FROM image_stats
WHERE has_main_image = 0 AND property_images_count > 0
UNION ALL
SELECT 
    'Properties fully configured',
    COUNT(*),
    'All good!'
FROM image_stats
WHERE has_main_image = 1 OR (has_main_image = 0 AND property_images_count > 0 AND has_marked_main = true);
