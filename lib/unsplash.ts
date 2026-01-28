// Unsplash API integration for business-related photos

const UNSPLASH_ACCESS_KEY = process.env.UNSPLASH_ACCESS_KEY || ''

export interface UnsplashPhoto {
  id: string
  url: string
  thumbUrl: string
  alt: string
  photographer: string
  photographerUrl: string
  downloadUrl: string
}

interface UnsplashApiPhoto {
  id: string
  urls: {
    raw: string
    full: string
    regular: string
    small: string
    thumb: string
  }
  alt_description: string | null
  description: string | null
  user: {
    name: string
    links: {
      html: string
    }
  }
  links: {
    download_location: string
  }
}

// Search terms optimized for different business types
const businessTypeSearchTerms: Record<string, string[]> = {
  general_contractor: ['home renovation', 'kitchen remodel', 'bathroom remodel', 'home construction', 'interior design modern'],
  painter: ['house painting', 'interior paint', 'painted walls', 'home interior design', 'wall colors'],
  roofing_contractor: ['roof construction', 'house roof', 'roofing work', 'modern house exterior', 'home exterior'],
  plumber: ['bathroom modern', 'kitchen sink', 'plumbing fixtures', 'modern bathroom', 'water fixtures'],
  electrician: ['modern lighting', 'electrical work', 'home lighting', 'smart home', 'led lighting interior'],
  hvac: ['air conditioning', 'heating system', 'modern hvac', 'home comfort', 'climate control'],
  landscaping: ['landscape design', 'garden design', 'outdoor living', 'backyard landscaping', 'beautiful garden'],
  restaurant: ['restaurant interior', 'food photography', 'dining room', 'chef cooking', 'gourmet food'],
  cafe: ['coffee shop', 'cafe interior', 'latte art', 'cozy cafe', 'barista'],
  spa: ['spa interior', 'massage therapy', 'wellness spa', 'relaxation', 'spa treatment'],
  beauty_salon: ['hair salon', 'beauty salon', 'hairstylist', 'hair styling', 'beauty treatment'],
  florist: ['flower arrangement', 'florist shop', 'wedding flowers', 'floral design', 'beautiful bouquet'],
  bakery: ['bakery', 'fresh bread', 'pastry', 'cake decoration', 'artisan bakery'],
  gym: ['modern gym', 'fitness center', 'workout', 'gym equipment', 'fitness training'],
  dental: ['dental office', 'dentist', 'dental care', 'modern dental', 'smile teeth'],
  medical: ['medical office', 'healthcare', 'doctor office', 'medical clinic', 'health care'],
  law_firm: ['law office', 'legal office', 'business meeting', 'professional office', 'corporate interior'],
  accounting: ['business office', 'financial planning', 'office desk', 'professional workspace', 'corporate'],
  real_estate: ['modern house', 'luxury home', 'real estate', 'beautiful home', 'home interior'],
  auto_repair: ['auto repair', 'car mechanic', 'auto shop', 'car service', 'automotive'],
  cleaning: ['clean home', 'cleaning service', 'spotless home', 'clean interior', 'tidy home'],
  moving: ['moving boxes', 'moving day', 'home moving', 'relocation', 'moving truck'],
  pet_services: ['pet grooming', 'dog walking', 'pet care', 'happy dog', 'pet salon'],
  photography: ['photography studio', 'photographer', 'camera', 'photo session', 'professional photography'],
  wedding: ['wedding venue', 'wedding decoration', 'wedding ceremony', 'beautiful wedding', 'wedding flowers'],
  default: ['professional business', 'modern office', 'team work', 'business success', 'quality service'],
}

// Get optimized search terms for a business type
function getSearchTermsForBusiness(businessType: string): string[] {
  return businessTypeSearchTerms[businessType] || businessTypeSearchTerms.default
}

// Search for photos on Unsplash
export async function searchPhotos(
  query: string,
  perPage: number = 12,
  page: number = 1
): Promise<UnsplashPhoto[]> {
  if (!UNSPLASH_ACCESS_KEY) {
    console.error('Unsplash API key not configured')
    return []
  }

  try {
    const params = new URLSearchParams({
      query,
      per_page: perPage.toString(),
      page: page.toString(),
      orientation: 'landscape',
      order_by: 'relevant',
    })

    const response = await fetch(
      `https://api.unsplash.com/search/photos?${params}`,
      {
        headers: {
          Authorization: `Client-ID ${UNSPLASH_ACCESS_KEY}`,
        },
      }
    )

    if (!response.ok) {
      const error = await response.json()
      console.error('Unsplash API error:', error)
      return []
    }

    const data = await response.json()

    return data.results.map((photo: UnsplashApiPhoto) => ({
      id: photo.id,
      url: photo.urls.regular,
      thumbUrl: photo.urls.small,
      alt: photo.alt_description || photo.description || query,
      photographer: photo.user.name,
      photographerUrl: photo.user.links.html,
      downloadUrl: photo.links.download_location,
    }))
  } catch (error) {
    console.error('Unsplash search error:', error)
    return []
  }
}

// Get photos tailored for a specific business type
export async function getBusinessPhotos(
  businessType: string,
  section?: string,
  perPage: number = 8
): Promise<UnsplashPhoto[]> {
  const searchTerms = getSearchTermsForBusiness(businessType)

  // If a section is specified, try to find more relevant photos
  let query: string
  if (section) {
    // Combine section with business type for more relevant results
    query = `${section} ${businessType.replace(/_/g, ' ')}`
  } else {
    // Pick a random search term for variety
    query = searchTerms[Math.floor(Math.random() * searchTerms.length)]
  }

  return searchPhotos(query, perPage)
}

// Get curated photos for specific portfolio sections
export async function getPortfolioSectionPhotos(
  businessType: string,
  sectionTitle: string,
  perPage: number = 6,
  page: number = 1
): Promise<UnsplashPhoto[]> {
  // Create a search query combining section title with business context
  const businessContext = businessType.replace(/_/g, ' ')
  const query = `${sectionTitle} ${businessContext}`

  return searchPhotos(query, perPage, page)
}

// Track download for Unsplash attribution requirements
export async function trackDownload(downloadUrl: string): Promise<void> {
  if (!UNSPLASH_ACCESS_KEY) return

  try {
    await fetch(downloadUrl, {
      headers: {
        Authorization: `Client-ID ${UNSPLASH_ACCESS_KEY}`,
      },
    })
  } catch (error) {
    console.error('Failed to track Unsplash download:', error)
  }
}

// Get a hero image for the business
export async function getHeroImage(businessType: string): Promise<UnsplashPhoto | null> {
  const searchTerms = getSearchTermsForBusiness(businessType)
  const query = searchTerms[0] // Use primary search term for hero

  const photos = await searchPhotos(query, 1)
  return photos[0] || null
}

// Get multiple photos for different sections at once
export async function getBulkBusinessPhotos(
  businessType: string,
  sections: string[]
): Promise<Record<string, UnsplashPhoto[]>> {
  const results: Record<string, UnsplashPhoto[]> = {}

  // Fetch photos for each section in parallel
  await Promise.all(
    sections.map(async (section) => {
      results[section] = await getPortfolioSectionPhotos(businessType, section, 4)
    })
  )

  return results
}
