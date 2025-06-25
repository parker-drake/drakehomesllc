-- Gallery Images Table
CREATE TABLE gallery_images (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  description TEXT,
  location VARCHAR(255),
  year VARCHAR(4),
  category VARCHAR(50) NOT NULL CHECK (category IN ('exterior', 'interior', 'kitchen', 'living', 'bedroom', 'bathroom')),
  image_url TEXT NOT NULL,
  image_path TEXT NOT NULL,
  sort_order INTEGER DEFAULT 0,
  is_featured BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Enable Row Level Security
ALTER TABLE gallery_images ENABLE ROW LEVEL SECURITY;

-- Policy to allow all operations (since admin will manage these)
CREATE POLICY "Allow all operations on gallery_images" ON gallery_images
FOR ALL USING (true);

-- Add indexes for better performance
CREATE INDEX gallery_images_category_idx ON gallery_images(category);
CREATE INDEX gallery_images_year_idx ON gallery_images(year);
CREATE INDEX gallery_images_featured_idx ON gallery_images(is_featured);
CREATE INDEX gallery_images_sort_order_idx ON gallery_images(sort_order);

-- Function to automatically update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = timezone('utc'::text, now());
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Trigger to automatically update updated_at when row is modified
CREATE TRIGGER update_gallery_images_updated_at BEFORE UPDATE ON gallery_images
FOR EACH ROW EXECUTE FUNCTION update_updated_at_column(); 