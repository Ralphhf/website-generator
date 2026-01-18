import { NextRequest, NextResponse } from 'next/server'
import { getSupabase } from '@/lib/supabase'
import { fal } from '@fal-ai/client'

export const maxDuration = 60 // Allow up to 60 seconds for image generation

// Configure fal.ai with API key
const falKey = process.env.FAL_KEY
if (falKey) {
  fal.config({ credentials: falKey })
}

interface GenerateImageRequest {
  prompt: string
  profileId: string
  platform: string
  size?: '1024x1024' | '1792x1024' | '1024x1792'
  quality?: 'standard' | 'hd'
  style?: 'vivid' | 'natural'
}

// Map DALL-E sizes to Ideogram image_size
type IdeogramSize = 'square_hd' | 'square' | 'portrait_4_3' | 'portrait_16_9' | 'landscape_4_3' | 'landscape_16_9'

function mapSizeToIdeogram(size: string): IdeogramSize {
  switch (size) {
    case '1792x1024':
      return 'landscape_16_9'
    case '1024x1792':
      return 'portrait_16_9'
    case '1024x1024':
    default:
      return 'square_hd'
  }
}

// Map quality to Ideogram rendering_speed
function mapQualityToSpeed(quality: string): 'TURBO' | 'BALANCED' | 'QUALITY' {
  switch (quality) {
    case 'standard':
      return 'TURBO'
    case 'hd':
    default:
      return 'BALANCED'
  }
}

export async function POST(request: NextRequest) {
  try {
    const body: GenerateImageRequest = await request.json()
    const { prompt, profileId, platform, size = '1024x1024', quality = 'hd' } = body

    if (!prompt) {
      return NextResponse.json({ error: 'Prompt is required' }, { status: 400 })
    }

    if (!profileId) {
      return NextResponse.json({ error: 'Profile ID is required' }, { status: 400 })
    }

    if (!falKey) {
      return NextResponse.json({ error: 'FAL_KEY not configured. Add FAL_KEY to your .env.local file.' }, { status: 500 })
    }

    // Call Ideogram V3 via fal.ai
    const result = await fal.subscribe('fal-ai/ideogram/v3', {
      input: {
        prompt: prompt,
        image_size: mapSizeToIdeogram(size) as 'square_hd' | 'square' | 'portrait_4_3' | 'portrait_16_9' | 'landscape_4_3' | 'landscape_16_9',
        rendering_speed: mapQualityToSpeed(quality),
        style: 'REALISTIC', // Best for ad photography
        num_images: 1,
        expand_prompt: false, // We already have optimized prompts from Claude
      },
    })

    const imageUrl = result.data.images[0]?.url
    if (!imageUrl) {
      return NextResponse.json({ error: 'No image generated' }, { status: 500 })
    }

    // Download image from fal.ai URL to upload to Supabase
    const imageResponse = await fetch(imageUrl)
    if (!imageResponse.ok) {
      throw new Error('Failed to download generated image')
    }
    const imageBuffer = Buffer.from(await imageResponse.arrayBuffer())
    const fileName = `${profileId}/${platform}-${Date.now()}.png`

    // Upload to Supabase Storage
    const supabase = getSupabase()

    // Upload directly - bucket should already exist (create 'ad-images' bucket manually in Supabase)
    const { error: uploadError } = await supabase.storage
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
        image: imageUrl, // Return fal.ai URL directly
        stored: false,
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
        revised_prompt: null, // Ideogram doesn't revise prompts
        image_url: publicUrl,
        storage_path: fileName,
        size: size,
        quality: quality,
        style: 'ideogram-v3', // Track which model was used
      })

    if (dbError) {
      console.error('Database insert error:', dbError)
      // Create the table if it doesn't exist - return image anyway
    }

    return NextResponse.json({
      success: true,
      image: publicUrl,
      stored: true,
      storagePath: fileName,
      model: 'ideogram-v3',
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
