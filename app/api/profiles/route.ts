import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'

// GET - List all profiles
export async function GET() {
  try {
    const { data, error } = await supabase
      .from('business_profiles')
      .select('id, name, business_type, tagline, city, state, created_at, updated_at')
      .order('updated_at', { ascending: false })

    if (error) {
      console.error('Supabase error:', error)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({ profiles: data })
  } catch (error) {
    console.error('Error fetching profiles:', error)
    return NextResponse.json({ error: 'Failed to fetch profiles' }, { status: 500 })
  }
}

// POST - Save a new profile
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { businessInfo } = body

    if (!businessInfo || !businessInfo.name) {
      return NextResponse.json({ error: 'Business name is required' }, { status: 400 })
    }

    const profileData = {
      name: businessInfo.name,
      business_type: businessInfo.businessType || null,
      tagline: businessInfo.tagline || null,
      description: businessInfo.description || null,
      email: businessInfo.email || null,
      phone: businessInfo.phone || null,
      city: businessInfo.city || null,
      state: businessInfo.state || null,
      data: businessInfo, // Store full object as JSON
      updated_at: new Date().toISOString(),
    }

    const { data, error } = await supabase
      .from('business_profiles')
      .insert([profileData])
      .select()
      .single()

    if (error) {
      console.error('Supabase error:', error)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({ profile: data, message: 'Profile saved successfully' })
  } catch (error) {
    console.error('Error saving profile:', error)
    return NextResponse.json({ error: 'Failed to save profile' }, { status: 500 })
  }
}
