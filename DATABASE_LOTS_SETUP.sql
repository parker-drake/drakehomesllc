-- Create Available Lots Tables
-- ================================

-- Main Lots Table
CREATE TABLE IF NOT EXISTS lots (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    lot_number TEXT NOT NULL,
    address TEXT,
    city TEXT DEFAULT 'Appleton',
    state TEXT DEFAULT 'Wisconsin',
    zip_code TEXT DEFAULT '54913',
    subdivision TEXT,
    lot_size DECIMAL(10,2), -- in acres
    price DECIMAL(10,2),
    status TEXT DEFAULT 'available' CHECK (status IN ('available', 'reserved', 'sold')),
    latitude DECIMAL(10,8),
    longitude DECIMAL(11,8),
    description TEXT,
    main_image TEXT,
    utilities_status TEXT,
    hoa_fees DECIMAL(10,2),
    school_district TEXT,
    is_featured BOOLEAN DEFAULT false,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Lot Images Table
CREATE TABLE IF NOT EXISTS lot_images (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    lot_id UUID NOT NULL REFERENCES lots(id) ON DELETE CASCADE,
    image_url TEXT NOT NULL,
    image_type TEXT DEFAULT 'photo' CHECK (image_type IN ('photo', 'survey', 'aerial', 'plat', 'other')),
    title TEXT,
    description TEXT,
    sort_order INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Lot Features Table (amenities, characteristics)
CREATE TABLE IF NOT EXISTS lot_features (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    lot_id UUID NOT NULL REFERENCES lots(id) ON DELETE CASCADE,
    feature_name TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_lots_status ON lots(status);
CREATE INDEX IF NOT EXISTS idx_lots_featured ON lots(is_featured);
CREATE INDEX IF NOT EXISTS idx_lots_active ON lots(is_active);
CREATE INDEX IF NOT EXISTS idx_lot_images_lot_id ON lot_images(lot_id);
CREATE INDEX IF NOT EXISTS idx_lot_features_lot_id ON lot_features(lot_id);

-- Sample data insert (optional - remove in production)
INSERT INTO lots (lot_number, address, subdivision, lot_size, price, latitude, longitude, description, utilities_status, school_district, is_featured) VALUES
('Lot 15', '1234 Meadowbrook Lane', 'Meadowbrook Estates', 0.52, 75000, 44.2619, -88.4154, 'Beautiful corner lot with mature trees and easy access to parks and schools.', 'All utilities available at street', 'Appleton Area School District', true),
('Lot 23', '5678 Oak Ridge Drive', 'Oak Ridge Subdivision', 0.38, 62000, 44.2789, -88.3987, 'Level lot ready for building in established neighborhood.', 'All utilities available', 'Appleton Area School District', false),
('Lot 7', '910 Prairie View Court', 'Prairie View', 0.75, 95000, 44.2456, -88.4321, 'Spacious lot with scenic views, perfect for a walkout basement design.', 'Electric and gas at street, water and sewer available', 'Kimberly Area School District', true)
ON CONFLICT DO NOTHING; 