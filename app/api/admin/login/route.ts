import { NextResponse } from 'next/server'

export async function POST(request: Request) {
  const { email } = await request.json()
  const adminEmail = process.env.ADMIN_EMAIL || 'admin@example.com'

  if (email === adminEmail) {
    const response = NextResponse.json({ success: true })
    response.cookies.set('admin_auth', email, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      maxAge: 24 * 60 * 60,
    })
    return response
  }

  return NextResponse.json({ success: false }, { status: 401 })
}