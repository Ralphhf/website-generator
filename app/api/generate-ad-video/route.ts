import { NextRequest, NextResponse } from 'next/server'
import { getSupabase } from '@/lib/supabase'
import { fal } from '@fal-ai/client'

export const maxDuration = 300 // Allow up to 5 minutes for video generation

// Configure fal.ai with API key
const falKey = process.env.FAL_KEY
if (falKey) {
  fal.config({ credentials: falKey })
}

interface GenerateVideoRequest {
  prompt: string
  profileId: string
  platform: string
  duration: '5' | '10'
  aspectRatio?: '16:9' | '9:16' | '1:1'
  generateAudio?: boolean
  // For image-to-video mode
  startImageUrl?: string
  endImageUrl?: string
}

export async function POST(request: NextRequest) {
  try {
    const body: GenerateVideoRequest = await request.json()
    const {
      prompt,
      profileId,
      platform,
      duration = '5',
      aspectRatio = '9:16', // Default to vertical for social media
      generateAudio = true,
      startImageUrl,
      endImageUrl,
    } = body

    if (!prompt) {
      return NextResponse.json({ error: 'Prompt is required' }, { status: 400 })
    }

    if (!profileId) {
      return NextResponse.json({ error: 'Profile ID is required' }, { status: 400 })
    }

    if (!falKey) {
      return NextResponse.json({ error: 'FAL_KEY not configured. Add FAL_KEY to your .env.local file.' }, { status: 500 })
    }

    // Determine which Kling model to use
    // v2.6 Pro for image-to-video, v2.5 Turbo Pro for text-to-video (v2.6 text-to-video doesn't exist)
    const isImageToVideo = !!startImageUrl
    const modelId = isImageToVideo
      ? 'fal-ai/kling-video/v2.6/pro/image-to-video'
      : 'fal-ai/kling-video/v2.5-turbo/pro/text-to-video'

    // Build input based on mode
    const input: Record<string, unknown> = {
      prompt,
      duration,
      aspect_ratio: aspectRatio,
      negative_prompt: 'blur, distort, low quality, watermark, text overlay, logo',
    }

    if (isImageToVideo) {
      // v2.6 Pro image-to-video supports audio generation
      input.start_image_url = startImageUrl
      input.generate_audio = generateAudio
      if (endImageUrl) {
        input.end_image_url = endImageUrl
      }
    }
    // Note: v2.5 Turbo text-to-video doesn't have generate_audio parameter

    // Call Kling via fal.ai
    const result = await fal.subscribe(modelId, {
      input,
      logs: true,
    })

    const videoUrl = result.data.video?.url
    if (!videoUrl) {
      return NextResponse.json({ error: 'No video generated' }, { status: 500 })
    }

    // Download video from fal.ai URL to upload to Supabase
    const videoResponse = await fetch(videoUrl)
    if (!videoResponse.ok) {
      throw new Error('Failed to download generated video')
    }
    const videoBuffer = Buffer.from(await videoResponse.arrayBuffer())
    const fileName = `${profileId}/videos/${platform}-${Date.now()}.mp4`

    // Upload to Supabase Storage
    const supabase = getSupabase()

    // Check if bucket exists, create if not
    let bucketReady = false
    try {
      const { data: buckets } = await supabase.storage.listBuckets()
      bucketReady = buckets?.some(b => b.name === 'ad-videos') || false

      if (!bucketReady) {
        const { error: createError } = await supabase.storage.createBucket('ad-videos', {
          public: true,
          fileSizeLimit: 104857600, // 100MB for videos
        })
        if (!createError) {
          bucketReady = true
        } else {
          console.error('Failed to create bucket:', createError)
        }
      }
    } catch (bucketError) {
      console.error('Bucket check/create error:', bucketError)
    }

    // If bucket isn't ready, return the fal.ai URL directly
    if (!bucketReady) {
      return NextResponse.json({
        success: true,
        video: videoUrl,
        stored: false,
        warning: 'Video generated but storage bucket not available. Create "ad-videos" bucket in Supabase.',
        duration,
        model: isImageToVideo ? 'kling-v2.6-pro' : 'kling-v2.5-turbo-pro',
        mode: isImageToVideo ? 'image-to-video' : 'text-to-video',
      })
    }

    const { error: uploadError } = await supabase.storage
      .from('ad-videos')
      .upload(fileName, videoBuffer, {
        contentType: 'video/mp4',
        upsert: false,
      })

    if (uploadError) {
      console.error('Storage upload error:', uploadError)
      // Still return the video even if storage fails
      return NextResponse.json({
        success: true,
        video: videoUrl, // Return fal.ai URL directly
        stored: false,
        warning: 'Video generated but failed to save to storage',
        duration,
        model: isImageToVideo ? 'kling-v2.6-pro' : 'kling-v2.5-turbo-pro',
        mode: isImageToVideo ? 'image-to-video' : 'text-to-video',
      })
    }

    // Get public URL
    const { data: { publicUrl } } = supabase.storage
      .from('ad-videos')
      .getPublicUrl(fileName)

    // Save to database for media library
    const { error: dbError } = await supabase
      .from('ad_videos')
      .insert({
        profile_id: profileId,
        platform: platform,
        prompt: prompt,
        video_url: publicUrl,
        storage_path: fileName,
        duration: duration,
        aspect_ratio: aspectRatio,
        has_audio: isImageToVideo ? generateAudio : false, // Only v2.6 image-to-video has audio
        model: isImageToVideo ? 'kling-v2.6-pro' : 'kling-v2.5-turbo-pro',
        mode: isImageToVideo ? 'image-to-video' : 'text-to-video',
        source_image_url: startImageUrl || null,
      })

    if (dbError) {
      console.error('Database insert error:', dbError)
      // Table might not exist yet - that's okay
    }

    return NextResponse.json({
      success: true,
      video: publicUrl,
      stored: true,
      storagePath: fileName,
      duration,
      model: isImageToVideo ? 'kling-v2.6-pro' : 'kling-v2.5-turbo-pro',
      mode: isImageToVideo ? 'image-to-video' : 'text-to-video',
    })

  } catch (error) {
    console.error('Generate video error:', error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to generate video' },
      { status: 500 }
    )
  }
}

// GET - Retrieve generated videos for a profile
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
      .from('ad_videos')
      .select('*')
      .eq('profile_id', profileId)
      .order('created_at', { ascending: false })

    if (platform) {
      query = query.eq('platform', platform)
    }

    const { data, error } = await query

    if (error) {
      console.error('Fetch videos error:', error)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({ videos: data || [] })

  } catch (error) {
    console.error('Get videos error:', error)
    return NextResponse.json({ error: 'Failed to fetch videos' }, { status: 500 })
  }
}

// DELETE - Remove a video
export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const videoId = searchParams.get('videoId')
    const storagePath = searchParams.get('storagePath')

    if (!videoId) {
      return NextResponse.json({ error: 'Video ID is required' }, { status: 400 })
    }

    const supabase = getSupabase()

    // Delete from storage if path provided
    if (storagePath) {
      await supabase.storage.from('ad-videos').remove([storagePath])
    }

    // Delete from database
    const { error } = await supabase
      .from('ad_videos')
      .delete()
      .eq('id', videoId)

    if (error) {
      console.error('Delete video error:', error)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({ success: true, message: 'Video deleted' })

  } catch (error) {
    console.error('Delete video error:', error)
    return NextResponse.json({ error: 'Failed to delete video' }, { status: 500 })
  }
}
