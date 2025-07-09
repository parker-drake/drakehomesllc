-- Clean up duplicate siding colors - keep only one set for both primary and accent
-- Run this in your Supabase SQL Editor

-- Get the exterior category ID
DO $$
DECLARE
    exterior_category_id UUID;
BEGIN
    -- Get exterior category ID
    SELECT id INTO exterior_category_id FROM customization_categories WHERE name = 'Exterior';
    
    IF exterior_category_id IS NOT NULL THEN
        -- Remove "Primary:" and "Accent:" prefixes from option names
        UPDATE customization_options 
        SET name = REPLACE(REPLACE(name, 'Primary: ', ''), 'Accent: ', '')
        WHERE category_id = exterior_category_id 
        AND (name LIKE 'Primary:%' OR name LIKE 'Accent:%');
        
        -- Remove duplicate colors - keep only one of each color name
        DELETE FROM customization_options 
        WHERE id IN (
            SELECT sub.id FROM (
                SELECT co.id, 
                       ROW_NUMBER() OVER (PARTITION BY co.name ORDER BY co.created_at ASC) as rn
                FROM customization_options co
                WHERE co.category_id = exterior_category_id
                AND co.name NOT IN ('Vinyl Siding', 'Fiber Cement Siding', 'Brick Exterior') -- Keep material options
            ) sub
            WHERE sub.rn > 1
        );
        
        -- Reset sort orders - materials first (1-3), then colors (10+)
        UPDATE customization_options 
        SET sort_order = CASE 
            WHEN name = 'Vinyl Siding' THEN 1
            WHEN name = 'Fiber Cement Siding' THEN 2  
            WHEN name = 'Brick Exterior' THEN 3
            ELSE 10
        END
        WHERE category_id = exterior_category_id;
        
        RAISE NOTICE 'Cleaned up siding color duplicates';
    ELSE
        RAISE NOTICE 'Exterior category not found';
    END IF;
END $$;

-- Verify the cleanup
SELECT 
    name,
    description,
    is_default,
    sort_order
FROM customization_options o
JOIN customization_categories c ON o.category_id = c.id
WHERE c.name = 'Exterior'
ORDER BY o.sort_order; 