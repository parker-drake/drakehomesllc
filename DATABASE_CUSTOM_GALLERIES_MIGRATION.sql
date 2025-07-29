-- Migration to support custom galleries
-- This will transform the gallery system from fixed categories to custom galleries

-- Step 1: Create galleries table
CREATE TABLE IF NOT EXISTS galleries (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name VARCHAR(255) NOT NULL UNIQUE,
  slug VARCHAR(255) NOT NULL UNIQUE,
  description TEXT,
  cover_image_id UUID, -- Will reference gallery_images after migration
  sort_order INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Step 2: Create default galleries based on existing categories
INSERT INTO galleries (name, slug, description, sort_order) VALUES
  ('Exterior', 'exterior', 'Stunning exterior views of our custom homes', 1),
  ('Interior', 'interior', 'Beautiful interior designs and layouts', 2),
  ('Kitchen', 'kitchen', 'Modern and functional kitchen designs', 3),
  ('Living Areas', 'living', 'Comfortable and stylish living spaces', 4),
  ('Bedroom', 'bedroom', 'Cozy and elegant bedroom designs', 5),
  ('Bathroom', 'bathroom', 'Luxurious bathroom designs', 6)
ON CONFLICT (slug) DO NOTHING;

-- Step 3: Add gallery_id column to gallery_images table
ALTER TABLE gallery_images 
ADD COLUMN gallery_id UUID;

-- Step 4: Migrate existing categories to gallery references
UPDATE gallery_images gi
SET gallery_id = g.id
FROM galleries g
WHERE gi.category = g.slug;

-- Step 5: Make gallery_id NOT NULL after data migration
ALTER TABLE gallery_images 
ALTER COLUMN gallery_id SET NOT NULL;

-- Step 6: Add foreign key constraint
ALTER TABLE gallery_images
ADD CONSTRAINT fk_gallery_images_gallery 
FOREIGN KEY (gallery_id) REFERENCES galleries(id) ON DELETE CASCADE;

-- Step 7: Drop the CHECK constraint on category column
ALTER TABLE gallery_images 
DROP CONSTRAINT IF EXISTS gallery_images_category_check;

-- Step 8: Drop the old category column (optional - can keep for backward compatibility)
-- ALTER TABLE gallery_images DROP COLUMN category;
-- For now, we'll keep it but make it nullable
ALTER TABLE gallery_images 
ALTER COLUMN category DROP NOT NULL;

-- Step 9: Update the cover_image_id for galleries after gallery_images are populated
UPDATE galleries g
SET cover_image_id = (
  SELECT gi.id 
  FROM gallery_images gi 
  WHERE gi.gallery_id = g.id 
  AND gi.is_featured = true
  LIMIT 1
);

-- Step 10: Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_galleries_slug ON galleries(slug);
CREATE INDEX IF NOT EXISTS idx_galleries_is_active ON galleries(is_active);
CREATE INDEX IF NOT EXISTS idx_galleries_sort_order ON galleries(sort_order);
CREATE INDEX IF NOT EXISTS idx_gallery_images_gallery_id ON gallery_images(gallery_id);

-- Step 11: Enable RLS on galleries table
ALTER TABLE galleries ENABLE ROW LEVEL SECURITY;

-- Step 12: Create policy for galleries
CREATE POLICY "Allow all operations on galleries" ON galleries
FOR ALL USING (true);

-- Step 13: Create function to update updated_at timestamp for galleries
CREATE TRIGGER update_galleries_updated_at BEFORE UPDATE ON galleries
FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Step 14: Create a view for easy gallery statistics
CREATE OR REPLACE VIEW gallery_statistics AS
SELECT 
  g.id,
  g.name,
  g.slug,
  COUNT(gi.id) as image_count,
  COUNT(CASE WHEN gi.is_featured THEN 1 END) as featured_count,
  MAX(gi.created_at) as last_image_added
FROM galleries g
LEFT JOIN gallery_images gi ON g.id = gi.gallery_id
GROUP BY g.id, g.name, g.slug; 