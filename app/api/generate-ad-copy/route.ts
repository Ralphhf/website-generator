import { NextRequest, NextResponse } from 'next/server'
import Anthropic from '@anthropic-ai/sdk'

interface GenerateCopyRequest {
  businessName: string
  businessType: string
  services: string[]
  city: string
  state: string
  tagline?: string
  platform: 'facebook' | 'instagram' | 'youtube' | 'tiktok' | 'google'
  adType: 'awareness' | 'consideration' | 'conversion'
  tone?: 'professional' | 'friendly' | 'urgent' | 'inspiring'
  includeEmoji?: boolean
}

export async function POST(request: NextRequest) {
  try {
    const body: GenerateCopyRequest = await request.json()
    const {
      businessName,
      businessType,
      services,
      city,
      state,
      tagline,
      platform,
      adType,
      tone = 'professional',
      includeEmoji = true,
    } = body

    if (!businessName || !platform) {
      return NextResponse.json({ error: 'Business name and platform are required' }, { status: 400 })
    }

    const anthropicKey = process.env.CLAUDE_API_KEY
    if (!anthropicKey) {
      return NextResponse.json({ error: 'Claude API key not configured' }, { status: 500 })
    }

    const anthropic = new Anthropic({ apiKey: anthropicKey })

    // Platform-specific constraints
    const platformSpecs: Record<string, { maxLength: number; style: string; hashtagCount: number }> = {
      facebook: {
        maxLength: 125,
        style: 'Conversational, community-focused, longer-form OK. Can be educational or emotional. Works well with questions and storytelling.',
        hashtagCount: 3,
      },
      instagram: {
        maxLength: 150,
        style: 'Visual-first, lifestyle-focused, aspirational. Use line breaks for readability. Emoji-friendly. Caption should complement image.',
        hashtagCount: 10,
      },
      youtube: {
        maxLength: 100,
        style: 'Value-driven, educational, direct. Mention what viewers will learn or gain. Include call to subscribe/like.',
        hashtagCount: 5,
      },
      tiktok: {
        maxLength: 80,
        style: 'Ultra-casual, trendy, authentic. Use current slang appropriately. Short punchy sentences. Native feel is critical.',
        hashtagCount: 4,
      },
      google: {
        maxLength: 90,
        style: 'Direct, benefit-focused, keyword-rich. Clear value proposition. Strong action words.',
        hashtagCount: 0,
      },
    }

    const spec = platformSpecs[platform]

    // Ad type objectives
    const objectives: Record<string, string> = {
      awareness: 'Make people aware of the business and what makes it unique. Focus on brand story and differentiation.',
      consideration: 'Get people to consider this business as a solution. Highlight benefits, social proof, and expertise.',
      conversion: 'Drive immediate action - calls, visits, purchases. Create urgency and clear next steps.',
    }

    const prompt = `You are an expert social media marketer at a top agency. Generate high-converting ad copy for ${platform.toUpperCase()}.

BUSINESS DETAILS:
- Name: ${businessName}
- Type: ${businessType || 'Local Business'}
- Services: ${services.join(', ') || 'Various services'}
- Location: ${city}, ${state}
- Tagline: ${tagline || 'N/A'}

AD OBJECTIVE: ${adType.toUpperCase()}
${objectives[adType]}

PLATFORM STYLE:
${spec.style}

TONE: ${tone}
${includeEmoji ? 'Include relevant emojis to increase engagement.' : 'Do NOT use emojis.'}

Generate EXACTLY 3 complete ad variations. Each must include:
1. HOOK: First line that stops the scroll (${platform === 'tiktok' ? '1 second read' : '3 second read'})
2. BODY: Main message (max ${spec.maxLength} characters for primary text)
3. CTA: Clear call-to-action
4. HEADLINE: Short punchy headline for the ad (max 40 chars)
5. HASHTAGS: ${spec.hashtagCount} relevant hashtags ${spec.hashtagCount === 0 ? '(skip for Google)' : ''}

FORMAT YOUR RESPONSE AS JSON:
{
  "variations": [
    {
      "hook": "...",
      "body": "...",
      "cta": "...",
      "headline": "...",
      "hashtags": ["...", "..."]
    }
  ],
  "targetAudience": "Brief description of who this ad targets",
  "bestTimeToPost": "Recommended posting times for ${platform}",
  "proTip": "One specific tip to maximize this ad's performance"
}

Important:
- Make each variation distinctly different in approach
- Use proven copywriting frameworks (PAS, AIDA, etc.)
- Be specific to ${businessType || 'this type of business'}
- Localize to ${city} where natural
- Sound human, not robotic or generic`

    const response = await anthropic.messages.create({
      model: 'claude-sonnet-4-20250514',
      max_tokens: 2048,
      messages: [{ role: 'user', content: prompt }],
    })

    const content = response.content[0]
    if (content.type !== 'text') {
      return NextResponse.json({ error: 'Unexpected response format' }, { status: 500 })
    }

    // Parse the JSON response
    let adCopy
    try {
      // Extract JSON from response (Claude sometimes adds explanation text)
      const jsonMatch = content.text.match(/\{[\s\S]*\}/)
      if (jsonMatch) {
        adCopy = JSON.parse(jsonMatch[0])
      } else {
        throw new Error('No JSON found in response')
      }
    } catch {
      console.error('Failed to parse Claude response:', content.text)
      return NextResponse.json({ error: 'Failed to parse ad copy response' }, { status: 500 })
    }

    return NextResponse.json({
      success: true,
      platform,
      adType,
      ...adCopy,
    })

  } catch (error) {
    console.error('Generate ad copy error:', error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to generate ad copy' },
      { status: 500 }
    )
  }
}
