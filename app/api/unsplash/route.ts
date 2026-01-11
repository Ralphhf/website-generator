import { NextRequest, NextResponse } from 'next/server'
import {
  searchPhotos,
  getBusinessPhotos,
  getPortfolioSectionPhotos,
  getBulkBusinessPhotos,
  trackDownload,
} from '@/lib/unsplash'

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams
  const action = searchParams.get('action') || 'search'

  try {
    switch (action) {
      case 'search': {
        const query = searchParams.get('query')
        const perPage = parseInt(searchParams.get('perPage') || '12')
        const page = parseInt(searchParams.get('page') || '1')

        if (!query) {
          return NextResponse.json(
            { error: 'Query is required' },
            { status: 400 }
          )
        }

        const photos = await searchPhotos(query, perPage, page)
        return NextResponse.json({ success: true, photos })
      }

      case 'business': {
        const businessType = searchParams.get('businessType')
        const section = searchParams.get('section') || undefined
        const perPage = parseInt(searchParams.get('perPage') || '8')

        if (!businessType) {
          return NextResponse.json(
            { error: 'Business type is required' },
            { status: 400 }
          )
        }

        const photos = await getBusinessPhotos(businessType, section, perPage)
        return NextResponse.json({ success: true, photos })
      }

      case 'portfolio': {
        const businessType = searchParams.get('businessType')
        const sectionTitle = searchParams.get('sectionTitle')
        const perPage = parseInt(searchParams.get('perPage') || '6')

        if (!businessType || !sectionTitle) {
          return NextResponse.json(
            { error: 'Business type and section title are required' },
            { status: 400 }
          )
        }

        const photos = await getPortfolioSectionPhotos(businessType, sectionTitle, perPage)
        return NextResponse.json({ success: true, photos })
      }

      case 'bulk': {
        const businessType = searchParams.get('businessType')
        const sections = searchParams.get('sections')?.split(',') || []

        if (!businessType || sections.length === 0) {
          return NextResponse.json(
            { error: 'Business type and sections are required' },
            { status: 400 }
          )
        }

        const photos = await getBulkBusinessPhotos(businessType, sections)
        return NextResponse.json({ success: true, photos })
      }

      default:
        return NextResponse.json(
          { error: 'Invalid action' },
          { status: 400 }
        )
    }
  } catch (error) {
    console.error('Unsplash API error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch photos' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const { downloadUrl } = await request.json()

    if (!downloadUrl) {
      return NextResponse.json(
        { error: 'Download URL is required' },
        { status: 400 }
      )
    }

    await trackDownload(downloadUrl)
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Track download error:', error)
    return NextResponse.json(
      { error: 'Failed to track download' },
      { status: 500 }
    )
  }
}
