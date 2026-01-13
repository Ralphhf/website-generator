import { NextRequest, NextResponse } from 'next/server'
import { getSupabase } from '@/lib/supabase'

export const dynamic = 'force-dynamic'

// GET - Get a single profile by ID
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params

    const supabase = getSupabase()
    const { data, error } = await supabase
      .from('business_profiles')
      .select('*')
      .eq('id', id)
      .single()

    if (error) {
      console.error('Supabase error:', error)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    if (!data) {
      return NextResponse.json({ error: 'Profile not found' }, { status: 404 })
    }

    return NextResponse.json({ profile: data })
  } catch (error) {
    console.error('Error fetching profile:', error)
    return NextResponse.json({ error: 'Failed to fetch profile' }, { status: 500 })
  }
}

// PUT - Update a profile
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const body = await request.json()
    const { businessInfo } = body

    if (!businessInfo) {
      return NextResponse.json({ error: 'Business info is required' }, { status: 400 })
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
      data: businessInfo,
      updated_at: new Date().toISOString(),
    }

    const supabase = getSupabase()
    const { data, error } = await supabase
      .from('business_profiles')
      .update(profileData)
      .eq('id', id)
      .select()
      .single()

    if (error) {
      console.error('Supabase error:', error)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({ profile: data, message: 'Profile updated successfully' })
  } catch (error) {
    console.error('Error updating profile:', error)
    return NextResponse.json({ error: 'Failed to update profile' }, { status: 500 })
  }
}

// PATCH - Partial update (for completed_sections, etc.)
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const body = await request.json()

    const updateData: Record<string, unknown> = {
      updated_at: new Date().toISOString(),
    }

    // Only update fields that are provided
    if (body.completed_sections !== undefined) {
      updateData.completed_sections = body.completed_sections
    }

    const supabase = getSupabase()
    const { data, error } = await supabase
      .from('business_profiles')
      .update(updateData)
      .eq('id', id)
      .select()
      .single()

    if (error) {
      console.error('Supabase error:', error)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({ profile: data, message: 'Profile updated successfully' })
  } catch (error) {
    console.error('Error updating profile:', error)
    return NextResponse.json({ error: 'Failed to update profile' }, { status: 500 })
  }
}

// DELETE - Delete a profile
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params

    const supabase = getSupabase()
    const { error } = await supabase
      .from('business_profiles')
      .delete()
      .eq('id', id)

    if (error) {
      console.error('Supabase error:', error)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({ message: 'Profile deleted successfully' })
  } catch (error) {
    console.error('Error deleting profile:', error)
    return NextResponse.json({ error: 'Failed to delete profile' }, { status: 500 })
  }
}
