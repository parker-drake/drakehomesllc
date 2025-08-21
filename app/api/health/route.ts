import { NextResponse } from 'next/server'

// Health check endpoint to prevent soft 404s on API routes
export async function GET() {
  return NextResponse.json(
    { 
      status: 'ok',
      service: 'Drake Homes LLC API',
      timestamp: new Date().toISOString()
    },
    { status: 200 }
  )
}
