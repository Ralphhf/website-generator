import { NextRequest, NextResponse } from 'next/server'
import { getSupabase } from '@/lib/supabase'

export const maxDuration = 60 // Allow up to 60 seconds for voiceover generation

// ElevenLabs voice IDs for different styles
const VOICE_OPTIONS = {
  professional_male: {
    id: 'TxGEqnHWrfWFTfGW9XjX', // Josh - professional, clear
    name: 'Josh (Professional Male)',
  },
  professional_female: {
    id: '21m00Tcm4TlvDq8ikWAM', // Rachel - professional, warm
    name: 'Rachel (Professional Female)',
  },
  energetic_male: {
    id: 'VR6AewLTigWG4xSOukaG', // Arnold - energetic, bold
    name: 'Arnold (Energetic Male)',
  },
  friendly_female: {
    id: 'EXAVITQu4vr4xnSDxMaL', // Bella - friendly, conversational
    name: 'Bella (Friendly Female)',
  },
  conversational_male: {
    id: 'pNInz6obpgDQGcFmaJgB', // Adam - conversational, natural
    name: 'Adam (Conversational Male)',
  },
} as const

type VoiceStyle = keyof typeof VOICE_OPTIONS

interface GenerateVoiceoverRequest {
  text: string
  profileId: string
  platform: string
  voiceStyle?: VoiceStyle
  targetDuration?: number // Target duration in seconds (from video)
}

export async function POST(request: NextRequest) {
  try {
    const body: GenerateVoiceoverRequest = await request.json()
    const {
      text,
      profileId,
      platform,
      voiceStyle = 'professional_male',
      targetDuration,
    } = body

    if (!text) {
      return NextResponse.json({ error: 'Text is required' }, { status: 400 })
    }

    if (!profileId) {
      return NextResponse.json({ error: 'Profile ID is required' }, { status: 400 })
    }

    const elevenLabsKey = process.env.ELEVENLABS_API_KEY
    if (!elevenLabsKey) {
      return NextResponse.json({ error: 'ELEVENLABS_API_KEY not configured' }, { status: 500 })
    }

    // Get voice configuration
    const voice = VOICE_OPTIONS[voiceStyle] || VOICE_OPTIONS.professional_male

    // Platform-specific voice settings
    const platformSettings: Record<string, { stability: number; baseSpeed: number }> = {
      tiktok: { stability: 0.5, baseSpeed: 1.1 }, // Slightly faster, more dynamic
      instagram: { stability: 0.6, baseSpeed: 1.0 }, // Balanced
      facebook: { stability: 0.7, baseSpeed: 0.95 }, // Slightly slower, more stable
      youtube: { stability: 0.65, baseSpeed: 1.0 }, // Clear and steady
    }
    const settings = platformSettings[platform] || platformSettings.facebook

    // Calculate speed to match target duration
    // Average speaking rate is ~15 characters per second at 1.0x speed
    const estimatedNaturalDuration = text.length / 15
    let calculatedSpeed = settings.baseSpeed

    if (targetDuration && targetDuration > 0) {
      // Calculate required speed to fit in target duration
      // If natural is 14s and target is 10s, speed = 14/10 = 1.4x
      calculatedSpeed = estimatedNaturalDuration / targetDuration
      // Clamp speed between 0.7 and 1.5 for quality (ElevenLabs supports 0.5-2.0)
      calculatedSpeed = Math.max(0.7, Math.min(1.5, calculatedSpeed))
    }

    // Call ElevenLabs API
    const response = await fetch(
      `https://api.elevenlabs.io/v1/text-to-speech/${voice.id}`,
      {
        method: 'POST',
        headers: {
          'Accept': 'audio/mpeg',
          'Content-Type': 'application/json',
          'xi-api-key': elevenLabsKey,
        },
        body: JSON.stringify({
          text,
          model_id: 'eleven_turbo_v2_5', // Fast, good quality
          voice_settings: {
            stability: settings.stability,
            similarity_boost: 0.75,
            style: 0.5,
            speed: calculatedSpeed,
            use_speaker_boost: true,
          },
        }),
      }
    )

    if (!response.ok) {
      const errorText = await response.text()
      console.error('ElevenLabs API error:', errorText)
      return NextResponse.json(
        { error: `ElevenLabs API error: ${response.status}` },
        { status: response.status }
      )
    }

    // Get audio buffer
    const audioBuffer = Buffer.from(await response.arrayBuffer())
    const fileName = `${profileId}/voiceovers/${platform}-${Date.now()}.mp3`

    // Upload to Supabase Storage
    const supabase = getSupabase()

    // Check if bucket exists, create if not
    let bucketReady = false
    try {
      const { data: buckets } = await supabase.storage.listBuckets()
      bucketReady = buckets?.some(b => b.name === 'ad-voiceovers') || false

      if (!bucketReady) {
        const { error: createError } = await supabase.storage.createBucket('ad-voiceovers', {
          public: true,
          fileSizeLimit: 10485760, // 10MB for audio
        })
        if (!createError) {
          bucketReady = true
        } else {
          console.error('Failed to create voiceover bucket:', createError)
        }
      }
    } catch (bucketError) {
      console.error('Bucket check/create error:', bucketError)
    }

    // If bucket isn't ready, return audio as base64
    if (!bucketReady) {
      const base64Audio = audioBuffer.toString('base64')
      return NextResponse.json({
        success: true,
        audio: `data:audio/mpeg;base64,${base64Audio}`,
        stored: false,
        warning: 'Audio generated but storage bucket not available. Create "ad-voiceovers" bucket in Supabase.',
        voiceUsed: voice.name,
        characterCount: text.length,
      })
    }

    const { error: uploadError } = await supabase.storage
      .from('ad-voiceovers')
      .upload(fileName, audioBuffer, {
        contentType: 'audio/mpeg',
        upsert: false,
      })

    if (uploadError) {
      console.error('Storage upload error:', uploadError)
      // Return audio as base64 if upload fails
      const base64Audio = audioBuffer.toString('base64')
      return NextResponse.json({
        success: true,
        audio: `data:audio/mpeg;base64,${base64Audio}`,
        stored: false,
        warning: 'Audio generated but failed to save to storage',
        voiceUsed: voice.name,
        characterCount: text.length,
      })
    }

    // Get public URL
    const { data: { publicUrl } } = supabase.storage
      .from('ad-voiceovers')
      .getPublicUrl(fileName)

    // Save to database for media library
    const { error: dbError } = await supabase
      .from('ad_voiceovers')
      .insert({
        profile_id: profileId,
        platform: platform,
        text: text,
        audio_url: publicUrl,
        storage_path: fileName,
        voice_style: voiceStyle,
        voice_name: voice.name,
        character_count: text.length,
        model: 'eleven_turbo_v2_5',
      })

    if (dbError) {
      console.error('Database insert error:', dbError)
      // Table might not exist yet - that's okay
    }

    return NextResponse.json({
      success: true,
      audio: publicUrl,
      stored: true,
      storagePath: fileName,
      voiceUsed: voice.name,
      characterCount: text.length,
    })

  } catch (error) {
    console.error('Generate voiceover error:', error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to generate voiceover' },
      { status: 500 }
    )
  }
}

// GET - Retrieve generated voiceovers for a profile
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
      .from('ad_voiceovers')
      .select('*')
      .eq('profile_id', profileId)
      .order('created_at', { ascending: false })

    if (platform) {
      query = query.eq('platform', platform)
    }

    const { data, error } = await query

    if (error) {
      console.error('Fetch voiceovers error:', error)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({ voiceovers: data || [] })

  } catch (error) {
    console.error('Get voiceovers error:', error)
    return NextResponse.json({ error: 'Failed to fetch voiceovers' }, { status: 500 })
  }
}

// Export voice options for frontend
export async function OPTIONS() {
  return NextResponse.json({ voices: VOICE_OPTIONS })
}
