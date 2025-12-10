-- Selection Book Database Schema Updates
-- Run this in your Supabase SQL Editor

-- =====================================================
-- 1. ADD NEW COLUMNS TO customization_categories
-- =====================================================
ALTER TABLE customization_categories 
ADD COLUMN IF NOT EXISTS has_upgrades_section BOOLEAN DEFAULT false,
ADD COLUMN IF NOT EXISTS layout_type VARCHAR(50) DEFAULT 'list',
ADD COLUMN IF NOT EXISTS parent_section VARCHAR(100); -- e.g., 'EXTERIOR SELECTIONS', 'INTERIOR SELECTIONS'

-- =====================================================
-- 2. ADD NEW COLUMNS TO customization_options
-- =====================================================
ALTER TABLE customization_options 
ADD COLUMN IF NOT EXISTS option_type VARCHAR(50) DEFAULT 'radio',  -- radio, checkbox, text, image_select, color
ADD COLUMN IF NOT EXISTS price DECIMAL(10,2) DEFAULT 0,
ADD COLUMN IF NOT EXISTS is_upgrade BOOLEAN DEFAULT false,
ADD COLUMN IF NOT EXISTS group_name VARCHAR(100),  -- for sub-grouping (e.g., 'Front door', 'Fire door', 'Service door')
ADD COLUMN IF NOT EXISTS requires_text_input BOOLEAN DEFAULT false,
ADD COLUMN IF NOT EXISTS text_input_label VARCHAR(100),  -- e.g., 'Notes:', 'Color:'
ADD COLUMN IF NOT EXISTS display_columns INTEGER DEFAULT 1;  -- for grid layout

-- =====================================================
-- 3. ADD NEW COLUMNS TO configuration_selections
-- =====================================================
ALTER TABLE configuration_selections 
ADD COLUMN IF NOT EXISTS text_value TEXT,  -- for text inputs like color names, notes
ADD COLUMN IF NOT EXISTS price_at_selection DECIMAL(10,2) DEFAULT 0;

-- =====================================================
-- 4. ADD NEW COLUMNS TO customer_configurations
-- =====================================================
ALTER TABLE customer_configurations 
ADD COLUMN IF NOT EXISTS job_address TEXT,
ADD COLUMN IF NOT EXISTS notes TEXT,
ADD COLUMN IF NOT EXISTS created_by VARCHAR(255),  -- staff member who created it
ADD COLUMN IF NOT EXISTS total_upgrades_price DECIMAL(10,2) DEFAULT 0;

-- =====================================================
-- 5. CREATE SELECTION BOOK TEMPLATES TABLE (optional - for saving common setups)
-- =====================================================
CREATE TABLE IF NOT EXISTS selection_book_templates (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(255) NOT NULL,
  description TEXT,
  selections JSONB NOT NULL,  -- stored as JSON for flexibility
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  is_active BOOLEAN DEFAULT true
);

-- =====================================================
-- 6. UPDATE RLS POLICIES (if needed)
-- =====================================================
-- Allow authenticated users to read/write configurations
-- (Adjust based on your existing policies)

-- =====================================================
-- 7. SEED DATA: Create initial categories matching the Selection Book
-- =====================================================

-- First, let's update parent_section for existing categories or insert new ones
-- You can run these one at a time or modify based on your existing data

-- EXTERIOR SELECTIONS
INSERT INTO customization_categories (name, description, step_order, icon, is_active, parent_section, has_upgrades_section, layout_type)
VALUES 
  ('Windows', 'Window type, jamb, colors, and grille options', 1, 'square', true, 'EXTERIOR SELECTIONS', false, 'list'),
  ('Roofing', 'Shingle color and soffit/fascia/gutter options', 2, 'home', true, 'EXTERIOR SELECTIONS', false, 'list'),
  ('Siding', 'Siding brand, color, and accent options', 3, 'layers', true, 'EXTERIOR SELECTIONS', true, 'list'),
  ('Garage Doors', 'Garage door style, color, and options', 4, 'car', true, 'EXTERIOR SELECTIONS', true, 'list'),
  ('Garage Interior', 'Garage interior finish options', 5, 'warehouse', true, 'EXTERIOR SELECTIONS', true, 'list'),
  ('Exterior Doors', 'Front, fire, and service door selections', 6, 'door-open', true, 'EXTERIOR SELECTIONS', false, 'grid')
ON CONFLICT DO NOTHING;

-- INTERIOR SELECTIONS  
INSERT INTO customization_categories (name, description, step_order, icon, is_active, parent_section, has_upgrades_section, layout_type)
VALUES
  ('Interior Doors & Trim', 'Door style, stain/paint, and hardware', 7, 'door-closed', true, 'INTERIOR SELECTIONS', true, 'list'),
  ('Stair Case', 'Staircase style and railing options', 8, 'git-branch', true, 'INTERIOR SELECTIONS', false, 'list'),
  ('Flooring', 'Flooring selections by room', 9, 'grid', true, 'INTERIOR SELECTIONS', true, 'list'),
  ('Cabinets', 'Cabinet style, color, and hardware', 10, 'archive', true, 'INTERIOR SELECTIONS', true, 'list'),
  ('Countertops', 'Countertop material and color', 11, 'minus', true, 'INTERIOR SELECTIONS', true, 'list'),
  ('Plumbing Fixtures', 'Faucets, fixtures, and finishes', 12, 'droplet', true, 'INTERIOR SELECTIONS', true, 'list'),
  ('Electrical', 'Lighting and electrical options', 13, 'zap', true, 'INTERIOR SELECTIONS', true, 'list'),
  ('Fireplace', 'Fireplace style and finish', 14, 'flame', true, 'INTERIOR SELECTIONS', true, 'list')
ON CONFLICT DO NOTHING;

-- =====================================================
-- NOTE: Run this SQL in your Supabase Dashboard
-- Go to: SQL Editor > New Query > Paste this > Run
-- =====================================================

