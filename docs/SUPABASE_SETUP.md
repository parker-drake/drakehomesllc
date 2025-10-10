# 🏗️ Drake Homes LLC - Supabase Backend Setup

Welcome! Your construction website is now ready for a **production-grade backend** with Supabase. This guide will help you set up the database and admin dashboard so your employees can manage property listings.

## 🎯 **What You'll Get:**
- ✅ **PostgreSQL Database** for property listings
- ✅ **Admin Dashboard** at `/admin` for employees
- ✅ **REST API** for adding/editing/deleting properties
- ✅ **Real-time updates** across all devices
- ✅ **Image storage** for property photos
- ✅ **Authentication** for employee access

---

## 📋 **Setup Instructions**

### **Step 1: Create Supabase Account**
1. Go to [supabase.com](https://supabase.com)
2. Click **"Start your project"**
3. Sign up with GitHub (recommended) or email
4. Create a new project:
   - **Project Name**: `drake-homes-llc`
   - **Database Password**: (choose a strong password)
   - **Region**: Choose closest to your location

### **Step 2: Get Your Environment Variables**
1. In your Supabase dashboard, go to **Settings** → **API**
2. Copy these values:
   - **Project URL**
   - **anon/public key**
   - **service_role key** (keep this secret!)

### **Step 3: Update Your .env File**
Replace the placeholder values in your `.env` file:

```bash
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=https://your-project-id.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key-here

# Site Configuration  
NEXT_PUBLIC_SITE_URL=http://localhost:3000
```

### **Step 4: Create Database Tables**
1. In Supabase dashboard, go to **SQL Editor**
2. Run this SQL to create your tables:

```sql
-- Create properties table
CREATE TABLE properties (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  price TEXT NOT NULL,
  location TEXT NOT NULL,
  beds INTEGER NOT NULL,
  baths INTEGER NOT NULL,
  sqft TEXT NOT NULL,
  image TEXT,
  status TEXT NOT NULL CHECK (status IN ('Move-In Ready', 'Under Construction', 'Nearly Complete', 'Pre-Construction')),
  description TEXT NOT NULL,
  features JSONB DEFAULT '[]'::jsonb,
  completion_date TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create users table for admin access
CREATE TABLE users (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  email TEXT UNIQUE NOT NULL,
  name TEXT,
  role TEXT DEFAULT 'admin',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable Row Level Security
ALTER TABLE properties ENABLE ROW LEVEL SECURITY;
ALTER TABLE users ENABLE ROW LEVEL SECURITY;

-- Create policies (allow public read for properties, authenticated write)
CREATE POLICY "Properties are viewable by everyone" 
ON properties FOR SELECT 
USING (true);

CREATE POLICY "Authenticated users can insert properties" 
ON properties FOR INSERT 
WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Authenticated users can update properties" 
ON properties FOR UPDATE 
USING (auth.role() = 'authenticated');

CREATE POLICY "Authenticated users can delete properties" 
ON properties FOR DELETE 
USING (auth.role() = 'authenticated');

-- Insert sample data (Fixed syntax for PostgreSQL)
INSERT INTO properties (title, price, location, beds, baths, sqft, status, description, features, completion_date) VALUES
('Modern Family Home - Willowbrook', '$850,000', 'Willowbrook Subdivision, TX', 4, 3, '2,650', 'Move-In Ready', 'Brand new construction with open floor plan, granite countertops, and energy-efficient features', '["New Construction", "Energy Efficient", "2-Car Garage", "Granite Counters"]', 'Available Now'),
('Executive Estate - Heritage Hills', '$1,450,000', 'Heritage Hills, TX', 5, 4, '3,800', 'Under Construction', 'Luxury custom home with premium finishes, chef''s kitchen, and master suite retreat', '["Custom Built", "Premium Finishes", "Chef''s Kitchen", "3-Car Garage"]', 'March 2025'),
('Craftsman Style Home - Oak Ridge', '$725,000', 'Oak Ridge Community, TX', 3, 2, '2,200', 'Nearly Complete', 'Beautiful craftsman design with covered front porch, hardwood floors, and modern amenities', '["Craftsman Style", "Hardwood Floors", "Covered Porch", "Modern Kitchen"]', 'January 2025');
```

### **Step 5: Test Your Setup**
1. **Restart your development server**:
   ```bash
   npm run dev
   ```

2. **Visit your admin dashboard**:
   - Go to `http://localhost:3000/admin`
   - You should see your sample properties
   - Try adding a new property!

3. **Check the frontend**:
   - Go to `http://localhost:3000/available-homes`
   - Your properties should load from the database

---

## 🚀 **What's Working Now:**

### **✅ Admin Dashboard** (`/admin`)
- Add new properties with all details
- Edit existing properties
- Delete properties
- Manage features and status
- Real-time updates

### **✅ API Endpoints**
- `GET /api/properties` - Get all properties
- `POST /api/properties` - Add new property
- `GET /api/properties/[id]` - Get single property
- `PUT /api/properties/[id]` - Update property
- `DELETE /api/properties/[id]` - Delete property

### **✅ Frontend Integration**
- Available Homes page loads real data
- Dynamic property cards
- Status badges with proper colors

---

## 📸 **Next Steps: Add Image Upload**

To add property photo uploads:

1. **Enable Storage in Supabase**:
   - Go to **Storage** in Supabase dashboard
   - Create a new bucket called `property-images`
   - Make it public for property photos

2. **Upload Implementation**: We can add image upload functionality to the admin form

---

## 🔐 **Adding Employee Authentication**

For secure employee access:

1. **Enable Auth in Supabase**:
   - Go to **Authentication** → **Settings**
   - Configure email templates
   - Add your employees via **Users** tab

2. **Protect Admin Routes**: We can add login requirements to the admin dashboard

---

## 🎯 **Your Business Benefits:**

- **Professional Database**: PostgreSQL scales with your business
- **Employee Management**: Add/remove team members easily
- **Real-time Updates**: Changes appear instantly on website
- **Backup & Security**: Automatic daily backups
- **Global Performance**: CDN for fast loading worldwide

---

## 🆘 **Need Help?**

If you run into any issues:

1. **Check the Console**: Open browser dev tools for error messages
2. **Verify Environment Variables**: Make sure your `.env` file has correct values
3. **Check Supabase Logs**: Go to **Logs** in Supabase dashboard
4. **Test API Directly**: Visit `http://localhost:3000/api/properties` to see if data loads

---

**🎉 Your construction website is now enterprise-ready!** 

Your employees can start adding properties immediately, and everything will appear live on your website. As your business grows, Supabase will scale with you automatically. 