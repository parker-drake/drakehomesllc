# Performance Optimization Guide

## Overview
This guide outlines the performance optimizations implemented for Drake Homes LLC website.

## 1. PDF Brochures Feature ✅

### Property Brochures
- Professional PDF generation for each property listing
- Includes all property details, images, and contact information
- Download button added to property pages (icon in header + prominent button in contact section)
- API endpoint: `/api/properties/[id]/brochure`

### Floor Plan Brochures
- PDF generation for floor plans with pricing and features
- Includes floor plan images and customization notes
- API endpoint: `/api/plans/[id]/brochure`

### Usage
Simply click the download button on any property or plan page to generate and download a PDF brochure.

## 2. Performance Optimizations ✅

### Server-Side Rendering (SSR) with Static Generation
- Property pages now use static generation with ISR (Incremental Static Regeneration)
- Pages are pre-rendered at build time and updated every 60 seconds
- Significantly faster initial page loads

### Image Optimization
- Custom lazy loading component with placeholder support
- Optimized image sizes for different devices
- WebP and AVIF format support for modern browsers
- Proper image sizing hints to prevent layout shift

### Next.js Configuration
- Webpack chunking for better code splitting
- Vendor and common chunks for optimal caching
- HTTP caching headers for static assets
- Security headers for better protection

### Database Optimization
To implement the database optimizations, run the SQL commands in `DATABASE_PERFORMANCE_OPTIMIZATION.sql` in your Supabase SQL editor:

1. Go to your Supabase dashboard
2. Navigate to SQL Editor
3. Copy and paste the contents of `DATABASE_PERFORMANCE_OPTIMIZATION.sql`
4. Run the script

This will create:
- Indexes on frequently queried columns
- Full-text search capabilities for properties
- Automatic search vector updates
- Performance monitoring suggestions

## 3. Additional Performance Features

### Lazy Image Component
Use the new `LazyImage` component for better image loading:

```tsx
import { LazyImage } from '@/components/ui/lazy-image'

<LazyImage
  src="/path/to/image.jpg"
  alt="Description"
  width={400}
  height={300}
  aspectRatio={4/3}
/>
```

### Benefits
- Automatic placeholder while loading
- Error handling with fallback image
- Smooth fade-in animation
- Prevents layout shift with aspect ratio

## 4. Monitoring Performance

### Vercel Analytics
Since you already have Vercel Analytics installed, you can monitor:
- Page load times
- Core Web Vitals
- User interactions
- Real-time performance metrics

### Database Performance
After implementing the indexes, you should see:
- Faster property searches
- Quicker page loads
- Reduced database query times

## 5. Future Enhancements

Consider implementing:
- Redis caching for frequently accessed data
- CDN for static assets
- Service Worker for offline support
- Image CDN with automatic optimization (like Cloudinary)
- Database connection pooling

## Deployment
All changes are automatically deployed via Vercel when pushed to the main branch. 