-- Create testimonials table for customer reviews
CREATE TABLE IF NOT EXISTS testimonials (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  customer_name VARCHAR(255) NOT NULL,
  location VARCHAR(255) NOT NULL,
  rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5) DEFAULT 5,
  testimonial_text TEXT NOT NULL,
  project_type VARCHAR(100),
  completion_date VARCHAR(50),
  is_featured BOOLEAN DEFAULT FALSE,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create index for faster queries
CREATE INDEX IF NOT EXISTS idx_testimonials_active ON testimonials(is_active);
CREATE INDEX IF NOT EXISTS idx_testimonials_featured ON testimonials(is_featured);
CREATE INDEX IF NOT EXISTS idx_testimonials_created_at ON testimonials(created_at DESC);

-- Enable Row Level Security
ALTER TABLE testimonials ENABLE ROW LEVEL SECURITY;

-- Policy: Anyone can read active testimonials
CREATE POLICY "Public can view active testimonials" ON testimonials
  FOR SELECT
  USING (is_active = true);

-- Policy: Authenticated users can do everything
CREATE POLICY "Authenticated users can manage testimonials" ON testimonials
  FOR ALL
  USING (auth.role() = 'authenticated');

-- Add updated_at trigger
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = CURRENT_TIMESTAMP;
  RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_testimonials_updated_at BEFORE UPDATE ON testimonials
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Insert sample data (optional - you can delete these and add real ones)
-- COMMENT OUT OR DELETE THESE after adding your real testimonials
INSERT INTO testimonials (customer_name, location, rating, testimonial_text, project_type, completion_date, is_featured, is_active) VALUES
('John & Sarah M.', 'Appleton, WI', 5, 'Drake Homes exceeded our expectations in every way. The quality of workmanship and attention to detail is outstanding. They built our dream home exactly as we envisioned it, and the whole process was smooth and professional.', 'Custom Home Build', '2024', true, false),
('Michael R.', 'Green Bay, WI', 5, 'After seeing shortcuts taken by other builders, we chose Drake Homes for their commitment to quality. Best decision we made! Our home is beautiful and built to last. The team was fantastic to work with.', 'Semi-Custom Home', '2024', true, false),
('Jennifer K.', 'Oshkosh, WI', 5, 'The Drake Homes team made our home building experience stress-free. They were responsive, professional, and went above and beyond. The quality of our home is exceptional - you can really see where quality and value meet!', 'Move-In Ready Home', '2023', true, false);

-- NOTE: The sample testimonials above have is_active = false so they won't show
-- Change is_active to true after you verify they look good, or delete them entirely

