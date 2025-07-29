# Custom Galleries Migration Guide

This guide will help you migrate from the fixed category system to custom galleries.

## Overview

The new gallery system allows you to create unlimited custom galleries instead of being limited to predefined categories (exterior, interior, kitchen, etc.).

## Migration Steps

### 1. Run the Database Migration

Execute the SQL migration script in your Supabase SQL Editor:

```bash
# Copy the contents of DATABASE_CUSTOM_GALLERIES_MIGRATION.sql
# and run it in your Supabase SQL Editor
```

This migration will:
- Create a new `galleries` table
- Add a `gallery_id` column to `gallery_images`
- Migrate existing categories to galleries
- Create default galleries based on your existing categories
- Set up proper indexes and relationships

### 2. Deploy the Code Changes

The code has been updated to support custom galleries:

```bash
git pull
npm run build
# Deploy to your hosting platform
```

### 3. Verify the Migration

After deployment:
1. Visit the admin gallery page
2. You should see a "New Gallery" button
3. Existing images should be automatically assigned to galleries based on their previous categories
4. You can now create new galleries with custom names

## New Features

### Admin Panel
- **Create Custom Galleries**: Click "New Gallery" to create galleries with any name
- **Gallery Filter**: Filter images by gallery in the admin panel
- **Gallery Management**: Edit gallery names and descriptions
- **Drag & Drop Sorting**: (Future feature) Reorder galleries

### Public Gallery Page
- Dynamic gallery tabs based on your custom galleries
- Only shows galleries that have images
- Maintains all existing functionality (lightbox, featured images, etc.)

## Data Structure Changes

### Old Structure
```sql
gallery_images.category (ENUM: 'exterior', 'interior', 'kitchen', 'living', 'bedroom', 'bathroom')
```

### New Structure
```sql
galleries table:
- id (UUID)
- name (VARCHAR)
- slug (VARCHAR)
- description (TEXT)
- sort_order (INTEGER)
- is_active (BOOLEAN)

gallery_images.gallery_id (UUID) -> references galleries.id
```

## API Changes

### Creating Images
Old:
```json
{
  "category": "kitchen"
}
```

New:
```json
{
  "gallery_id": "uuid-of-gallery"
}
```

### Fetching Images
New optional query parameter:
```
GET /api/gallery?galleryId=uuid-of-gallery
```

## Rollback Plan

If you need to rollback:
1. The `category` column is preserved (just made nullable)
2. You can restore the CHECK constraint if needed
3. Gallery relationships can be removed while keeping data intact

## Notes

- The migration preserves all existing data
- The `category` column is kept for backward compatibility
- You can safely delete the `category` column after verifying everything works
- Consider creating redirects if you have gallery URLs indexed by search engines 