-- Remove Duplicate Customization Categories
-- Run this in your Supabase SQL Editor

-- First, let's see what duplicates exist
SELECT name, COUNT(*) as count
FROM customization_categories
GROUP BY name
HAVING COUNT(*) > 1;

-- Remove duplicate categories, keeping only the first one of each name
DELETE FROM customization_categories
WHERE id NOT IN (
    SELECT DISTINCT ON (name) id
    FROM customization_categories
    ORDER BY name, created_at ASC
);

-- Clean up any orphaned options that might reference deleted categories
DELETE FROM customization_options
WHERE category_id NOT IN (
    SELECT id FROM customization_categories
);

-- Reset and fix the step order to be sequential
UPDATE customization_categories SET step_order = 1 WHERE name = 'Exterior';
UPDATE customization_categories SET step_order = 2 WHERE name = 'Primary Siding Color';
UPDATE customization_categories SET step_order = 3 WHERE name = 'Accent Siding Color';
UPDATE customization_categories SET step_order = 4 WHERE name = 'Interior';
UPDATE customization_categories SET step_order = 5 WHERE name = 'Kitchen';
UPDATE customization_categories SET step_order = 6 WHERE name = 'Bathrooms';
UPDATE customization_categories SET step_order = 7 WHERE name = 'Electrical';
UPDATE customization_categories SET step_order = 8 WHERE name = 'Additional Features';

-- Verify the cleanup worked
SELECT 
    c.name as category_name,
    c.step_order,
    COUNT(o.id) as option_count
FROM customization_categories c
LEFT JOIN customization_options o ON c.id = o.category_id
WHERE c.is_active = true
GROUP BY c.id, c.name, c.step_order
ORDER BY c.step_order; 