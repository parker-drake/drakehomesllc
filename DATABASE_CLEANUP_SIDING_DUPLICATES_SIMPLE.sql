-- Clean up duplicate siding colors
-- Run this in your Supabase SQL Editor

-- Step 1: Remove Primary and Accent prefixes from option names
UPDATE customization_options 
SET name = REPLACE(REPLACE(name, 'Primary: ', ''), 'Accent: ', '')
WHERE category_id IN (SELECT id FROM customization_categories WHERE name = 'Exterior')
AND (name LIKE 'Primary:%' OR name LIKE 'Accent:%');

-- Step 2: Remove duplicate colors (keep only the first one of each name)
WITH duplicates_to_remove AS (
    SELECT co.id
    FROM customization_options co
    JOIN customization_categories cc ON co.category_id = cc.id
    WHERE cc.name = 'Exterior'
    AND co.name NOT IN ('Vinyl Siding', 'Fiber Cement Siding', 'Brick Exterior')
    AND co.id NOT IN (
        SELECT DISTINCT ON (co2.name) co2.id
        FROM customization_options co2
        JOIN customization_categories cc2 ON co2.category_id = cc2.id
        WHERE cc2.name = 'Exterior'
        AND co2.name NOT IN ('Vinyl Siding', 'Fiber Cement Siding', 'Brick Exterior')
        ORDER BY co2.name, co2.created_at ASC
    )
)
DELETE FROM customization_options 
WHERE id IN (SELECT id FROM duplicates_to_remove);

-- Step 3: Reset sort orders
UPDATE customization_options 
SET sort_order = CASE 
    WHEN name = 'Vinyl Siding' THEN 1
    WHEN name = 'Fiber Cement Siding' THEN 2  
    WHEN name = 'Brick Exterior' THEN 3
    ELSE 10
END
WHERE category_id IN (SELECT id FROM customization_categories WHERE name = 'Exterior');

-- Step 4: Verify the cleanup
SELECT 
    o.name,
    o.description,
    o.is_default,
    o.sort_order
FROM customization_options o
JOIN customization_categories c ON o.category_id = c.id
WHERE c.name = 'Exterior'
ORDER BY o.sort_order; 