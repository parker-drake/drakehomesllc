-- Create plans table
CREATE TABLE IF NOT EXISTS plans (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  description TEXT,
  square_footage INTEGER,
  bedrooms INTEGER,
  bathrooms DECIMAL(2,1),
  floors INTEGER DEFAULT 1,
  garage_spaces INTEGER DEFAULT 0,
  style VARCHAR(100), -- e.g., "Ranch", "Colonial", "Modern", "Craftsman"
  price DECIMAL(10,2), -- Base price for the plan
  main_image TEXT, -- URL to main plan image
  is_featured BOOLEAN DEFAULT FALSE,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create plan_images table for multiple images per plan
CREATE TABLE IF NOT EXISTS plan_images (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  plan_id UUID REFERENCES plans(id) ON DELETE CASCADE,
  image_url TEXT NOT NULL,
  image_type VARCHAR(50) DEFAULT 'photo', -- 'photo', 'floor_plan', 'elevation', 'interior'
  title VARCHAR(255),
  description TEXT,
  sort_order INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create plan_features table for features like "Master suite", "Open concept", etc.
CREATE TABLE IF NOT EXISTS plan_features (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  plan_id UUID REFERENCES plans(id) ON DELETE CASCADE,
  feature_name VARCHAR(255) NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_plans_is_active ON plans(is_active);
CREATE INDEX IF NOT EXISTS idx_plans_is_featured ON plans(is_featured);
CREATE INDEX IF NOT EXISTS idx_plans_style ON plans(style);
CREATE INDEX IF NOT EXISTS idx_plan_images_plan_id ON plan_images(plan_id);
CREATE INDEX IF NOT EXISTS idx_plan_features_plan_id ON plan_features(plan_id);

-- Add some sample data (optional)
INSERT INTO plans (title, description, square_footage, bedrooms, bathrooms, floors, garage_spaces, style, price, is_featured, is_active) VALUES
('The Madison', 'A beautiful ranch-style home with open concept living and modern amenities. Perfect for families seeking comfort and style.', 1850, 3, 2.0, 1, 2, 'Ranch', 189900.00, true, true),
('The Oakwood', 'Stunning two-story colonial featuring a grand foyer, formal dining room, and spacious family room with fireplace.', 2650, 4, 2.5, 2, 2, 'Colonial', 249900.00, true, true),
('The Riverside', 'Contemporary home design with clean lines, large windows, and an open floor plan perfect for entertaining.', 2200, 3, 2.0, 2, 2, 'Modern', 219900.00, false, true)
ON CONFLICT DO NOTHING;

-- Add sample features
INSERT INTO plan_features (plan_id, feature_name) 
SELECT id, unnest(ARRAY['Open Concept', 'Master Suite', 'Walk-in Closets', 'Two-Car Garage']) 
FROM plans WHERE title = 'The Madison'
ON CONFLICT DO NOTHING;

INSERT INTO plan_features (plan_id, feature_name) 
SELECT id, unnest(ARRAY['Formal Dining Room', 'Grand Foyer', 'Fireplace', 'Two-Story Design', 'Master Suite']) 
FROM plans WHERE title = 'The Oakwood'
ON CONFLICT DO NOTHING;

INSERT INTO plan_features (plan_id, feature_name) 
SELECT id, unnest(ARRAY['Contemporary Design', 'Large Windows', 'Open Floor Plan', 'Modern Kitchen', 'Two-Car Garage']) 
FROM plans WHERE title = 'The Riverside'
ON CONFLICT DO NOTHING; 