import { BusinessProfile } from './types'

const GOOGLE_MAPS_API_KEY = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || ''

export interface SearchParams {
  location: string
  radius: number // in miles
  businessType: string
}

export interface PlaceSearchResult {
  place_id: string
  name: string
  formatted_address: string
  geometry: {
    location: {
      lat: number
      lng: number
    }
  }
  types: string[]
  rating?: number
  user_ratings_total?: number
  photos?: Array<{
    photo_reference: string
    height: number
    width: number
  }>
  opening_hours?: {
    open_now: boolean
  }
  website?: string
  formatted_phone_number?: string
}

// Convert miles to meters for Google API
function milesToMeters(miles: number): number {
  return miles * 1609.34
}

// Geocode an address to get coordinates
export async function geocodeAddress(address: string): Promise<{ lat: number; lng: number } | null> {
  try {
    const response = await fetch(
      `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(address)}&key=${GOOGLE_MAPS_API_KEY}`
    )
    const data = await response.json()

    if (data.status === 'OK' && data.results.length > 0) {
      const { lat, lng } = data.results[0].geometry.location
      return { lat, lng }
    }
    return null
  } catch (error) {
    console.error('Geocoding error:', error)
    return null
  }
}

// Search for businesses using Google Places API
export async function searchBusinesses(params: SearchParams): Promise<BusinessProfile[]> {
  const { location, radius, businessType } = params

  // First geocode the location
  const coordinates = await geocodeAddress(location)
  if (!coordinates) {
    throw new Error('Could not find the specified location')
  }

  const radiusMeters = milesToMeters(radius)

  try {
    // Use the Places API Nearby Search
    const response = await fetch(
      `https://maps.googleapis.com/maps/api/place/nearbysearch/json?` +
        `location=${coordinates.lat},${coordinates.lng}` +
        `&radius=${radiusMeters}` +
        `&type=${businessType}` +
        `&key=${GOOGLE_MAPS_API_KEY}`
    )
    const data = await response.json()

    if (data.status !== 'OK' && data.status !== 'ZERO_RESULTS') {
      throw new Error(`Places API error: ${data.status}`)
    }

    const results: PlaceSearchResult[] = data.results || []

    // Filter to only businesses WITHOUT websites and map to our type
    const businessProfiles = await Promise.all(
      results.map(async (place) => {
        // Get place details to check for website
        const details = await getPlaceDetails(place.place_id)

        // Skip businesses that have websites
        if (details?.website) {
          return null
        }

        return mapPlaceToBusinessProfile(place, details)
      })
    )

    return businessProfiles.filter((b): b is BusinessProfile => b !== null)
  } catch (error) {
    console.error('Search businesses error:', error)
    throw error
  }
}

// Get detailed information about a place
export async function getPlaceDetails(placeId: string): Promise<PlaceSearchResult | null> {
  try {
    const response = await fetch(
      `https://maps.googleapis.com/maps/api/place/details/json?` +
        `place_id=${placeId}` +
        `&fields=place_id,name,formatted_address,geometry,types,rating,user_ratings_total,photos,opening_hours,website,formatted_phone_number,address_components` +
        `&key=${GOOGLE_MAPS_API_KEY}`
    )
    const data = await response.json()

    if (data.status === 'OK') {
      return data.result
    }
    return null
  } catch (error) {
    console.error('Place details error:', error)
    return null
  }
}

// Map Google Place result to our BusinessProfile type
function mapPlaceToBusinessProfile(
  place: PlaceSearchResult,
  details?: PlaceSearchResult | null
): BusinessProfile {
  const fullPlace = details || place

  // Parse address components
  const addressParts = fullPlace.formatted_address?.split(',').map(s => s.trim()) || []
  const city = addressParts[1] || ''
  const stateZip = addressParts[2]?.split(' ') || []
  const state = stateZip[0] || ''
  const zipCode = stateZip[1] || ''

  return {
    placeId: fullPlace.place_id,
    name: fullPlace.name,
    address: addressParts[0] || fullPlace.formatted_address || '',
    city,
    state,
    zipCode,
    phone: (fullPlace as any).formatted_phone_number,
    website: (fullPlace as any).website,
    types: fullPlace.types || [],
    rating: fullPlace.rating,
    reviewCount: fullPlace.user_ratings_total,
    photos: fullPlace.photos?.map(
      (p) =>
        `https://maps.googleapis.com/maps/api/place/photo?maxwidth=800&photo_reference=${p.photo_reference}&key=${GOOGLE_MAPS_API_KEY}`
    ),
    location: {
      lat: fullPlace.geometry?.location?.lat || 0,
      lng: fullPlace.geometry?.location?.lng || 0,
    },
  }
}

// Get photo URL from photo reference
export function getPhotoUrl(photoReference: string, maxWidth = 800): string {
  return `https://maps.googleapis.com/maps/api/place/photo?maxwidth=${maxWidth}&photo_reference=${photoReference}&key=${GOOGLE_MAPS_API_KEY}`
}

// Business type options organized by category
export const businessTypeCategories = [
  {
    category: 'Food & Beverage',
    options: [
      { value: 'restaurant', label: 'Restaurant' },
      { value: 'cafe', label: 'Café / Coffee Shop' },
      { value: 'bakery', label: 'Bakery' },
      { value: 'bar', label: 'Bar / Pub' },
      { value: 'meal_delivery', label: 'Meal Delivery' },
      { value: 'meal_takeaway', label: 'Takeaway / Fast Food' },
      { value: 'ice_cream_shop', label: 'Ice Cream / Gelato Shop' },
      { value: 'food_truck', label: 'Food Truck' },
    ],
  },
  {
    category: 'Beauty & Personal Care',
    options: [
      { value: 'beauty_salon', label: 'Beauty Salon' },
      { value: 'hair_salon', label: 'Hair Salon' },
      { value: 'barber_shop', label: 'Barber Shop' },
      { value: 'spa', label: 'Spa / Wellness' },
      { value: 'nail_salon', label: 'Nail Salon' },
      { value: 'tanning_salon', label: 'Tanning Salon' },
    ],
  },
  {
    category: 'Healthcare',
    options: [
      { value: 'dentist', label: 'Dentist' },
      { value: 'doctor', label: 'Doctor / Medical Clinic' },
      { value: 'physiotherapist', label: 'Physiotherapist' },
      { value: 'chiropractor', label: 'Chiropractor' },
      { value: 'veterinary_care', label: 'Veterinarian' },
      { value: 'pharmacy', label: 'Pharmacy' },
      { value: 'optician', label: 'Optician / Eye Care' },
      { value: 'psychologist', label: 'Psychologist / Therapist' },
      { value: 'acupuncture', label: 'Acupuncture' },
    ],
  },
  {
    category: 'Home Services',
    options: [
      { value: 'plumber', label: 'Plumber' },
      { value: 'electrician', label: 'Electrician' },
      { value: 'roofing_contractor', label: 'Roofing Contractor' },
      { value: 'hvac_contractor', label: 'HVAC Contractor' },
      { value: 'painter', label: 'Painter' },
      { value: 'locksmith', label: 'Locksmith' },
      { value: 'moving_company', label: 'Moving Company' },
      { value: 'pest_control', label: 'Pest Control' },
      { value: 'general_contractor', label: 'General Contractor' },
      { value: 'handyman', label: 'Handyman' },
      { value: 'house_cleaning', label: 'House Cleaning' },
      { value: 'landscaping', label: 'Landscaping / Lawn Care' },
      { value: 'pool_service', label: 'Pool Service' },
      { value: 'window_cleaning', label: 'Window Cleaning' },
      { value: 'carpet_cleaning', label: 'Carpet Cleaning' },
      { value: 'garage_door', label: 'Garage Door Service' },
    ],
  },
  {
    category: 'Automotive',
    options: [
      { value: 'car_repair', label: 'Auto Repair / Mechanic' },
      { value: 'car_dealer', label: 'Car Dealer' },
      { value: 'car_wash', label: 'Car Wash / Detailing' },
      { value: 'towing_company', label: 'Towing Company' },
      { value: 'tire_shop', label: 'Tire Shop' },
      { value: 'auto_body_shop', label: 'Auto Body Shop' },
      { value: 'oil_change', label: 'Oil Change / Lube' },
    ],
  },
  {
    category: 'Professional Services',
    options: [
      { value: 'lawyer', label: 'Lawyer / Attorney' },
      { value: 'accountant', label: 'Accountant / CPA' },
      { value: 'insurance_agency', label: 'Insurance Agency' },
      { value: 'real_estate_agency', label: 'Real Estate Agency' },
      { value: 'travel_agency', label: 'Travel Agency' },
      { value: 'marketing_agency', label: 'Marketing Agency' },
      { value: 'financial_planner', label: 'Financial Planner' },
      { value: 'notary', label: 'Notary Public' },
      { value: 'tax_preparation', label: 'Tax Preparation' },
    ],
  },
  {
    category: 'Fitness & Sports',
    options: [
      { value: 'gym', label: 'Gym / Fitness Center' },
      { value: 'yoga_studio', label: 'Yoga Studio' },
      { value: 'dance_studio', label: 'Dance Studio' },
      { value: 'martial_arts_school', label: 'Martial Arts School' },
      { value: 'pilates_studio', label: 'Pilates Studio' },
      { value: 'personal_trainer', label: 'Personal Trainer' },
      { value: 'golf_course', label: 'Golf Course / Club' },
    ],
  },
  {
    category: 'Retail',
    options: [
      { value: 'jewelry_store', label: 'Jewelry Store' },
      { value: 'florist', label: 'Florist' },
      { value: 'clothing_store', label: 'Clothing / Boutique' },
      { value: 'furniture_store', label: 'Furniture Store' },
      { value: 'pet_store', label: 'Pet Store' },
      { value: 'hardware_store', label: 'Hardware Store' },
      { value: 'electronics_store', label: 'Electronics Store' },
      { value: 'gift_shop', label: 'Gift Shop' },
      { value: 'liquor_store', label: 'Liquor / Wine Store' },
      { value: 'convenience_store', label: 'Convenience Store' },
    ],
  },
  {
    category: 'Education',
    options: [
      { value: 'tutoring', label: 'Tutoring' },
      { value: 'driving_school', label: 'Driving School' },
      { value: 'child_care_agency', label: 'Daycare / Child Care' },
      { value: 'music_school', label: 'Music School' },
      { value: 'language_school', label: 'Language School' },
      { value: 'art_school', label: 'Art School' },
      { value: 'preschool', label: 'Preschool' },
    ],
  },
  {
    category: 'Events & Entertainment',
    options: [
      { value: 'photographer', label: 'Photographer' },
      { value: 'event_planner', label: 'Event Planner' },
      { value: 'caterer', label: 'Caterer' },
      { value: 'dj', label: 'DJ' },
      { value: 'videographer', label: 'Videographer' },
      { value: 'wedding_venue', label: 'Wedding / Event Venue' },
      { value: 'party_rental', label: 'Party Rental' },
    ],
  },
  {
    category: 'Other Services',
    options: [
      { value: 'laundry', label: 'Laundry / Dry Cleaning' },
      { value: 'tailor', label: 'Tailor / Alterations' },
      { value: 'print_shop', label: 'Print Shop' },
      { value: 'storage', label: 'Storage Facility' },
      { value: 'shoe_repair', label: 'Shoe Repair / Cobbler' },
      { value: 'pawn_shop', label: 'Pawn Shop' },
      { value: 'tattoo_parlor', label: 'Tattoo Parlor' },
      { value: 'funeral_home', label: 'Funeral Home' },
      { value: 'kennel', label: 'Pet Boarding / Kennel' },
      { value: 'dog_groomer', label: 'Pet Grooming' },
      { value: 'lodging', label: 'Hotel / Lodging' },
      { value: 'bank', label: 'Bank' },
    ],
  },
]

// Flat list of all business type options (for backwards compatibility)
export const businessTypeOptions = businessTypeCategories.flatMap(cat => cat.options)

// Radius options
export const radiusOptions = [
  { value: 1, label: '1 mile' },
  { value: 5, label: '5 miles' },
  { value: 10, label: '10 miles' },
  { value: 15, label: '15 miles' },
  { value: 25, label: '25 miles' },
  { value: 50, label: '50 miles' },
]
