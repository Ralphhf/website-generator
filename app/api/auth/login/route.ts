import { NextRequest, NextResponse } from 'next/server'
import { cookies } from 'next/headers'

// Fixed credentials - in production, use proper authentication
const VALID_EMAIL = 'ralph_farah_2001@hotmail.com'
const VALID_PASSWORD = '12345678Rf'

// Simple session token - in production, use proper JWT or session management
const SESSION_TOKEN = 'website-generator-session-v1'

export async function POST(request: NextRequest) {
  try {
    const { email, password } = await request.json()

    if (!email || !password) {
      return NextResponse.json(
        { success: false, error: 'Email and password are required' },
        { status: 400 }
      )
    }

    // Check credentials
    if (email === VALID_EMAIL && password === VALID_PASSWORD) {
      // Set session cookie
      const cookieStore = await cookies()
      cookieStore.set('auth-session', SESSION_TOKEN, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        maxAge: 60 * 60 * 24 * 30, // 30 days
        path: '/',
      })

      return NextResponse.json({ success: true })
    }

    return NextResponse.json(
      { success: false, error: 'Invalid email or password' },
      { status: 401 }
    )
  } catch (error) {
    console.error('Login error:', error)
    return NextResponse.json(
      { success: false, error: 'Login failed' },
      { status: 500 }
    )
  }
}

// GET - Check if user is authenticated
export async function GET() {
  const cookieStore = await cookies()
  const session = cookieStore.get('auth-session')

  if (session?.value === SESSION_TOKEN) {
    return NextResponse.json({ authenticated: true })
  }

  return NextResponse.json({ authenticated: false }, { status: 401 })
}
