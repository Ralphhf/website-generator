import { NextRequest, NextResponse } from 'next/server'

const CLAUDE_API_KEY = process.env.CLAUDE_API_KEY || ''

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { businessName, businessType, services } = body

    if (!businessType) {
      return NextResponse.json(
        { error: 'Business type is required' },
        { status: 400 }
      )
    }

    const prompt = `Generate 5 image search keywords for a business website hero image.

Business Name: ${businessName || 'Not provided'}
Business Type: ${businessType}
Services: ${services?.length > 0 ? services.join(', ') : 'Not provided'}

Requirements:
- Keywords should find professional, high-quality stock photos on Unsplash
- Focus on visuals that represent this specific business type
- Include a mix of: workspace/interior shots, people working, and the end result/service
- Make keywords specific, not generic (e.g., "barber cutting hair" not "professional team")
- Each keyword should be 2-4 words

Return ONLY a JSON array of 5 strings, nothing else. Example format:
["keyword one", "keyword two", "keyword three", "keyword four", "keyword five"]`

    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': CLAUDE_API_KEY,
        'anthropic-version': '2023-06-01',
      },
      body: JSON.stringify({
        model: 'claude-3-haiku-20240307',
        max_tokens: 200,
        messages: [{ role: 'user', content: prompt }],
      }),
    })

    if (!response.ok) {
      console.error('Claude API error:', await response.json())
      return NextResponse.json(
        { error: 'Failed to generate keywords' },
        { status: 500 }
      )
    }

    const data = await response.json()
    const text = data.content[0]?.text || ''

    // Parse the JSON array from the response
    const jsonMatch = text.match(/\[[\s\S]*\]/)
    if (jsonMatch) {
      const keywords = JSON.parse(jsonMatch[0])
      return NextResponse.json({ success: true, keywords })
    }

    return NextResponse.json(
      { error: 'Failed to parse keywords' },
      { status: 500 }
    )
  } catch (error) {
    console.error('Hero keywords generation error:', error)
    return NextResponse.json(
      { error: 'Failed to generate keywords' },
      { status: 500 }
    )
  }
}
