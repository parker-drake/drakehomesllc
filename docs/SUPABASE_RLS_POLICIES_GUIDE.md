# Supabase Storage RLS Policies - Detailed Setup Guide

This guide provides step-by-step instructions for configuring Row Level Security (RLS) policies for file uploads in your Drake Homes LLC application.

## Why RLS Policies Are Needed

Supabase Storage uses Row Level Security to control who can:
- **View/Download** files (SELECT)
- **Upload** files (INSERT) 
- **Delete** files (DELETE)
- **Update** file metadata (UPDATE)

Without proper policies, your file uploads will fail with 403 Forbidden errors.

## Step-by-Step Setup

### Step 1: Access Your Supabase Dashboard

1. Go to [https://supabase.com](https://supabase.com)
2. Sign in to your account
3. Select your Drake Homes LLC project
4. You should see your project dashboard

### Step 2: Navigate to Storage

1. In the left sidebar, click **"Storage"**
2. You should see your `plan-files` bucket (create it if you haven't already)
3. Look for the **"Policies"** tab near the top of the Storage section
   - If you don't see a "Policies" tab, look for **"Configuration"** → **"Policies"**
   - Some newer Supabase interfaces have it under **"Settings"** → **"Policies"**

### Step 3: Access Storage Policies

1. Click on the **"Policies"** tab in the Storage section
2. You should see a section for creating **Storage Policies**
3. If you see a message about RLS not being enabled, there should be a button to enable it
4. Click **"New Policy"** or **"Create a new policy"**

**Note:** The exact interface may vary slightly depending on your Supabase version, but look for "Storage Policies" or "Object Policies".

### Modern Supabase Interface (2024)

If you're using a newer version of Supabase, the interface might look different:

1. **Go to Storage** → **plan-files bucket**
2. Look for **"Policies"** tab or **"Configuration"** → **"Policies"**  
3. You'll see a section titled **"Storage policies"** or **"Object policies"**
4. Click **"Create policy"** or **"Add policy"**
5. You'll get a form with these fields:
   - **Policy name**: Enter a descriptive name
   - **Allowed operation**: Choose SELECT, INSERT, or DELETE
   - **Target roles**: Choose PUBLIC or AUTHENTICATED
   - **Using expression**: Enter the condition (like `bucket_id = 'plan-files'`)

### Step 4: Create the Policies

Now you'll create three policies. For each policy:

#### Policy 1: Public Read Access (Most Important)

1. Click **"New Policy"** or **"Create Policy"**
2. You might see templates - if so, look for **"Custom"** or **"Create custom policy"**
3. Fill in the policy form:

**Policy Details:**
- **Policy Name**: `Public read access for plan files`
- **Table**: `objects` (should be pre-selected)
- **Operation**: `SELECT` (for reading/viewing files)
- **Target Roles**: `public` (or leave empty for all roles)

**Policy Condition/Expression:**
```sql
bucket_id = 'plan-files'
```

**Modern Interface Fields:**
- **Policy name**: `Public read access for plan files`
- **Allowed operation**: `SELECT` (or "Read" in some versions)
- **Target roles**: `PUBLIC` (or "All users" in some versions)  
- **Using expression**: `bucket_id = 'plan-files'`

4. Click **"Save"** or **"Create Policy"**

#### Policy 2: Authenticated Upload Access

1. Click **"New Policy"** again
2. Choose **"Custom Policy"**
3. Fill in the form:

**Policy Details:**
- **Policy Name**: `Authenticated users can upload plan files`
- **Table**: `objects`
- **Operation**: `INSERT` (for uploading files)
- **Target Roles**: `authenticated`

**Policy Condition/Expression:**
```sql
bucket_id = 'plan-files'
```

**Modern Interface Fields:**
- **Policy name**: `Authenticated users can upload plan files`
- **Allowed operation**: `INSERT` (or "Create" in some versions)
- **Target roles**: `AUTHENTICATED` (or "Authenticated users only")
- **Using expression**: `bucket_id = 'plan-files'`

**Note:** For INSERT policies, you might see separate fields for "Using expression" and "With check expression" - use the same condition for both.

4. Click **"Save"** or **"Create Policy"**

#### Policy 3: Authenticated Delete Access (Optional but Recommended)

1. Click **"New Policy"** again
2. Choose **"Custom Policy"**
3. Fill in the form:

**Policy Details:**
- **Policy Name**: `Authenticated users can delete plan files`
- **Table**: `objects`
- **Operation**: `DELETE` (for removing files)
- **Target Roles**: `authenticated`

**Policy Condition/Expression:**
```sql
bucket_id = 'plan-files'
```

**Modern Interface Fields:**
- **Policy name**: `Authenticated users can delete plan files`
- **Allowed operation**: `DELETE` (or "Delete" in some versions)
- **Target roles**: `AUTHENTICATED` (or "Authenticated users only")
- **Using expression**: `bucket_id = 'plan-files'`

4. Click **"Save"** or **"Create Policy"**

## ⚠️ Important: Use Storage UI, Not SQL Editor

**You cannot create storage policies using the SQL Editor** - you'll get an "must be owner of table objects" error. Storage policies must be created through the Storage UI in your Supabase dashboard.

### Why SQL Editor Doesn't Work

The `storage.objects` table is managed by Supabase's storage engine, and regular database users don't have owner permissions on it. This is by design for security reasons.

### Correct Approach: Use Storage Policies UI

Follow the step-by-step instructions above using the Storage UI. This is the **only** way to create storage policies in Supabase.

## Verification Steps

### Test 1: Check Policy Creation

1. Go back to **Storage > Policies**
2. You should see your three (or four) policies listed
3. Each should show:
   - ✅ **Enabled** status
   - Correct **Operation** (SELECT, INSERT, DELETE)
   - Correct **Policy** definition

### Test 2: Test File Upload

1. Go to your admin panel: `/admin/plans`
2. Try to add a new plan or edit an existing one
3. Upload a test image or document
4. If the upload succeeds, your policies are working correctly

### Test 3: Test File Access

1. After uploading a file, try to view it by clicking "View"
2. The file should open in a new tab/window
3. If you can see the file, your read policy is working

## Common Issues and Solutions

### Issue 1: Upload fails with 403 Forbidden

**Symptoms:**
- File upload shows error in console
- Upload button shows "Upload failed"

**Solutions:**
1. Check that the INSERT policy exists and is enabled
2. Verify the bucket name is exactly `plan-files` (case-sensitive)
3. Make sure you're logged in to the admin panel
4. Check that RLS is enabled on `storage.objects`

### Issue 2: Files upload but can't be viewed

**Symptoms:**
- Upload succeeds but files show broken image/link
- "View" button shows 403 error

**Solutions:**
1. Check that the SELECT policy exists and is enabled
2. Verify the bucket is set to **Public** in Storage settings
3. Make sure the policy uses `bucket_id = 'plan-files'` exactly

### Issue 3: Can't delete files from admin panel

**Symptoms:**
- Remove button doesn't work
- Files remain after clicking remove

**Solutions:**
1. Add the DELETE policy if missing
2. Check that you're authenticated in the admin panel
3. Verify the DELETE policy uses correct bucket name

### Issue 4: All policies exist but still getting errors

**Try these steps:**
1. **Refresh your browser** and clear cache
2. **Log out and log back in** to the admin panel
3. **Check bucket settings**:
   - Go to Storage > plan-files
   - Ensure bucket is set to **Public**
   - Check that the bucket name is exactly `plan-files`
4. **Recreate the policies**:
   - Delete existing policies
   - Re-run the SQL script above

## Policy Explanation

### What Each Policy Does:

1. **SELECT Policy (Public Read)**:
   - Allows anyone to view/download files
   - Necessary for displaying images on your website
   - Applies to all visitors, not just logged-in users

2. **INSERT Policy (Authenticated Upload)**:
   - Only logged-in admin users can upload files
   - Prevents unauthorized file uploads
   - Required for the admin panel file upload to work

3. **DELETE Policy (Authenticated Delete)**:
   - Only logged-in admin users can delete files
   - Allows the "Remove" button in admin panel to work
   - Prevents unauthorized file deletion

### Security Notes:

- These policies are **secure** for a business website
- Only admins can upload/delete files
- The public can view files (which is needed for your website)
- No sensitive data should be uploaded since files are publicly viewable

## Testing Your Setup

After implementing the policies, test the complete workflow:

1. ✅ **Admin Login**: Log into `/admin/login`
2. ✅ **Navigate**: Go to `/admin/plans`  
3. ✅ **Upload**: Try uploading an image and document
4. ✅ **View**: Click "View" on uploaded files
5. ✅ **Public Access**: Visit a plan page to see if images display
6. ✅ **Remove**: Try removing a file from admin panel

If all steps work, your RLS policies are correctly configured! 🎉 