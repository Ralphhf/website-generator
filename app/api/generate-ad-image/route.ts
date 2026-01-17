import { NextRequest, NextResponse } from 'next/server'
import { getSupabase } from '@/lib/supabase'

export const maxDuration = 60 // Allow up to 60 seconds for image generation

interface GenerateImageRequest {
  prompt: string
  profileId: string
  platform: string
  size?: '1024x1024' | '1792x1024' | '1024x1792'
  quality?: 'standard' | 'hd'
  style?: 'vivid' | 'natural'
}

export async function POST(request: NextRequest) {
  try {
    const body: GenerateImageRequest = await request.json()
    const { prompt, profileId, platform, size = '1024x1024', quality = 'hd', style = 'natural' } = body

    if (!prompt) {
      return NextResponse.json({ error: 'Prompt is required' }, { status: 400 })
    }

    if (!profileId) {
      return NextResponse.json({ error: 'Profile ID is required' }, { status: 400 })
    }

    const openaiKey = process.env.OPENAI_API_KEY
    if (!openaiKey) {
      return NextResponse.json({ error: 'OpenAI API key not configured' }, { status: 500 })
    }

    // Call DALL-E 3 API
    const response = await fetch('https://api.openai.com/v1/images/generations', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${openaiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'dall-e-3',
        prompt: prompt,
        n: 1,
        size: size,
        quality: quality,
        style: style,
        response_format: 'b64_json',
      }),
    })

    if (!response.ok) {
      const errorData = await response.json()
      console.error('DALL-E API error:', errorData)
      return NextResponse.json(
        { error: errorData.error?.message || 'Failed to generate image' },
        { status: response.status }
      )
    }

    const data = await response.json()
    const imageBase64 = data.data[0].b64_json
    const revisedPrompt = data.data[0].revised_prompt

    // Convert base64 to buffer for Supabase storage
    const imageBuffer = Buffer.from(imageBase64, 'base64')
    const fileName = `${profileId}/${platform}-${Date.now()}.png`

    // Upload to Supabase Storage
    const supabase = getSupabase()

    // Check if bucket exists, create if not
    const { data: buckets } = await supabase.storage.listBuckets()
    const bucketExists = buckets?.some(b => b.name === 'ad-images')

    if (!bucketExists) {
      await supabase.storage.createBucket('ad-images', {
        public: true,
        fileSizeLimit: 10485760, // 10MB
      })
    }

    const { data: uploadData, error: uploadError } = await supabase.storage
      .from('ad-images')
      .upload(fileName, imageBuffer, {
        contentType: 'image/png',
        upsert: false,
      })

    if (uploadError) {
      console.error('Storage upload error:', uploadError)
      // Still return the image even if storage fails
      return NextResponse.json({
        success: true,
        image: `data:image/png;base64,${imageBase64}`,
        stored: false,
        revisedPrompt,
        warning: 'Image generated but failed to save to storage',
      })
    }

    // Get public URL
    const { data: { publicUrl } } = supabase.storage
      .from('ad-images')
      .getPublicUrl(fileName)

    // Save to database for media library
    const { error: dbError } = await supabase
      .from('ad_images')
      .insert({
        profile_id: profileId,
        platform: platform,
        prompt: prompt,
        revised_prompt: revisedPrompt,
        image_url: publicUrl,
        storage_path: fileName,
        size: size,
        quality: quality,
        style: style,
      })

    if (dbError) {
      console.error('Database insert error:', dbError)
      // Create the table if it doesn't exist - return image anyway
    }

    return NextResponse.json({
      success: true,
      image: publicUrl,
      stored: true,
      revisedPrompt,
      storagePath: fileName,
    })

  } catch (error) {
    console.error('Generate image error:', error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to generate image' },
      { status: 500 }
    )
  }
}

// GET - Retrieve generated images for a profile
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const profileId = searchParams.get('profileId')
    const platform = searchParams.get('platform')

    if (!profileId) {
      return NextResponse.json({ error: 'Profile ID is required' }, { status: 400 })
    }

    const supabase = getSupabase()
    let query = supabase
      .from('ad_images')
      .select('*')
      .eq('profile_id', profileId)
      .order('created_at', { ascending: false })

    if (platform) {
      query = query.eq('platform', platform)
    }

    const { data, error } = await query

    if (error) {
      console.error('Fetch images error:', error)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({ images: data || [] })

  } catch (error) {
    console.error('Get images error:', error)
    return NextResponse.json({ error: 'Failed to fetch images' }, { status: 500 })
  }
}

// DELETE - Remove an image
export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const imageId = searchParams.get('imageId')
    const storagePath = searchParams.get('storagePath')

    if (!imageId) {
      return NextResponse.json({ error: 'Image ID is required' }, { status: 400 })
    }

    const supabase = getSupabase()

    // Delete from storage if path provided
    if (storagePath) {
      await supabase.storage.from('ad-images').remove([storagePath])
    }

    // Delete from database
    const { error } = await supabase
      .from('ad_images')
      .delete()
      .eq('id', imageId)

    if (error) {
      console.error('Delete image error:', error)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({ success: true, message: 'Image deleted' })

  } catch (error) {
    console.error('Delete image error:', error)
    return NextResponse.json({ error: 'Failed to delete image' }, { status: 500 })
  }
}
