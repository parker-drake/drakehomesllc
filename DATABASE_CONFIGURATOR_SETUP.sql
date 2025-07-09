-- Semi-Custom Home Configurator Database Schema
-- Run this in your Supabase SQL Editor

-- Create customization categories table (exterior, interior, structural, etc.)
CREATE TABLE IF NOT EXISTS customization_categories (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  description TEXT,
  step_order INTEGER NOT NULL,
  icon VARCHAR(50), -- Icon name for UI (e.g., 'home', 'palette', 'wrench')
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create customization options table (specific choices within each category)
CREATE TABLE IF NOT EXISTS customization_options (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  category_id UUID REFERENCES customization_categories(id) ON DELETE CASCADE,
  plan_id UUID REFERENCES plans(id) ON DELETE CASCADE, -- NULL = available for all plans
  name VARCHAR(255) NOT NULL,
  description TEXT,
  image_url TEXT,
  is_default BOOLEAN DEFAULT false,
  sort_order INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create customer configurations table (saved customer selections)
CREATE TABLE IF NOT EXISTS customer_configurations (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  plan_id UUID REFERENCES plans(id) ON DELETE CASCADE,
  customer_email VARCHAR(255),
  customer_name VARCHAR(255),
  customer_phone VARCHAR(20),
  customer_message TEXT,
  status VARCHAR(50) DEFAULT 'draft' CHECK (status IN ('draft', 'submitted', 'contacted', 'closed')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create configuration selections table (which options were chosen)
CREATE TABLE IF NOT EXISTS configuration_selections (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  configuration_id UUID REFERENCES customer_configurations(id) ON DELETE CASCADE,
  option_id UUID REFERENCES customization_options(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_customization_categories_step_order ON customization_categories(step_order);
CREATE INDEX IF NOT EXISTS idx_customization_options_category_id ON customization_options(category_id);
CREATE INDEX IF NOT EXISTS idx_customization_options_plan_id ON customization_options(plan_id);
CREATE INDEX IF NOT EXISTS idx_customer_configurations_plan_id ON customer_configurations(plan_id);
CREATE INDEX IF NOT EXISTS idx_customer_configurations_status ON customer_configurations(status);
CREATE INDEX IF NOT EXISTS idx_configuration_selections_config_id ON configuration_selections(configuration_id);

-- Enable Row Level Security
ALTER TABLE customization_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE customization_options ENABLE ROW LEVEL SECURITY;
ALTER TABLE customer_configurations ENABLE ROW LEVEL SECURITY;
ALTER TABLE configuration_selections ENABLE ROW LEVEL SECURITY;

-- Create policies for public read access to categories and options
CREATE POLICY "Categories are viewable by everyone" ON customization_categories
FOR SELECT USING (is_active = true);

CREATE POLICY "Options are viewable by everyone" ON customization_options
FOR SELECT USING (is_active = true);

-- Create policies for authenticated users to manage data
CREATE POLICY "Authenticated users can manage categories" ON customization_categories
FOR ALL USING (auth.role() = 'authenticated');

CREATE POLICY "Authenticated users can manage options" ON customization_options
FOR ALL USING (auth.role() = 'authenticated');

CREATE POLICY "Authenticated users can manage configurations" ON customer_configurations
FOR ALL USING (auth.role() = 'authenticated');

CREATE POLICY "Authenticated users can manage selections" ON configuration_selections
FOR ALL USING (auth.role() = 'authenticated');

-- Create policies for customers to save their own configurations
CREATE POLICY "Anyone can create configurations" ON customer_configurations
FOR INSERT WITH CHECK (true);

CREATE POLICY "Anyone can create selections" ON configuration_selections
FOR INSERT WITH CHECK (true);

-- Insert sample customization categories
INSERT INTO customization_categories (name, description, step_order, icon, is_active) VALUES
('Exterior', 'Exterior finishes and materials', 1, 'home', true),
('Interior', 'Interior finishes and flooring', 2, 'palette', true),
('Kitchen', 'Kitchen cabinets and countertops', 3, 'chef-hat', true),
('Bathrooms', 'Bathroom fixtures and finishes', 4, 'bath', true),
('Electrical', 'Electrical fixtures and outlets', 5, 'zap', true),
('Additional Features', 'Optional upgrades and features', 6, 'plus', true)
ON CONFLICT DO NOTHING;

-- Insert sample customization options
-- Exterior options
INSERT INTO customization_options (category_id, name, description, is_default, sort_order) 
SELECT id, 'Vinyl Siding', 'Standard vinyl siding in white or beige', true, 1
FROM customization_categories WHERE name = 'Exterior';

INSERT INTO customization_options (category_id, name, description, is_default, sort_order) 
SELECT id, 'Fiber Cement Siding', 'Durable fiber cement siding with wood grain texture', false, 2
FROM customization_categories WHERE name = 'Exterior';

INSERT INTO customization_options (category_id, name, description, is_default, sort_order) 
SELECT id, 'Brick Exterior', 'Traditional brick exterior with accent trim', false, 3
FROM customization_categories WHERE name = 'Exterior';

-- Interior options
INSERT INTO customization_options (category_id, name, description, is_default, sort_order) 
SELECT id, 'Carpet', 'Standard carpet throughout bedrooms and living areas', true, 1
FROM customization_categories WHERE name = 'Interior';

INSERT INTO customization_options (category_id, name, description, is_default, sort_order) 
SELECT id, 'Luxury Vinyl Plank', 'Water-resistant luxury vinyl plank flooring', false, 2
FROM customization_categories WHERE name = 'Interior';

INSERT INTO customization_options (category_id, name, description, is_default, sort_order) 
SELECT id, 'Hardwood Floors', 'Real hardwood flooring in main living areas', false, 3
FROM customization_categories WHERE name = 'Interior';

-- Kitchen options
INSERT INTO customization_options (category_id, name, description, is_default, sort_order) 
SELECT id, 'Standard Cabinets', 'White shaker-style cabinets with basic hardware', true, 1
FROM customization_categories WHERE name = 'Kitchen';

INSERT INTO customization_options (category_id, name, description, is_default, sort_order) 
SELECT id, 'Upgraded Cabinets', 'Soft-close cabinets with upgraded hardware', false, 2
FROM customization_categories WHERE name = 'Kitchen';

INSERT INTO customization_options (category_id, name, description, is_default, sort_order) 
SELECT id, 'Custom Cabinets', 'Full custom cabinetry with premium finishes', false, 3
FROM customization_categories WHERE name = 'Kitchen';

-- Bathroom options
INSERT INTO customization_options (category_id, name, description, is_default, sort_order) 
SELECT id, 'Standard Fixtures', 'Basic bathroom fixtures and finishes', true, 1
FROM customization_categories WHERE name = 'Bathrooms';

INSERT INTO customization_options (category_id, name, description, is_default, sort_order) 
SELECT id, 'Upgraded Fixtures', 'Upgraded faucets, lighting, and tile', false, 2
FROM customization_categories WHERE name = 'Bathrooms';

INSERT INTO customization_options (category_id, name, description, is_default, sort_order) 
SELECT id, 'Luxury Bath Package', 'Premium fixtures, tile, and vanities', false, 3
FROM customization_categories WHERE name = 'Bathrooms';

-- Electrical options
INSERT INTO customization_options (category_id, name, description, is_default, sort_order) 
SELECT id, 'Standard Electrical', 'Basic electrical package with standard outlets', true, 1
FROM customization_categories WHERE name = 'Electrical';

INSERT INTO customization_options (category_id, name, description, is_default, sort_order) 
SELECT id, 'Smart Home Ready', 'Pre-wired for smart home devices and USB outlets', false, 2
FROM customization_categories WHERE name = 'Electrical';

INSERT INTO customization_options (category_id, name, description, is_default, sort_order) 
SELECT id, 'Full Smart Home', 'Complete smart home automation system', false, 3
FROM customization_categories WHERE name = 'Electrical';

-- Additional features
INSERT INTO customization_options (category_id, name, description, is_default, sort_order) 
SELECT id, 'Covered Patio', 'Covered outdoor patio space', false, 1
FROM customization_categories WHERE name = 'Additional Features';

INSERT INTO customization_options (category_id, name, description, is_default, sort_order) 
SELECT id, 'Deck', 'Wooden deck off the back of the home', false, 2
FROM customization_categories WHERE name = 'Additional Features';

INSERT INTO customization_options (category_id, name, description, is_default, sort_order) 
SELECT id, 'Fireplace', 'Gas fireplace in living room', false, 3
FROM customization_categories WHERE name = 'Additional Features';

-- Function to automatically update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create triggers to automatically update updated_at
CREATE TRIGGER update_customization_categories_updated_at BEFORE UPDATE ON customization_categories
FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_customization_options_updated_at BEFORE UPDATE ON customization_options
FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_customer_configurations_updated_at BEFORE UPDATE ON customer_configurations
FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

COMMENT ON TABLE customization_categories IS 'Categories for home customization options (exterior, interior, etc.)';
COMMENT ON TABLE customization_options IS 'Individual customization options within each category';
COMMENT ON TABLE customer_configurations IS 'Saved customer home configurations';
COMMENT ON TABLE configuration_selections IS 'Selected options for each customer configuration'; 