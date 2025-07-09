-- Add Primary and Accent Siding Color Categories
-- Run this in your Supabase SQL Editor

-- Insert the new categories
INSERT INTO customization_categories (name, description, step_order, icon, is_active) VALUES
('Primary Siding Color', 'Choose your primary siding color', 2, 'home', true),
('Accent Siding Color', 'Choose your accent siding color', 3, 'palette', true)
ON CONFLICT DO NOTHING;

-- Update step orders to make room for the new categories
-- Move existing categories to higher step numbers
UPDATE customization_categories 
SET step_order = step_order + 2 
WHERE name IN ('Interior', 'Kitchen', 'Bathrooms', 'Electrical', 'Additional Features');

-- Sample siding color options for both categories
-- You can customize these colors to match your actual options

-- Get category IDs for inserting options
DO $$
DECLARE
    primary_category_id UUID;
    accent_category_id UUID;
BEGIN
    -- Get category IDs
    SELECT id INTO primary_category_id FROM customization_categories WHERE name = 'Primary Siding Color';
    SELECT id INTO accent_category_id FROM customization_categories WHERE name = 'Accent Siding Color';
    
    -- Insert siding color options for PRIMARY category
    INSERT INTO customization_options (category_id, name, description, is_default, sort_order) VALUES
    (primary_category_id, 'Arctic White', 'Classic white vinyl siding', true, 1),
    (primary_category_id, 'Pebblestone Clay', 'Warm beige with natural texture', false, 2),
    (primary_category_id, 'Harbor Blue', 'Coastal blue-gray tone', false, 3),
    (primary_category_id, 'Sage Green', 'Soft sage green color', false, 4),
    (primary_category_id, 'Charcoal Gray', 'Deep charcoal gray', false, 5),
    (primary_category_id, 'Sandstone Beige', 'Natural sandstone color', false, 6),
    (primary_category_id, 'Forest Green', 'Rich forest green', false, 7),
    (primary_category_id, 'Cream', 'Warm cream color', false, 8),
    (primary_category_id, 'Slate Blue', 'Sophisticated blue-gray', false, 9),
    (primary_category_id, 'Harvest Gold', 'Warm golden yellow', false, 10),
    (primary_category_id, 'Burgundy', 'Deep burgundy red', false, 11),
    (primary_category_id, 'Pewter Gray', 'Light pewter gray', false, 12),
    (primary_category_id, 'Woodland Brown', 'Natural wood brown', false, 13),
    (primary_category_id, 'Coastal Fog', 'Light blue-gray', false, 14),
    (primary_category_id, 'Vintage Wicker', 'Warm tan color', false, 15),
    (primary_category_id, 'Castle Stone', 'Gray stone color', false, 16),
    (primary_category_id, 'Autumn Red', 'Rich autumn red', false, 17),
    (primary_category_id, 'Midnight Blue', 'Deep midnight blue', false, 18),
    (primary_category_id, 'Musket Brown', 'Dark brown color', false, 19),
    (primary_category_id, 'Twilight Gray', 'Medium gray tone', false, 20);
    
    -- Insert the same options for ACCENT category
    INSERT INTO customization_options (category_id, name, description, is_default, sort_order) VALUES
    (accent_category_id, 'Arctic White', 'Classic white vinyl siding', false, 1),
    (accent_category_id, 'Pebblestone Clay', 'Warm beige with natural texture', true, 2),
    (accent_category_id, 'Harbor Blue', 'Coastal blue-gray tone', false, 3),
    (accent_category_id, 'Sage Green', 'Soft sage green color', false, 4),
    (accent_category_id, 'Charcoal Gray', 'Deep charcoal gray', false, 5),
    (accent_category_id, 'Sandstone Beige', 'Natural sandstone color', false, 6),
    (accent_category_id, 'Forest Green', 'Rich forest green', false, 7),
    (accent_category_id, 'Cream', 'Warm cream color', false, 8),
    (accent_category_id, 'Slate Blue', 'Sophisticated blue-gray', false, 9),
    (accent_category_id, 'Harvest Gold', 'Warm golden yellow', false, 10),
    (accent_category_id, 'Burgundy', 'Deep burgundy red', false, 11),
    (accent_category_id, 'Pewter Gray', 'Light pewter gray', false, 12),
    (accent_category_id, 'Woodland Brown', 'Natural wood brown', false, 13),
    (accent_category_id, 'Coastal Fog', 'Light blue-gray', false, 14),
    (accent_category_id, 'Vintage Wicker', 'Warm tan color', false, 15),
    (accent_category_id, 'Castle Stone', 'Gray stone color', false, 16),
    (accent_category_id, 'Autumn Red', 'Rich autumn red', false, 17),
    (accent_category_id, 'Midnight Blue', 'Deep midnight blue', false, 18),
    (accent_category_id, 'Musket Brown', 'Dark brown color', false, 19),
    (accent_category_id, 'Twilight Gray', 'Medium gray tone', false, 20);
END $$;

-- Verify the setup
SELECT 
    c.name as category_name,
    c.step_order,
    COUNT(o.id) as option_count
FROM customization_categories c
LEFT JOIN customization_options o ON c.id = o.category_id
WHERE c.is_active = true
GROUP BY c.id, c.name, c.step_order
ORDER BY c.step_order; 