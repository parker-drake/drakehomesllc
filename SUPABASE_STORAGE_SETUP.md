# Supabase Storage Setup for Image Uploads

## Step 1: Create Storage Bucket

1. Go to your **Supabase Dashboard**
2. Navigate to **Storage** in the left sidebar
3. Click **"Create Bucket"**
4. Name the bucket: `property-images`
5. Make it **Public** (check the public checkbox)
6. Click **"Create Bucket"**

## Step 2: Set Storage Policies

Go to **Storage > Policies** and create these policies for the `property-images` bucket:

### Policy 1: Allow Public Read Access
```sql
CREATE POLICY "Public read access for property images" ON storage.objects
FOR SELECT USING (bucket_id = 'property-images');
```

### Policy 2: Allow Authenticated Upload
```sql
CREATE POLICY "Allow authenticated uploads" ON storage.objects
FOR INSERT WITH CHECK (bucket_id = 'property-images');
```

### Policy 3: Allow Authenticated Update
```sql
CREATE POLICY "Allow authenticated updates" ON storage.objects
FOR UPDATE USING (bucket_id = 'property-images');
```

### Policy 4: Allow Authenticated Delete
```sql
CREATE POLICY "Allow authenticated deletes" ON storage.objects
FOR DELETE USING (bucket_id = 'property-images');
```

## Step 3: Alternative Setup (If you prefer all-public access)

If you want simpler setup for development, you can create one policy that allows everything:

```sql
CREATE POLICY "Allow all operations on property images" ON storage.objects
FOR ALL USING (bucket_id = 'property-images');
```

## Step 4: Verify Environment Variables

Make sure your `.env` file has:
```
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
```

## Step 5: Test the Upload

After setting up the bucket and policies:
1. Restart your Next.js development server
2. Go to `/admin` 
3. Try uploading an image again

## Troubleshooting

If you still get errors, check:
1. Bucket name is exactly `property-images`
2. Bucket is set to **Public**
3. Policies are applied correctly
4. Environment variables are correct
5. No browser console errors (press F12 > Console)

The image upload should now work correctly! 