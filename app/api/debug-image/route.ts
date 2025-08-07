import { NextResponse } from 'next/server'

export async function GET() {
  return NextResponse.json({
    message: "If you can see this, the API is working",
    testImage: "https://fxaowczkvopxnwbkthtv.supabase.co/storage/v1/object/public/property-images/775b6e32-92ea-494e-bef6-cf56a58c430b.jpg",
    hostname: process.env.VERCEL_URL || 'unknown',
    nodeEnv: process.env.NODE_ENV
  })
}
