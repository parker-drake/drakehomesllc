# Bulk Image Upload Fix - October 21, 2025

## Problem
When uploading approximately 40 images to a property, some uploads were failing due to rate limiting and configuration issues.

## Root Causes Identified

1. **Strict Rate Limiting**: The upload API had a rate limit of only 10 uploads per minute, causing failures after the 10th image.

2. **Incorrect Storage Path**: The upload route was hardcoded to use `plan-images/` bucket path, not properly supporting property images.

3. **No Retry Logic**: The bulk upload component had no automatic retry mechanism for rate-limited requests.

4. **Batch Size**: Uploading in batches of 5 images without delays between batches exacerbated rate limiting issues.

## Solutions Implemented

### 1. Upload API (`/app/api/upload/route.ts`)
- **Increased Rate Limit**: Changed from 10 to 100 uploads per minute to support bulk operations
- **Added Context Support**: Added `uploadContext` parameter ('plan' or 'property') to determine storage path
- **Dynamic Bucket Paths**: 
  - Property images: `property-images/{filename}`
  - Plan images: `plan-images/{filename}` (existing)
  - Property documents: `property-documents/{filename}`
  - Plan documents: `plan-documents/{filename}` (existing)
- **Improved Error Messages**: Better error messaging for rate limiting

### 2. Bulk Upload Component (`/components/ui/bulk-image-upload.tsx`)
- **Added `uploadContext` Prop**: Allows specifying whether uploading for properties or plans
- **Automatic Retry Logic**: Implements exponential backoff (1s, 2s, 4s) for rate-limited requests (429 errors)
- **Reduced Batch Size**: Changed from 5 to 3 images per batch for more reliable uploads
- **Inter-Batch Delays**: Added 500ms delay between batches to prevent rate limiting
- **Better Error Handling**: Shows retry status and improves user feedback
- **Enhanced Logging**: Console logs for better debugging of batch uploads

### 3. Admin Properties Page (`/app/admin/properties/page.tsx`)
- **Added Context Parameter**: Set `uploadContext="property"` on BulkImageUpload component

## Technical Details

### Rate Limiting Strategy
```typescript
// Before: 10 uploads per minute
if (attempts.count >= 10) { return true }

// After: 100 uploads per minute
if (attempts.count >= 100) { return true }
```

### Retry Logic
```typescript
// Automatic retry with exponential backoff for 429 errors
if (xhr.status === 429 && retryCount < 3) {
  const delay = Math.pow(2, retryCount) * 1000 // 1s, 2s, 4s
  setTimeout(() => uploadSingleImage(image, retryCount + 1), delay)
}
```

### Batch Upload Optimization
```typescript
// Upload in batches of 3 with 500ms delays
const batchSize = 3
for (let i = 0; i < batches.length; i++) {
  await Promise.all(batch.map(image => uploadSingleImage(image)))
  if (i < batches.length - 1) {
    await new Promise(resolve => setTimeout(resolve, 500))
  }
}
```

## Storage Configuration

All files are stored in the `plan-files` bucket with organized folder structure:
- `property-images/` - Property photos
- `plan-images/` - Plan photos  
- `property-documents/` - Property documents
- `plan-documents/` - Plan documents (floor plans, etc.)

## Testing Recommendations

1. **Small Batch Test**: Upload 5-10 images to verify basic functionality
2. **Large Batch Test**: Upload 40-50 images to verify rate limiting and retry logic
3. **Network Test**: Test on slower connections to verify progress tracking
4. **Error Recovery**: Test the "Retry Failed" button for any failed uploads

## Performance Improvements

- **Before**: 10 images max per minute → 11th+ images would fail
- **After**: 100 images per minute with automatic retry → reliable bulk uploads
- **User Experience**: Clear progress indicators, automatic retries, and helpful error messages

## Files Modified

1. `/app/api/upload/route.ts` - Upload API with increased rate limits and context support
2. `/components/ui/bulk-image-upload.tsx` - Enhanced component with retry logic
3. `/app/admin/properties/page.tsx` - Added uploadContext prop

## Deployment

All changes are backward compatible and production-ready. No database migrations required.

Build Status: ✅ Passed
Linting: ✅ No errors

