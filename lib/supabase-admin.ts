import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!

// Admin client with service role for server-side operations
export const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
})

// Type definitions for our database
export interface Property {
  id: string
  title: string
  price: string
  location: string
  beds: number
  baths: number
  sqft: string
  image?: string
  status: string
  description: string
  features: string[]
  completion_date: string
  latitude?: number
  longitude?: number
  created_at: string
  updated_at: string
  // Property Information fields (optional)
  lot_size?: string
  year_built?: number
  property_type?: string
  garage_spaces?: number
  heating_cooling?: string
  flooring_type?: string
  school_district?: string
  hoa_fee?: string
  utilities_included?: string
  exterior_materials?: string
}

export interface User {
  id: string
  email: string
  name?: string
  role: string
  created_at: string
  updated_at: string
} 