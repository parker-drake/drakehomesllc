-- Consolidate Primary and Accent Siding Colors under Exterior Category
-- Run this in your Supabase SQL Editor

-- First, get the exterior category ID
DO $$
DECLARE
    exterior_category_id UUID;
    primary_category_id UUID;
    accent_category_id UUID;
BEGIN
    -- Get category IDs
    SELECT id INTO exterior_category_id FROM customization_categories WHERE name = 'Exterior';
    SELECT id INTO primary_category_id FROM customization_categories WHERE name = 'Primary Siding Color';
    SELECT id INTO accent_category_id FROM customization_categories WHERE name = 'Accent Siding Color';
    
    -- Move all primary siding color options to exterior category with special naming
    IF primary_category_id IS NOT NULL AND exterior_category_id IS NOT NULL THEN
        UPDATE customization_options 
        SET category_id = exterior_category_id,
            name = 'Primary: ' || name,
            sort_order = sort_order + 1000  -- Move to end
        WHERE category_id = primary_category_id;
        
        RAISE NOTICE 'Moved primary siding color options to exterior category';
    END IF;
    
    -- Move all accent siding color options to exterior category with special naming
    IF accent_category_id IS NOT NULL AND exterior_category_id IS NOT NULL THEN
        UPDATE customization_options 
        SET category_id = exterior_category_id,
            name = 'Accent: ' || name,
            sort_order = sort_order + 2000  -- Move to end after primary
        WHERE category_id = accent_category_id;
        
        RAISE NOTICE 'Moved accent siding color options to exterior category';
    END IF;
    
    -- Delete the now-empty primary and accent categories
    DELETE FROM customization_categories 
    WHERE name IN ('Primary Siding Color', 'Accent Siding Color');
    
    -- Update step orders to remove gaps
    UPDATE customization_categories SET step_order = 1 WHERE name = 'Exterior';
    UPDATE customization_categories SET step_order = 2 WHERE name = 'Interior';
    UPDATE customization_categories SET step_order = 3 WHERE name = 'Kitchen';
    UPDATE customization_categories SET step_order = 4 WHERE name = 'Bathrooms';
    UPDATE customization_categories SET step_order = 5 WHERE name = 'Electrical';
    UPDATE customization_categories SET step_order = 6 WHERE name = 'Additional Features';
    
    RAISE NOTICE 'Consolidated siding colors under exterior category';
END $$;

-- Verify the consolidation
SELECT 
    c.name as category_name,
    c.step_order,
    COUNT(o.id) as option_count
FROM customization_categories c
LEFT JOIN customization_options o ON c.id = o.category_id
WHERE c.is_active = true
GROUP BY c.id, c.name, c.step_order
ORDER BY c.step_order;

-- Show the options in the exterior category
SELECT 
    o.name,
    o.description,
    o.is_default,
    o.sort_order
FROM customization_options o
JOIN customization_categories c ON o.category_id = c.id
WHERE c.name = 'Exterior'
ORDER BY o.sort_order; 