import { NextRequest, NextResponse } from 'next/server'
import Anthropic from '@anthropic-ai/sdk'
import { PLATFORM_PSYCHOLOGY, findIndustryProfile } from '@/lib/marketing-library'

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

    // Get platform psychology
    const platformPsych = PLATFORM_PSYCHOLOGY[platform]
    const copyStyle = platformPsych.copyStyle

    // Get industry profile for additional context
    const industryProfile = findIndustryProfile(businessType, businessName, services)
    const platformStrategy = industryProfile.platformStrategy[platform === 'google' ? 'facebook' : platform]

    // Platform-specific constraints
    const platformConstraints: Record<string, { maxLength: number; hashtagCount: number }> = {
      facebook: { maxLength: 150, hashtagCount: 3 },
      instagram: { maxLength: 150, hashtagCount: 10 },
      youtube: { maxLength: 120, hashtagCount: 5 },
      tiktok: { maxLength: 80, hashtagCount: 4 },
      google: { maxLength: 90, hashtagCount: 0 },
    }

    const constraints = platformConstraints[platform]

    // Ad type objectives
    const objectives: Record<string, string> = {
      awareness: 'Make people aware of the business. Focus on brand story, what makes them unique, and creating memorable impression.',
      consideration: 'Get people to seriously consider this business. Highlight benefits, social proof, expertise, and why they should choose this over competitors.',
      conversion: 'Drive immediate action NOW - phone calls, website visits, bookings. Create urgency, remove friction, make the next step crystal clear.',
    }

    // Build the platform-specific prompt
    const prompt = `You are a senior copywriter at a top marketing agency that specializes in ${platform.toUpperCase()} advertising.

====================================
CRITICAL: PLATFORM-SPECIFIC REQUIREMENTS
====================================

PLATFORM: ${platform.toUpperCase()}
TARGET AUDIENCE AGE: ${platformPsych.audienceAge}
WHO THEY ARE: ${platformPsych.audienceDescription}

HOW THEY USE ${platform.toUpperCase()}:
${platformPsych.userBehavior}

ATTENTION SPAN: ${platformPsych.attentionSpan}

WHAT THEY EXPECT FROM CONTENT:
${platformPsych.contentExpectation}

====================================
COPY STYLE REQUIREMENTS FOR ${platform.toUpperCase()}
====================================

TONE: ${copyStyle.tone}
LENGTH: ${copyStyle.length}
FORMAT: ${copyStyle.format}
CTA STYLE: ${copyStyle.cta}
EMOJI USAGE: ${includeEmoji ? copyStyle.emoji : 'Do NOT use any emojis'}

WHAT WORKS ON ${platform.toUpperCase()}: ${platformPsych.whatWorks}
WHAT FAILS ON ${platform.toUpperCase()}: ${platformPsych.whatFails}

====================================
BUSINESS DETAILS
====================================

Business Name: ${businessName}
Business Type: ${businessType || 'Local Business'}
Industry: ${industryProfile.name}
Services: ${services.join(', ') || 'Various services'}
Location: ${city}, ${state}
Tagline: ${tagline || 'N/A'}

INDUSTRY INSIGHTS:
- Target audience: ${industryProfile.audience.primary}
- Their pain points: ${industryProfile.audience.painPoints.join(', ')}
- What they want: ${industryProfile.audience.desires.join(', ')}
- Platform focus for this industry: ${platformStrategy.focus}
- Recommended tone: ${platformStrategy.tone}

====================================
AD OBJECTIVE: ${adType.toUpperCase()}
====================================

${objectives[adType]}

====================================
YOUR TASK
====================================

Generate EXACTLY 3 ad copy variations that are SPECIFICALLY crafted for ${platform.toUpperCase()}.

${platform === 'tiktok' ? `
TIKTOK-SPECIFIC RULES:
- Must sound like a real person, NOT a brand
- Use casual language, contractions, even slight imperfection
- If it sounds like "corporate wrote this", it will FAIL
- Think: How would a 25-year-old business owner talk to their friend?
- Hooks must work in under 1 second of reading
` : ''}

${platform === 'instagram' ? `
INSTAGRAM-SPECIFIC RULES:
- Lead with something visually/emotionally compelling
- Use line breaks for easy reading
- Make it lifestyle-aspirational
- Think: Would someone screenshot this? Would they tag a friend?
` : ''}

${platform === 'facebook' ? `
FACEBOOK-SPECIFIC RULES:
- Write like you're talking to a neighbor, not a customer
- Can be longer and more informative
- Trust and credibility matter most
- Include specific details that build confidence
` : ''}

${platform === 'youtube' ? `
YOUTUBE-SPECIFIC RULES:
- They came here to learn or be entertained
- Lead with value proposition immediately
- Expert positioning is important
- Clear and structured delivery
` : ''}

${platform === 'google' ? `
GOOGLE-SPECIFIC RULES:
- They are actively searching for this service
- Be direct and benefit-focused
- Strong keywords naturally integrated
- Clear, action-oriented CTAs
` : ''}

Each variation must include:
1. HOOK: The opening line that stops the scroll (must work in ${platform === 'tiktok' ? '0.5 seconds' : platform === 'instagram' ? '1 second' : '2-3 seconds'})
2. BODY: Main message (max ${constraints.maxLength} characters, formatted for ${platform})
3. CTA: Call-to-action appropriate for ${platform} (${copyStyle.cta})
4. HEADLINE: Ad headline (max 40 chars)
5. HASHTAGS: ${constraints.hashtagCount} platform-appropriate hashtags ${constraints.hashtagCount === 0 ? '(empty array for Google)' : ''}

FORMAT YOUR RESPONSE AS VALID JSON:
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
  "targetAudience": "Specific description of who sees this ad on ${platform}",
  "bestTimeToPost": "Best times to post on ${platform} for this audience",
  "proTip": "One insider tip for maximizing this ad's performance on ${platform}"
}

IMPORTANT:
- Each variation should use a DIFFERENT copywriting approach (problem/solution, social proof, direct benefit, curiosity, etc.)
- Write like a ${platform} native, not like a generic marketer
- Local references to ${city} where it feels natural
- Sound human and authentic to the platform`

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
      platformAudience: `${platformPsych.audienceAge} - ${platformPsych.audienceDescription}`,
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
