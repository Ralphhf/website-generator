// AI Content Generation using Claude API
import { BusinessInfo, Testimonial } from './types'

const CLAUDE_API_KEY = process.env.CLAUDE_API_KEY || ''

interface ClaudeMessage {
  role: 'user' | 'assistant'
  content: string
}

interface ClaudeResponse {
  content: Array<{
    type: 'text'
    text: string
  }>
}

async function callClaude(messages: ClaudeMessage[], maxTokens: number = 1024): Promise<string> {
  const response = await fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-api-key': CLAUDE_API_KEY,
      'anthropic-version': '2023-06-01',
    },
    body: JSON.stringify({
      model: 'claude-3-haiku-20240307',
      max_tokens: maxTokens,
      messages,
    }),
  })

  if (!response.ok) {
    const error = await response.json()
    console.error('Claude API error:', error)
    throw new Error('Failed to generate content')
  }

  const data: ClaudeResponse = await response.json()
  return data.content[0]?.text || ''
}

export async function generateTagline(businessName: string, businessType: string, services: string[]): Promise<string> {
  const prompt = `Generate a short, catchy tagline for a ${businessType} business called "${businessName}".
${services.length > 0 ? `They offer these services: ${services.join(', ')}.` : ''}

The tagline should be:
- Maximum 8 words
- Professional yet memorable
- Highlight their expertise or value proposition

Return ONLY the tagline, nothing else.`

  const result = await callClaude([{ role: 'user', content: prompt }], 100)
  return result.replace(/^["']|["']$/g, '').trim()
}

export async function generateDescription(
  businessName: string,
  businessType: string,
  services: string[],
  yearsInBusiness: number,
  city: string,
  state: string
): Promise<string> {
  const location = city && state ? `${city}, ${state}` : ''

  const prompt = `Write a compelling business description for "${businessName}", a ${businessType} business${location ? ` located in ${location}` : ''}.

${services.length > 0 ? `Services offered: ${services.join(', ')}.` : ''}
${yearsInBusiness > 0 ? `They have ${yearsInBusiness} years of experience in the industry.` : ''}

The description should:
- Be 2-3 paragraphs (about 150-200 words total)
- Highlight their expertise and professionalism
- Mention their commitment to customer satisfaction
- Include a call to action
- Be SEO-friendly with natural keyword placement
- Sound authentic and trustworthy

Return ONLY the description, no quotes or labels.`

  return await callClaude([{ role: 'user', content: prompt }], 500)
}

export async function generateAboutSection(
  businessName: string,
  businessType: string,
  yearsInBusiness: number,
  city: string,
  state: string
): Promise<string> {
  const location = city && state ? `${city}, ${state}` : ''

  const prompt = `Write an "About Us" section for "${businessName}", a ${businessType} business${location ? ` serving ${location} and surrounding areas` : ''}.

${yearsInBusiness > 0 ? `They have been in business for ${yearsInBusiness} years.` : ''}

The about section should:
- Be warm and personable (2 paragraphs, about 120-150 words)
- Highlight their mission and values
- Emphasize their dedication to quality and customer service
- Mention their local expertise and community involvement
- Build trust with potential customers

Return ONLY the about section content, no headers or labels.`

  return await callClaude([{ role: 'user', content: prompt }], 400)
}

export async function generateServices(
  businessType: string,
  existingServices: string[]
): Promise<string[]> {
  const prompt = `Generate a list of 6-8 common services offered by a ${businessType} business.

${existingServices.length > 0 ? `They already have these services: ${existingServices.join(', ')}. Add complementary services.` : ''}

Return ONLY a comma-separated list of service names, nothing else. Each service should be 2-4 words maximum.`

  const result = await callClaude([{ role: 'user', content: prompt }], 200)
  return result.split(',').map(s => s.trim()).filter(Boolean)
}

export async function generateTestimonials(
  businessName: string,
  businessType: string,
  services: string[],
  count: number = 3
): Promise<Omit<Testimonial, 'id'>[]> {
  const prompt = `Generate ${count} realistic customer testimonials for "${businessName}", a ${businessType} business.

${services.length > 0 ? `Services they offer: ${services.join(', ')}.` : ''}

For each testimonial, create:
- A realistic customer name (first and last name)
- Their role (e.g., "Homeowner", "Business Owner", "Property Manager")
- Their location (city, state abbreviation like "Austin, TX")
- A detailed, authentic-sounding review (40-60 words) that mentions specific positive experiences
- A rating (mostly 5 stars, occasionally 4)

Return the testimonials as a JSON array with this format:
[
  {
    "author": "John Smith",
    "role": "Homeowner",
    "company": "Austin, TX",
    "content": "The review text...",
    "rating": 5
  }
]

Return ONLY the JSON array, no other text.`

  const result = await callClaude([{ role: 'user', content: prompt }], 800)

  try {
    // Extract JSON from the response
    const jsonMatch = result.match(/\[[\s\S]*\]/)
    if (jsonMatch) {
      return JSON.parse(jsonMatch[0])
    }
  } catch (e) {
    console.error('Failed to parse testimonials:', e)
  }

  return []
}

export async function generatePortfolioSections(
  businessType: string
): Promise<Array<{ title: string; description: string }>> {
  const prompt = `Generate 4-6 portfolio section titles and descriptions for a ${businessType} business website.

Each section should showcase a different type of work they do.

Return as a JSON array with this format:
[
  {
    "title": "Section Title",
    "description": "Brief 10-15 word description of this work category"
  }
]

Return ONLY the JSON array, no other text.`

  const result = await callClaude([{ role: 'user', content: prompt }], 400)

  try {
    const jsonMatch = result.match(/\[[\s\S]*\]/)
    if (jsonMatch) {
      return JSON.parse(jsonMatch[0])
    }
  } catch (e) {
    console.error('Failed to parse portfolio sections:', e)
  }

  return []
}
