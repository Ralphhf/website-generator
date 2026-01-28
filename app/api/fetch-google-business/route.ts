import { NextRequest, NextResponse } from 'next/server'

const GOOGLE_MAPS_API_KEY = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || ''

interface FetchRequest {
  url: string
}

// Extract business info from various Google Maps URL formats
function parseGoogleMapsUrl(url: string): { query: string; coords?: { lat: number; lng: number } } | null {
  try {
    const decoded = decodeURIComponent(url)

    // Try to extract business name and address from URL
    // Format: /maps/dir//Business+Name,+Address/@lat,lng/...
    // Or: /maps/place/Business+Name+Address/@lat,lng/...

    let query = ''
    let coords: { lat: number; lng: number } | undefined

    // Extract coordinates if present (@lat,lng)
    const coordMatch = decoded.match(/@(-?\d+\.?\d*),(-?\d+\.?\d*)/)
    if (coordMatch) {
      coords = {
        lat: parseFloat(coordMatch[1]),
        lng: parseFloat(coordMatch[2])
      }
    }

    // Try to extract from /dir// format (directions URL)
    const dirMatch = decoded.match(/\/maps\/dir\/\/([^/@]+)/)
    if (dirMatch) {
      query = dirMatch[1].replace(/\+/g, ' ').replace(/,/g, ', ')
    }

    // Try to extract from /place/ format
    if (!query) {
      const placeMatch = decoded.match(/\/maps\/place\/([^/@]+)/)
      if (placeMatch) {
        query = placeMatch[1].replace(/\+/g, ' ').replace(/,/g, ', ')
      }
    }

    // Try to extract from search query parameter
    if (!query) {
      const urlObj = new URL(url)
      const searchQuery = urlObj.searchParams.get('q')
      if (searchQuery) {
        query = searchQuery
      }
    }

    if (!query && !coords) {
      return null
    }

    return { query, coords }
  } catch (error) {
    console.error('Error parsing Google Maps URL:', error)
    return null
  }
}

export async function POST(request: NextRequest) {
  try {
    const body: FetchRequest = await request.json()
    const { url } = body

    if (!url) {
      return NextResponse.json(
        { error: 'Google Maps URL is required' },
        { status: 400 }
      )
    }

    if (!GOOGLE_MAPS_API_KEY) {
      return NextResponse.json(
        { error: 'Google Maps API key not configured' },
        { status: 500 }
      )
    }

    // Parse the URL to extract business info
    const parsed = parseGoogleMapsUrl(url)
    if (!parsed) {
      return NextResponse.json(
        { error: 'Could not parse business information from URL. Please check the URL format.' },
        { status: 400 }
      )
    }

    console.log('Parsed from URL:', parsed)

    // Use Find Place from Text to get the place_id
    let placeId: string | null = null

    if (parsed.query) {
      const findPlaceUrl = `https://maps.googleapis.com/maps/api/place/findplacefromtext/json?` +
        `input=${encodeURIComponent(parsed.query)}` +
        `&inputtype=textquery` +
        `&fields=place_id,name,formatted_address` +
        (parsed.coords ? `&locationbias=point:${parsed.coords.lat},${parsed.coords.lng}` : '') +
        `&key=${GOOGLE_MAPS_API_KEY}`

      const findResponse = await fetch(findPlaceUrl)
      const findData = await findResponse.json()

      console.log('Find Place response:', findData)

      if (findData.status === 'OK' && findData.candidates?.length > 0) {
        placeId = findData.candidates[0].place_id
      }
    }

    // If no place found by text, try nearby search with coordinates
    if (!placeId && parsed.coords) {
      const nearbyUrl = `https://maps.googleapis.com/maps/api/place/nearbysearch/json?` +
        `location=${parsed.coords.lat},${parsed.coords.lng}` +
        `&radius=100` +
        `&key=${GOOGLE_MAPS_API_KEY}`

      const nearbyResponse = await fetch(nearbyUrl)
      const nearbyData = await nearbyResponse.json()

      if (nearbyData.status === 'OK' && nearbyData.results?.length > 0) {
        // Find the closest match by name if we have a query
        if (parsed.query) {
          const queryLower = parsed.query.toLowerCase()
          const match = nearbyData.results.find((r: any) =>
            queryLower.includes(r.name.toLowerCase()) ||
            r.name.toLowerCase().includes(queryLower.split(',')[0].trim())
          )
          placeId = match?.place_id || nearbyData.results[0].place_id
        } else {
          placeId = nearbyData.results[0].place_id
        }
      }
    }

    if (!placeId) {
      return NextResponse.json(
        { error: 'Could not find business on Google. Please check the URL.' },
        { status: 404 }
      )
    }

    // Get full place details
    const detailsUrl = `https://maps.googleapis.com/maps/api/place/details/json?` +
      `place_id=${placeId}` +
      `&fields=place_id,name,formatted_address,geometry,types,rating,user_ratings_total,photos,opening_hours,website,formatted_phone_number,address_components` +
      `&key=${GOOGLE_MAPS_API_KEY}`

    const detailsResponse = await fetch(detailsUrl)
    const detailsData = await detailsResponse.json()

    if (detailsData.status !== 'OK') {
      return NextResponse.json(
        { error: `Could not get business details: ${detailsData.status}` },
        { status: 500 }
      )
    }

    const details = detailsData.result

    // Parse address components
    const addressParts = details.formatted_address?.split(',').map((s: string) => s.trim()) || []
    const city = addressParts[1] || ''
    const stateZip = addressParts[2]?.split(' ') || []

    // Build photo URLs
    const photos = details.photos?.map(
      (p: { photo_reference: string }) =>
        `https://maps.googleapis.com/maps/api/place/photo?maxwidth=800&photo_reference=${p.photo_reference}&key=${GOOGLE_MAPS_API_KEY}`
    ) || []

    // Determine business type from Google's types
    const businessType = details.types?.[0]?.replace(/_/g, ' ') || ''

    const business = {
      placeId: details.place_id,
      name: details.name,
      address: addressParts[0] || details.formatted_address || '',
      city,
      state: stateZip[0] || '',
      zipCode: stateZip[1] || '',
      phone: details.formatted_phone_number || '',
      website: details.website || '',
      businessType,
      types: details.types || [],
      rating: details.rating,
      reviewCount: details.user_ratings_total,
      photos,
      location: {
        lat: details.geometry?.location?.lat || 0,
        lng: details.geometry?.location?.lng || 0,
      },
    }

    console.log('Returning business:', business.name, 'with', photos.length, 'photos')

    return NextResponse.json({
      success: true,
      business,
    })
  } catch (error) {
    console.error('Fetch Google business error:', error)
    return NextResponse.json(
      { error: 'An error occurred while fetching business data' },
      { status: 500 }
    )
  }
}
