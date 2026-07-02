import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
  const path = request.nextUrl.pathname

  if (path.startsWith('/admin') && !path.startsWith('/admin/login')) {
    const adminEmail = process.env.ADMIN_EMAIL || 'admin@example.com'
    const isAuthenticated = request.cookies.get('admin_auth')?.value === adminEmail

    if (!isAuthenticated) {
      return NextResponse.redirect(new URL('/admin/login', request.url))
    }
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/admin/:path*'],
}