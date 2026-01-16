import { NextRequest, NextResponse } from 'next/server'
import Anthropic from '@anthropic-ai/sdk'

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData()
    const audioFile = formData.get('audio') as File
    const profileId = formData.get('profileId') as string
    const businessName = formData.get('businessName') as string

    if (!audioFile) {
      return NextResponse.json({ error: 'No audio file provided' }, { status: 400 })
    }

    if (!profileId) {
      return NextResponse.json({ error: 'No profile ID provided' }, { status: 400 })
    }

    // Check for OpenAI API key
    const openaiKey = process.env.OPENAI_API_KEY
    if (!openaiKey) {
      return NextResponse.json({ error: 'OpenAI API key not configured' }, { status: 500 })
    }

    // Check for Anthropic API key
    const anthropicKey = process.env.CLAUDE_API_KEY
    if (!anthropicKey) {
      return NextResponse.json({ error: 'Anthropic API key not configured' }, { status: 500 })
    }

    // Step 1: Send audio to OpenAI Whisper for transcription
    const whisperFormData = new FormData()
    whisperFormData.append('file', audioFile, 'recording.webm')
    whisperFormData.append('model', 'whisper-1')
    whisperFormData.append('language', 'en')

    const whisperResponse = await fetch('https://api.openai.com/v1/audio/transcriptions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${openaiKey}`,
      },
      body: whisperFormData,
    })

    if (!whisperResponse.ok) {
      const errorData = await whisperResponse.text()
      console.error('Whisper API error:', errorData)
      return NextResponse.json({ error: 'Failed to transcribe audio' }, { status: 500 })
    }

    const whisperData = await whisperResponse.json()
    const transcript = whisperData.text

    if (!transcript || transcript.trim().length === 0) {
      return NextResponse.json({ error: 'No speech detected in the recording' }, { status: 400 })
    }

    // Step 2: Send transcript to Claude for summarization
    const anthropic = new Anthropic({
      apiKey: anthropicKey,
    })

    const claudeResponse = await anthropic.messages.create({
      model: 'claude-sonnet-4-20250514',
      max_tokens: 2048,
      messages: [
        {
          role: 'user',
          content: `You are a professional meeting summarizer. Below is a transcript from a client meeting for a business called "${businessName || 'the business'}".

Please analyze this transcript and provide a structured summary with the following sections:

## Meeting Summary
A brief 2-3 sentence overview of what was discussed.

## Client Requirements
- List the specific things the client wants or needs
- Include any features, services, or products they mentioned
- Note any preferences they expressed

## Key Decisions Made
- Any agreements or decisions reached during the meeting
- Commitments made by either party

## Action Items
- Tasks that need to be completed
- Who is responsible (if mentioned)
- Any deadlines discussed

## Important Notes
- Budget mentions or constraints
- Timeline expectations
- Any concerns or hesitations the client expressed
- Contact preferences or availability

## Client Sentiment
A brief assessment of the client's overall mood and enthusiasm level.

---

TRANSCRIPT:
${transcript}

---

Please provide the summary in a clear, professional format. If any section has no relevant information from the transcript, you can skip it or note "Not discussed".`
        }
      ]
    })

    const summary = claudeResponse.content[0].type === 'text'
      ? claudeResponse.content[0].text
      : 'Unable to generate summary'

    // Step 3: Save to database
    const { createClient } = await import('@supabase/supabase-js')
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    )

    const { error: updateError } = await supabase
      .from('profiles')
      .update({
        meeting_transcript: transcript,
        meeting_summary: summary,
        meeting_recorded_at: new Date().toISOString(),
      })
      .eq('id', profileId)

    if (updateError) {
      console.error('Database update error:', updateError)
      // Still return the results even if save fails
      return NextResponse.json({
        transcript,
        summary,
        recorded_at: new Date().toISOString(),
        saved: false,
        warning: 'Results generated but failed to save to database'
      })
    }

    return NextResponse.json({
      transcript,
      summary,
      recorded_at: new Date().toISOString(),
      saved: true
    })

  } catch (error) {
    console.error('Transcribe API error:', error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to process recording' },
      { status: 500 }
    )
  }
}
