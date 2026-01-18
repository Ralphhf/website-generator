import { NextRequest, NextResponse } from 'next/server'
import Anthropic from '@anthropic-ai/sdk'
import { PLATFORM_SPECS, UGC_STYLES, SCROLL_STOP_TECHNIQUES, IMAGE_FORMAT_PRESETS } from '@/lib/marketing-library'

interface GenerateVisualPromptRequest {
  businessName: string
  businessType: string
  services: string[]
  city: string
  state: string
  tagline?: string
  platform: 'facebook' | 'instagram' | 'youtube' | 'tiktok' | 'google'
  promptType: 'hero' | 'service' | 'broll' | 'testimonial'
  ugcStyle?: string
  scrollStopTechnique?: string
  imageFormat?: string
}

export async function POST(request: NextRequest) {
  try {
    const body: GenerateVisualPromptRequest = await request.json()
    const {
      businessName,
      businessType,
      services,
      city,
      state,
      tagline,
      platform,
      promptType,
      ugcStyle,
      scrollStopTechnique,
      imageFormat,
    } = body

    if (!businessName || !platform) {
      return NextResponse.json({ error: 'Business name and platform are required' }, { status: 400 })
    }

    const anthropicKey = process.env.CLAUDE_API_KEY
    if (!anthropicKey) {
      return NextResponse.json({ error: 'Claude API key not configured' }, { status: 500 })
    }

    const anthropic = new Anthropic({ apiKey: anthropicKey })

    // Get platform specs
    const platformSpec = PLATFORM_SPECS[platform]
    const formatPreset = IMAGE_FORMAT_PRESETS[platform]

    // Get UGC style details if selected
    const ugcDetails = ugcStyle ? UGC_STYLES[ugcStyle as keyof typeof UGC_STYLES] : null

    // Get scroll-stop technique details if selected
    const scrollStopDetails = scrollStopTechnique ? SCROLL_STOP_TECHNIQUES[scrollStopTechnique as keyof typeof SCROLL_STOP_TECHNIQUES] : null

    // Image format info
    const selectedFormat = imageFormat
      ? formatPreset.formats.find(f => f.name === imageFormat)
      : formatPreset.formats.find(f => f.name === formatPreset.recommended)

    // Build the expert prompt
    const systemPrompt = `You are a senior creative director at a top-tier social media marketing agency with 30+ years of experience, updated for 2026 trends. You specialize in creating scroll-stopping visual concepts for paid social advertising.

Your expertise includes:
- Platform-native content that feels organic, not "ad-like"
- Visual psychology that triggers immediate pattern interrupts
- UGC aesthetics that build trust and authenticity
- Industry-specific imagery that resonates with target audiences
- 2026 social media visual trends and what performs NOW

You understand that different platforms have different visual languages:
- TikTok: Raw, authentic, slightly imperfect, phone-shot aesthetic
- Instagram: Aspirational but relatable, aesthetic-forward, lifestyle-driven
- Facebook: Trust-building, community-focused, slightly more polished than TikTok
- YouTube: Thumbnail-optimized, high contrast, expressive faces
- Google: Clean, professional, benefit-focused imagery

Your job is to create DALL-E image prompts that generate visuals which STOP THE SCROLL and feel native to each platform.`

    const promptTypeDescriptions: Record<string, string> = {
      hero: 'The main brand hero shot - showcases the business owner, team, or signature service in an aspirational yet authentic way. This is the "face" of the brand.',
      service: 'Active service delivery shot - shows the work being done with skill and care. Captures the expertise and quality in action.',
      broll: 'Supporting visual content - details, textures, tools, results, atmosphere. Creates visual variety and storytelling depth.',
      testimonial: 'Customer-focused imagery - happy customer, transformation result, before/after, social proof moment. Builds trust and desire.',
    }

    const userPrompt = `Create a DALL-E image prompt for this business:

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
Audience: ${platformSpec.audience}
Best performing content: Native, authentic visuals that match how real users post
${selectedFormat ? `Image Format: ${selectedFormat.name} (${selectedFormat.ratio})` : ''}

====================================
SHOT TYPE: ${promptType.toUpperCase()}
====================================
${promptTypeDescriptions[promptType]}

${ugcDetails ? `
====================================
UGC STYLE: ${ugcDetails.name}
====================================
Description: ${ugcDetails.description}
Visual characteristics: ${ugcDetails.visualCues.join(', ')}
Camera: ${ugcDetails.camera}
Lighting: ${ugcDetails.lighting}
` : ''}

${scrollStopDetails ? `
====================================
SCROLL-STOP TECHNIQUE: ${scrollStopDetails.name}
====================================
Psychology: ${scrollStopDetails.psychology}
Visual elements: ${scrollStopDetails.visualElements.join(', ')}
` : ''}

====================================
YOUR TASK
====================================
Generate a detailed DALL-E prompt that:

1. Is SPECIFICALLY tailored to "${businessType}" offering "${services.length > 0 ? services.join(', ') : 'their services'}"
   - Include industry-specific details, tools, environments, and actions
   - Show what THIS business actually does, not generic imagery
   - If they're a ${services[0] || businessType}, show ${services[0] || businessType} specific visuals

2. Feels NATIVE to ${platform.toUpperCase()}
   - Match the visual language users expect on this platform
   - ${platform === 'tiktok' ? 'Raw, phone-shot, slightly imperfect aesthetic' : ''}
   - ${platform === 'instagram' ? 'Aesthetic, lifestyle-aspirational, scroll-stopping beauty' : ''}
   - ${platform === 'facebook' ? 'Trustworthy, community-focused, relatable' : ''}
   - ${platform === 'youtube' ? 'High contrast, expressive, thumbnail-optimized' : ''}
   - ${platform === 'google' ? 'Clean, professional, benefit-focused' : ''}

3. Stops the scroll in under 1 second
   - Strong visual hook
   - Clear focal point
   - Emotional resonance

4. Is technically executable by DALL-E
   - Specific, concrete visual descriptions
   - No text or logos (DALL-E struggles with these)
   - Realistic photographic style unless otherwise specified

FORMAT YOUR RESPONSE AS JSON:
{
  "prompt": "The complete DALL-E prompt (200-400 words, highly detailed)",
  "visualConcept": "One sentence describing the core visual idea",
  "whyItWorks": "One sentence on why this will perform on ${platform}",
  "scrollStopElement": "The specific element that stops the scroll"
}

IMPORTANT:
- The prompt must be SPECIFIC to the services listed: ${services.length > 0 ? services.join(', ') : businessType}
- Do NOT use generic "professional" or "technician" language
- Show the ACTUAL work this business does
- Include specific tools, materials, environments, and actions for this industry`

    const response = await anthropic.messages.create({
      model: 'claude-sonnet-4-20250514',
      max_tokens: 1024,
      messages: [
        { role: 'user', content: userPrompt }
      ],
      system: systemPrompt,
    })

    const content = response.content[0]
    if (content.type !== 'text') {
      return NextResponse.json({ error: 'Unexpected response format' }, { status: 500 })
    }

    // Parse the JSON response
    let visualPrompt
    try {
      const jsonMatch = content.text.match(/\{[\s\S]*\}/)
      if (jsonMatch) {
        visualPrompt = JSON.parse(jsonMatch[0])
      } else {
        throw new Error('No JSON found in response')
      }
    } catch {
      console.error('Failed to parse Claude response:', content.text)
      return NextResponse.json({ error: 'Failed to parse visual prompt response' }, { status: 500 })
    }

    return NextResponse.json({
      success: true,
      platform,
      promptType,
      ...visualPrompt,
    })

  } catch (error) {
    console.error('Generate visual prompt error:', error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to generate visual prompt' },
      { status: 500 }
    )
  }
}
