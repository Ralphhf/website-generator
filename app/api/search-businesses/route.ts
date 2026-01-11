import { NextRequest, NextResponse } from 'next/server'

const GOOGLE_MAPS_API_KEY = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || ''

interface SearchRequest {
  location: string
  radius: number
  businessType: string
}

// Convert miles to meters
function milesToMeters(miles: number): number {
  return miles * 1609.34
}

export async function POST(request: NextRequest) {
  try {
    const body: SearchRequest = await request.json()
    const { location, radius, businessType } = body

    if (!location || !businessType) {
      return NextResponse.json(
        { error: 'Location and business type are required' },
        { status: 400 }
      )
    }

    if (!GOOGLE_MAPS_API_KEY) {
      return NextResponse.json(
        { error: 'Google Maps API key not configured' },
        { status: 500 }
      )
    }

    // Step 1: Geocode the location
    const geocodeResponse = await fetch(
      `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(location)}&key=${GOOGLE_MAPS_API_KEY}`
    )
    const geocodeData = await geocodeResponse.json()

    if (geocodeData.status !== 'OK' || !geocodeData.results.length) {
      return NextResponse.json(
        { error: 'Could not find the specified location' },
        { status: 400 }
      )
    }

    const { lat, lng } = geocodeData.results[0].geometry.location
    const radiusMeters = milesToMeters(radius)

    // Step 2: Search for businesses
    const placesResponse = await fetch(
      `https://maps.googleapis.com/maps/api/place/nearbysearch/json?` +
        `location=${lat},${lng}` +
        `&radius=${radiusMeters}` +
        `&type=${businessType}` +
        `&key=${GOOGLE_MAPS_API_KEY}`
    )
    const placesData = await placesResponse.json()

    if (placesData.status !== 'OK' && placesData.status !== 'ZERO_RESULTS') {
      return NextResponse.json(
        { error: `Places API error: ${placesData.status}` },
        { status: 500 }
      )
    }

    const results = placesData.results || []

    // Step 3: Get details for each place and filter those without websites
    const businessesWithoutWebsites = []

    for (const place of results.slice(0, 20)) {
      // Limit to 20 to avoid rate limits
      const detailsResponse = await fetch(
        `https://maps.googleapis.com/maps/api/place/details/json?` +
          `place_id=${place.place_id}` +
          `&fields=place_id,name,formatted_address,geometry,types,rating,user_ratings_total,photos,opening_hours,website,formatted_phone_number,address_components` +
          `&key=${GOOGLE_MAPS_API_KEY}`
      )
      const detailsData = await detailsResponse.json()

      if (detailsData.status === 'OK') {
        const details = detailsData.result

        // Skip if has website
        if (details.website) continue

        // Parse address
        const addressParts = details.formatted_address?.split(',').map((s: string) => s.trim()) || []
        const city = addressParts[1] || ''
        const stateZip = addressParts[2]?.split(' ') || []

        businessesWithoutWebsites.push({
          placeId: details.place_id,
          name: details.name,
          address: addressParts[0] || details.formatted_address || '',
          city,
          state: stateZip[0] || '',
          zipCode: stateZip[1] || '',
          phone: details.formatted_phone_number,
          types: details.types || [],
          rating: details.rating,
          reviewCount: details.user_ratings_total,
          photos: details.photos?.slice(0, 5).map(
            (p: { photo_reference: string }) =>
              `https://maps.googleapis.com/maps/api/place/photo?maxwidth=800&photo_reference=${p.photo_reference}&key=${GOOGLE_MAPS_API_KEY}`
          ),
          location: {
            lat: details.geometry?.location?.lat || 0,
            lng: details.geometry?.location?.lng || 0,
          },
        })
      }
    }

    return NextResponse.json({
      businesses: businessesWithoutWebsites,
      total: businessesWithoutWebsites.length,
    })
  } catch (error) {
    console.error('Search businesses error:', error)
    return NextResponse.json(
      { error: 'An error occurred while searching' },
      { status: 500 }
    )
  }
}
