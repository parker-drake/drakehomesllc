-- Add floor plan documents table
CREATE TABLE IF NOT EXISTS plan_documents (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  plan_id UUID REFERENCES plans(id) ON DELETE CASCADE,
  document_url TEXT NOT NULL,
  document_type VARCHAR(50) DEFAULT 'floor_plan', -- 'floor_plan', 'elevation', 'site_plan', 'specification'
  file_type VARCHAR(10) DEFAULT 'pdf', -- 'pdf', 'jpg', 'png', 'dwg'
  title VARCHAR(255),
  description TEXT,
  sort_order INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create index for better performance
CREATE INDEX IF NOT EXISTS idx_plan_documents_plan_id ON plan_documents(plan_id);

-- Add some sample floor plan documents (optional)
INSERT INTO plan_documents (plan_id, document_url, document_type, file_type, title, description, sort_order) 
SELECT id, 
       'https://example.com/floorplans/' || lower(replace(title, ' ', '_')) || '_floor_plan.pdf',
       'floor_plan',
       'pdf',
       title || ' - Floor Plan',
       'Detailed floor plan showing room layouts and dimensions',
       1
FROM plans WHERE title IN ('The Madison', 'The Oakwood', 'The Riverside')
ON CONFLICT DO NOTHING;

-- Add sample elevation documents
INSERT INTO plan_documents (plan_id, document_url, document_type, file_type, title, description, sort_order) 
SELECT id, 
       'https://example.com/elevations/' || lower(replace(title, ' ', '_')) || '_elevation.pdf',
       'elevation',
       'pdf',
       title || ' - Elevations',
       'Front, rear, and side elevation views',
       2
FROM plans WHERE title IN ('The Madison', 'The Oakwood', 'The Riverside')
ON CONFLICT DO NOTHING; 