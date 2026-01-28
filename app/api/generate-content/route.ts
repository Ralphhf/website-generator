import { NextRequest, NextResponse } from 'next/server'
import {
  generateTagline,
  generateDescription,
  generateAboutSection,
  generateServices,
  generateTestimonials,
  generatePortfolioSections,
  generatePricing,
  generateFAQs,
} from '@/lib/ai-content'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { type, ...params } = body

    let result: unknown

    switch (type) {
      case 'tagline':
        result = await generateTagline(
          params.businessName,
          params.businessType,
          params.services || [],
          params.brandTone,
          params.primaryCTA
        )
        break

      case 'description':
        result = await generateDescription(
          params.businessName,
          params.businessType,
          params.services || [],
          params.yearsInBusiness || 0,
          params.city || '',
          params.state || '',
          params.brandTone,
          params.primaryCTA
        )
        break

      case 'about':
        result = await generateAboutSection(
          params.businessName,
          params.businessType,
          params.yearsInBusiness || 0,
          params.city || '',
          params.state || ''
        )
        break

      case 'services':
        result = await generateServices(
          params.businessType || '',
          params.existingServices || [],
          params.businessName
        )
        break

      case 'testimonials':
        result = await generateTestimonials(
          params.businessName,
          params.businessType,
          params.services || [],
          params.count || 3,
          params.brandTone,
          params.primaryCTA
        )
        break

      case 'portfolio-sections':
        result = await generatePortfolioSections(params.businessType)
        break

      case 'pricing':
        result = await generatePricing(
          params.businessName,
          params.businessType,
          params.services || [],
          params.brandTone,
          params.primaryCTA
        )
        break

      case 'faqs':
        result = await generateFAQs(
          params.businessName,
          params.businessType,
          params.services || [],
          params.brandTone,
          params.primaryCTA
        )
        break

      default:
        return NextResponse.json(
          { error: 'Invalid generation type' },
          { status: 400 }
        )
    }

    return NextResponse.json({ success: true, result })
  } catch (error) {
    console.error('Content generation error:', error)
    return NextResponse.json(
      { error: 'Failed to generate content' },
      { status: 500 }
    )
  }
}
