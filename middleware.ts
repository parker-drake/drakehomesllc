import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

export async function middleware(request: NextRequest) {
  let response = NextResponse.next({
    request: {
      headers: request.headers,
    },
  })

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return request.cookies.get(name)?.value
        },
        set(name: string, value: string, options: any) {
          request.cookies.set({
            name,
            value,
            ...options,
          })
          response = NextResponse.next({
            request: {
              headers: request.headers,
            },
          })
          response.cookies.set({
            name,
            value,
            ...options,
          })
        },
        remove(name: string, options: any) {
          request.cookies.set({
            name,
            value: '',
            ...options,
          })
          response = NextResponse.next({
            request: {
              headers: request.headers,
            },
          })
          response.cookies.set({
            name,
            value: '',
            ...options,
          })
        },
      },
    }
  )

  // Check if user is authenticated for admin routes
  if (request.nextUrl.pathname.startsWith('/admin')) {
    // Allow access to login page
    if (request.nextUrl.pathname === '/admin/login') {
      return response
    }

    const { data: { user } } = await supabase.auth.getUser()

    // Redirect to login if not authenticated
    if (!user) {
      return NextResponse.redirect(new URL('/admin/login', request.url))
    }
  }

  // Protect API routes that modify data (require authentication)
  const protectedApiRoutes = [
    '/api/properties',
    '/api/plans',
    '/api/gallery',
    '/api/upload'
  ]

  const isProtectedApiRoute = protectedApiRoutes.some(route => 
    request.nextUrl.pathname.startsWith(route)
  )

  const isWriteOperation = ['POST', 'PUT', 'DELETE'].includes(request.method)

  if (isProtectedApiRoute && isWriteOperation) {
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      )
    }
  }

  return response
}

export const config = {
  matcher: [
    '/admin/:path*',
    '/api/properties/:path*',
    '/api/plans/:path*', 
    '/api/gallery/:path*',
    '/api/upload/:path*'
  ]
} 