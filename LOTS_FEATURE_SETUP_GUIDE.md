# Available Lots Feature Setup Guide

## Overview
The Available Lots feature allows you to showcase available land/lots for sale where customers can build homes.

## Database Setup

1. **Run the SQL Script**
   Execute the `DATABASE_LOTS_SETUP.sql` file in your Supabase SQL editor:
   - Go to your Supabase project dashboard
   - Navigate to SQL Editor
   - Create a new query
   - Copy and paste the contents of `DATABASE_LOTS_SETUP.sql`
   - Click "Run" to execute

   This will create:
   - `lots` table - Main table for lot information
   - `lot_images` table - Additional images for each lot
   - `lot_features` table - Features/amenities for each lot
   - Necessary indexes for performance
   - Sample data (3 example lots)

## Features

### Customer-Facing Pages

1. **Lots Listing Page** (`/lots`)
   - Grid view of all available lots
   - Filter by subdivision
   - Sort by featured, price, or size
   - Shows key information: lot number, size, price, location, school district

2. **Individual Lot Page** (`/lots/[id]`)
   - Image gallery with different image types (photo, survey, aerial, plat)
   - Detailed information including GPS coordinates
   - Interactive map showing lot location
   - Features list
   - Contact buttons for scheduling site visits

### Admin Features

1. **Manage Lots** (`/admin/lots`)
   - Add new lots with all details
   - Edit existing lots
   - Upload main image and additional images
   - Set GPS coordinates for map display
   - Manage lot features
   - Mark lots as featured
   - Change lot status (available, reserved, sold)

## Key Fields

- **Lot Number**: Identifier like "Lot 15"
- **Subdivision**: Development name
- **Address**: Optional street address
- **Lot Size**: In acres
- **Price**: Lot price
- **Status**: Available, Reserved, or Sold
- **GPS Coordinates**: Latitude/Longitude for map display
- **School District**: Important for families
- **Utilities Status**: What utilities are available
- **HOA Fees**: Monthly HOA fees if applicable

## Image Types

The system supports different image types:
- **Photo**: Regular photographs
- **Survey**: Survey documents
- **Aerial**: Aerial/drone views
- **Plat**: Plat maps
- **Other**: Any other type

## Navigation

The Available Lots page has been added to:
- Main navigation header (between Available Homes and Plans)
- Mobile navigation menu
- Admin dashboard quick actions

## Best Practices

1. Always include GPS coordinates for map functionality
2. Use descriptive lot numbers and subdivision names
3. Upload high-quality images, especially aerial views
4. Keep status updated (available/reserved/sold)
5. Include all relevant features (corner lot, mature trees, etc.)
6. Provide detailed utilities information
7. Feature premium lots to highlight them 