# Supabase File Upload Setup

This guide explains how to set up Supabase Storage for file uploads in the Drake Homes LLC application.

## Storage Bucket Creation

1. **Go to Supabase Dashboard**
   - Navigate to your project dashboard
   - Click on "Storage" in the left sidebar

2. **Create New Bucket**
   - Click "New bucket"
   - Name: `plan-files`
   - Make it **Public** (so uploaded files can be accessed publicly)
   - Click "Create bucket"

## Folder Structure

The application will automatically create the following folder structure:

```
plan-files/
├── plan-images/        # House plan photos and renderings
└── plan-documents/     # Floor plans, elevations, PDFs
```

## Storage Policies (RLS)

Add the following Row Level Security (RLS) policies to allow file operations:

### 1. Allow Public Read Access
```sql
CREATE POLICY "Public read access" ON storage.objects 
FOR SELECT USING (bucket_id = 'plan-files');
```

### 2. Allow Authenticated Upload
```sql
CREATE POLICY "Authenticated users can upload files" ON storage.objects 
FOR INSERT WITH CHECK (
  bucket_id = 'plan-files' 
  AND auth.role() = 'authenticated'
);
```

### 3. Allow Authenticated Delete (Optional)
```sql
CREATE POLICY "Authenticated users can delete files" ON storage.objects 
FOR DELETE USING (
  bucket_id = 'plan-files' 
  AND auth.role() = 'authenticated'
);
```

## File Upload Limits

The application enforces the following limits:

- **Images**: 5MB maximum
  - Supported formats: JPEG, PNG, WebP
  - Use: Plan photos, renderings, marketing images

- **Documents**: 10MB maximum  
  - Supported formats: PDF, JPEG, PNG, DWG
  - Use: Floor plans, elevations, specifications

## Automatic File Organization

When files are uploaded, they are automatically:

1. **Renamed** with timestamp and random string for uniqueness
2. **Categorized** by type (images vs documents)
3. **Organized** into appropriate folders
4. **Typed** based on filename content:
   - `floor_plan` - files with "floor" or "plan" in name
   - `elevation` - files with "elevation" in name
   - `site_plan` - files with "site" in name
   - `specification` - files with "spec" in name
   - `photo` - default for other images
   - `interior` - files with "interior" in name

## Usage in Admin Panel

Once configured, administrators can:

1. **Upload Main Images**: Drag & drop or click to select plan cover images
2. **Upload Documents**: Add floor plans, elevations, and other plan documents
3. **Upload Additional Images**: Add multiple photos for each plan
4. **View/Download**: Preview and download any uploaded file
5. **Remove Files**: Delete uploaded files from the interface

## File URL Format

Uploaded files are accessible at:
```
https://[your-project].supabase.co/storage/v1/object/public/plan-files/[folder]/[filename]
```

## Troubleshooting

### Common Issues:

1. **Upload fails with 403 error**
   - Check if RLS policies are correctly configured
   - Ensure bucket is set to public
   - Verify authentication is working

2. **Files not displaying**
   - Check if public read policy is applied
   - Verify bucket name matches exactly (`plan-files`)
   - Check file URLs in browser console

3. **Large file uploads timing out**
   - Consider reducing file size limits in the upload component
   - Compress images before uploading
   - Check Supabase project limits

## File Management Best Practices

1. **Naming Convention**: Files are auto-renamed, but original names are preserved in the database
2. **File Cleanup**: Consider adding a cleanup job for orphaned files
3. **Backup Strategy**: Important files should be backed up outside of Supabase
4. **CDN**: For high-traffic sites, consider adding a CDN in front of Supabase Storage

## Security Considerations

- Files are publicly accessible once uploaded
- Do not upload sensitive or confidential documents
- Consider adding virus scanning for production use
- Implement rate limiting for file uploads if needed 