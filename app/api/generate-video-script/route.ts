import { NextRequest, NextResponse } from 'next/server'
import Anthropic from '@anthropic-ai/sdk'

interface GenerateVideoScriptRequest {
  businessName: string
  businessType: string
  services: string[]
  city: string
  state: string
  tagline?: string
  platform: 'facebook' | 'instagram' | 'youtube' | 'tiktok'
  duration: '15s' | '30s' | '60s'
  videoFormat?: string
}

export async function POST(request: NextRequest) {
  try {
    const body: GenerateVideoScriptRequest = await request.json()
    const {
      businessName,
      businessType,
      services,
      city,
      state,
      tagline,
      platform,
      duration,
      videoFormat,
    } = body

    if (!businessName || !platform) {
      return NextResponse.json({ error: 'Business name and platform are required' }, { status: 400 })
    }

    const anthropicKey = process.env.CLAUDE_API_KEY
    if (!anthropicKey) {
      return NextResponse.json({ error: 'Claude API key not configured' }, { status: 500 })
    }

    const anthropic = new Anthropic({ apiKey: anthropicKey })

    // Duration to seconds mapping
    const durationSeconds: Record<string, number> = {
      '15s': 15,
      '30s': 30,
      '60s': 60,
    }
    const totalSeconds = durationSeconds[duration] || 15

    // Platform-specific guidance
    const platformGuidance: Record<string, string> = {
      tiktok: `TikTok demands raw authenticity. The hook must work in 0.5 seconds. Use trending sounds references, direct-to-camera energy, and pattern interrupts every 3-5 seconds. Text overlays are essential. Never feel "produced" or corporate.`,
      instagram: `Instagram Reels need aesthetic appeal with substance. Balance beautiful visuals with genuine moments. Use smooth transitions, lifestyle b-roll, and aspirational but relatable scenarios. Text should be clean and readable.`,
      facebook: `Facebook video needs to build trust quickly. Lead with credibility, use social proof, and speak directly to the viewer's problem. Can be slightly longer-form and more informative. Captions are critical (85% watch muted).`,
      youtube: `YouTube Shorts need strong thumbnails-in-motion. Open with curiosity or value promise. Can be more educational/tutorial focused. Pace can be slightly slower than TikTok but still punchy.`,
    }

    const systemPrompt = `You are a senior video creative director at a top-tier social media marketing agency with 30+ years of experience, updated for 2026 trends. You specialize in creating viral short-form video ads for local businesses.

Your expertise includes:
- Platform-native video content that feels organic, not "ad-like"
- Hook psychology that stops the scroll in under 1 second
- Scene pacing that maintains attention throughout
- B-roll selection that supports the narrative
- Voiceover scripts that convert
- 2026 short-form video trends and what performs NOW

You understand that short-form video is about:
- Pattern interrupts to maintain attention
- Emotional storytelling in compressed time
- Visual variety (never stay on one shot too long)
- Text overlays that reinforce the message
- Strong CTAs that feel natural, not salesy`

    const userPrompt = `Create a complete ${duration} video ad script for this business:

====================================
BUSINESS INFORMATION
====================================
Business Name: ${businessName}
Business Type: ${businessType || 'Local Business'}
Services Offered: ${services.length > 0 ? services.join(', ') : 'General services'}
Location: ${city}, ${state}
${tagline ? `Brand Tagline: ${tagline}` : ''}

====================================
PLATFORM: ${platform.toUpperCase()}
====================================
${platformGuidance[platform]}
${videoFormat ? `Video Format: ${videoFormat}` : ''}

====================================
VIDEO DURATION: ${totalSeconds} SECONDS
====================================

Generate a complete video script that is SPECIFICALLY about "${businessType}" offering "${services.length > 0 ? services.join(', ') : 'their services'}".

The script must include SPECIFIC details about what THIS business actually does - not generic "service provider" content.

FORMAT YOUR RESPONSE AS JSON:
{
  "hook": "The opening line/visual that stops the scroll (must work in 0.5-1 second)",
  "hookType": "The psychology behind this hook (curiosity, pain point, transformation, social proof, etc.)",
  "scenes": [
    {
      "time": "0:00-0:03",
      "action": "What happens in this scene",
      "visual": "Specific visual description for filming/generation",
      "textOverlay": "Text that appears on screen (keep short, impactful)",
      "broll": ["specific b-roll shot 1", "specific b-roll shot 2"],
      "patternInterrupt": "How this scene maintains attention (or null if letting previous moment land)"
    }
  ],
  "voiceover": "The complete voiceover script with natural pacing markers (...) for pauses",
  "cta": "The call-to-action (natural, not salesy)",
  "hooks": {
    "curiosity": ["hook option 1", "hook option 2"],
    "painPoint": ["hook option 1", "hook option 2"],
    "transformation": ["hook option 1", "hook option 2"],
    "socialProof": ["hook option 1", "hook option 2"],
    "controversy": ["hook option 1", "hook option 2"],
    "secret": ["hook option 1", "hook option 2"],
    "urgency": ["hook option 1", "hook option 2"],
    "question": ["hook option 1", "hook option 2"],
    "story": ["hook option 1", "hook option 2"],
    "statistic": ["hook option 1", "hook option 2"]
  },
  "voiceoverGuidance": {
    "tone": "How to deliver the voiceover",
    "pacing": "Speed and rhythm guidance",
    "emphasis": ["words or phrases to emphasize"],
    "energy": "Energy level description"
  },
  "musicSuggestion": "Type of background music/sound that would work",
  "thumbnailConcept": "What the video thumbnail/cover should show"
}

CRITICAL REQUIREMENTS:
1. Every scene MUST reference the actual services: ${services.length > 0 ? services.join(', ') : businessType}
2. B-roll suggestions must be SPECIFIC to this industry (tools, processes, results)
3. Hooks must address REAL pain points for people seeking these services
4. The voiceover must sound like a real person, not a script
5. Text overlays should be ${platform === 'tiktok' ? '3-5 words max, punchy' : '5-7 words max, clean'}
6. Include ${Math.ceil(totalSeconds / 5)} scenes minimum for visual variety
7. Each scene should be 3-5 seconds max for ${platform}
8. Pattern interrupts every 3-5 seconds to maintain attention`

    const response = await anthropic.messages.create({
      model: 'claude-sonnet-4-20250514',
      max_tokens: 4096,
      messages: [{ role: 'user', content: userPrompt }],
      system: systemPrompt,
    })

    const content = response.content[0]
    if (content.type !== 'text') {
      return NextResponse.json({ error: 'Unexpected response format' }, { status: 500 })
    }

    // Parse the JSON response
    let videoScript
    try {
      const jsonMatch = content.text.match(/\{[\s\S]*\}/)
      if (jsonMatch) {
        videoScript = JSON.parse(jsonMatch[0])
      } else {
        throw new Error('No JSON found in response')
      }
    } catch {
      console.error('Failed to parse Claude response:', content.text)
      return NextResponse.json({ error: 'Failed to parse video script response' }, { status: 500 })
    }

    return NextResponse.json({
      success: true,
      platform,
      duration,
      ...videoScript,
    })

  } catch (error) {
    console.error('Generate video script error:', error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to generate video script' },
      { status: 500 }
    )
  }
}
