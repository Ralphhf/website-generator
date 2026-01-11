import { BusinessInfo, LocalBusinessSchema, SEOConfig, OpeningHoursSpec } from './types'
import { getBusinessTypeName } from './utils'

// Map our business types to Schema.org types
const schemaTypeMap: Record<string, string> = {
  restaurant: 'Restaurant',
  cafe: 'CafeOrCoffeeShop',
  bar: 'BarOrPub',
  bakery: 'Bakery',
  gym: 'HealthClub',
  spa: 'DaySpa',
  beauty_salon: 'BeautySalon',
  hair_care: 'HairSalon',
  dentist: 'Dentist',
  doctor: 'Physician',
  lawyer: 'Attorney',
  accounting: 'AccountingService',
  real_estate_agency: 'RealEstateAgent',
  car_dealer: 'AutoDealer',
  car_repair: 'AutoRepair',
  plumber: 'Plumber',
  electrician: 'Electrician',
  roofing_contractor: 'RoofingContractor',
  general_contractor: 'GeneralContractor',
  painter: 'HousePainter',
  locksmith: 'Locksmith',
  moving_company: 'MovingCompany',
  storage: 'SelfStorage',
  pet_store: 'PetStore',
  veterinary_care: 'VeterinaryCare',
  florist: 'Florist',
  jewelry_store: 'JewelryStore',
  clothing_store: 'ClothingStore',
  furniture_store: 'FurnitureStore',
  hardware_store: 'HardwareStore',
  pharmacy: 'Pharmacy',
  lodging: 'Hotel',
  travel_agency: 'TravelAgency',
  insurance_agency: 'InsuranceAgency',
  bank: 'BankOrCreditUnion',
}

// Get Schema.org type from business type
export function getSchemaType(businessType: string): string {
  return schemaTypeMap[businessType] || 'LocalBusiness'
}

// Generate Local Business Schema
export function generateLocalBusinessSchema(businessInfo: BusinessInfo, websiteUrl: string): LocalBusinessSchema {
  const schemaType = getSchemaType(businessInfo.businessType)

  const sameAs: string[] = []
  if (businessInfo.googleProfileUrl) sameAs.push(businessInfo.googleProfileUrl)
  if (businessInfo.facebookUrl) sameAs.push(businessInfo.facebookUrl)
  if (businessInfo.instagramUrl) sameAs.push(businessInfo.instagramUrl)
  if (businessInfo.linkedinUrl) sameAs.push(businessInfo.linkedinUrl)
  if (businessInfo.yelpUrl) sameAs.push(businessInfo.yelpUrl)

  return {
    '@type': schemaType,
    name: businessInfo.name,
    description: businessInfo.description,
    url: websiteUrl,
    telephone: businessInfo.phone,
    email: businessInfo.email,
    address: {
      '@type': 'PostalAddress',
      streetAddress: businessInfo.address,
      addressLocality: businessInfo.city,
      addressRegion: businessInfo.state,
      postalCode: businessInfo.zipCode,
      addressCountry: 'US',
    },
    sameAs: sameAs.length > 0 ? sameAs : undefined,
    image: businessInfo.logo,
  }
}

// Generate full JSON-LD script
export function generateJsonLd(businessInfo: BusinessInfo, websiteUrl: string): string {
  const schema = generateLocalBusinessSchema(businessInfo, websiteUrl)

  const jsonLd = {
    '@context': 'https://schema.org',
    ...schema,
  }

  return JSON.stringify(jsonLd, null, 2)
}

// Generate SEO Config
export function generateSEOConfig(businessInfo: BusinessInfo, websiteUrl: string): SEOConfig {
  const typeName = getBusinessTypeName(businessInfo.businessType)
  const locationStr = `${businessInfo.city}, ${businessInfo.state}`

  // Generate keywords
  const keywords = [
    businessInfo.name,
    typeName,
    ...businessInfo.services.slice(0, 5),
    locationStr,
    businessInfo.city,
    `${typeName} in ${businessInfo.city}`,
    `${typeName} near me`,
    `best ${typeName.toLowerCase()} ${businessInfo.city}`,
  ].filter(Boolean)

  return {
    title: `${businessInfo.name} | ${typeName} in ${locationStr}`,
    description: generateMetaDescription(businessInfo),
    keywords,
    ogType: 'business.business',
    twitterCard: 'summary_large_image',
    canonicalUrl: websiteUrl,
    localBusinessSchema: generateLocalBusinessSchema(businessInfo, websiteUrl),
  }
}

// Generate meta description
export function generateMetaDescription(businessInfo: BusinessInfo): string {
  const typeName = getBusinessTypeName(businessInfo.businessType)
  const services = businessInfo.services.slice(0, 3).join(', ')
  const yearsStr = businessInfo.yearsInBusiness > 0
    ? `With ${businessInfo.yearsInBusiness} years of experience, `
    : ''

  if (services) {
    return `${yearsStr}${businessInfo.name} offers professional ${services} services in ${businessInfo.city}, ${businessInfo.state}. Contact us today for quality ${typeName.toLowerCase()} services.`
  }

  return `${yearsStr}${businessInfo.name} is a trusted ${typeName.toLowerCase()} serving ${businessInfo.city}, ${businessInfo.state}. Contact us for professional service and exceptional results.`
}

// Generate page title for different pages
export function generatePageTitle(businessInfo: BusinessInfo, page: string): string {
  const locationStr = `${businessInfo.city}, ${businessInfo.state}`

  switch (page) {
    case 'home':
      return `${businessInfo.name} | ${getBusinessTypeName(businessInfo.businessType)} in ${locationStr}`
    case 'about':
      return `About Us | ${businessInfo.name} - ${locationStr}`
    case 'services':
      return `Our Services | ${businessInfo.name} - ${locationStr}`
    case 'portfolio':
      return `Our Work | ${businessInfo.name} - ${locationStr}`
    case 'contact':
      return `Contact Us | ${businessInfo.name} - ${locationStr}`
    default:
      return `${businessInfo.name} | ${locationStr}`
  }
}

// Generate Open Graph tags
export function generateOpenGraphTags(
  businessInfo: BusinessInfo,
  websiteUrl: string,
  pageTitle: string,
  pageDescription?: string
): Record<string, string> {
  return {
    'og:type': 'business.business',
    'og:title': pageTitle,
    'og:description': pageDescription || generateMetaDescription(businessInfo),
    'og:url': websiteUrl,
    'og:site_name': businessInfo.name,
    'business:contact_data:street_address': businessInfo.address,
    'business:contact_data:locality': businessInfo.city,
    'business:contact_data:region': businessInfo.state,
    'business:contact_data:postal_code': businessInfo.zipCode,
    'business:contact_data:country_name': 'United States',
    'business:contact_data:email': businessInfo.email,
    'business:contact_data:phone_number': businessInfo.phone,
  }
}

// Generate Twitter Card tags
export function generateTwitterCardTags(
  businessInfo: BusinessInfo,
  pageTitle: string,
  pageDescription?: string
): Record<string, string> {
  return {
    'twitter:card': 'summary_large_image',
    'twitter:title': pageTitle,
    'twitter:description': pageDescription || generateMetaDescription(businessInfo),
  }
}

// Generate robots.txt content
export function generateRobotsTxt(websiteUrl: string): string {
  return `User-agent: *
Allow: /

Sitemap: ${websiteUrl}/sitemap.xml`
}

// Generate sitemap.xml content
export function generateSitemapXml(websiteUrl: string, pages: string[]): string {
  const urls = pages.map(page => {
    const priority = page === '/' ? '1.0' : page === '/services' ? '0.9' : '0.8'
    const changefreq = page === '/' ? 'weekly' : 'monthly'

    return `  <url>
    <loc>${websiteUrl}${page}</loc>
    <lastmod>${new Date().toISOString().split('T')[0]}</lastmod>
    <changefreq>${changefreq}</changefreq>
    <priority>${priority}</priority>
  </url>`
  }).join('\n')

  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls}
</urlset>`
}
