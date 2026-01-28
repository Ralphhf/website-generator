// AI Content Generation using Claude API
import { BusinessInfo, Testimonial, PricingPackage, FAQ, BrandTone, BRAND_TONES, PrimaryCTAType } from './types'

// Get tone instruction for AI prompts
function getToneInstruction(brandTone?: BrandTone): string {
  if (!brandTone) return ''

  const tone = BRAND_TONES[brandTone]
  if (!tone) return ''

  return `

IMPORTANT - Brand Voice: Write in a ${tone.name.toLowerCase()} tone that is ${tone.description.toLowerCase()}. Use words like: ${tone.keywords.join(', ')}.`
}

// CTA-specific language and urgency instructions
const CTA_INSTRUCTIONS: Record<PrimaryCTAType, { style: string; phrases: string[]; urgency: string }> = {
  call: {
    style: 'urgent and action-oriented',
    phrases: ['call today', 'speak directly', 'immediate assistance', 'don\'t wait', 'talk to an expert'],
    urgency: 'Create a sense of urgency. Emphasize immediate availability and direct personal contact.',
  },
  book: {
    style: 'convenient and accommodating',
    phrases: ['easy scheduling', 'book online', 'reserve your spot', 'at your convenience', 'flexible appointments'],
    urgency: 'Emphasize convenience and ease of scheduling. Highlight flexibility and availability.',
  },
  quote: {
    style: 'consultative and no-pressure',
    phrases: ['free estimate', 'no obligation', 'custom solutions', 'personalized quote', 'transparent pricing'],
    urgency: 'Be consultative. Emphasize free, no-obligation estimates and customized solutions.',
  },
  visit: {
    style: 'inviting and experience-focused',
    phrases: ['come see us', 'visit our location', 'experience firsthand', 'stop by', 'see for yourself'],
    urgency: 'Create an inviting atmosphere. Emphasize the in-person experience and welcoming environment.',
  },
  shop: {
    style: 'product-focused and enticing',
    phrases: ['browse our collection', 'shop now', 'discover', 'explore our products', 'find the perfect'],
    urgency: 'Focus on products and selection. Create desire and highlight quality/variety.',
  },
  contact: {
    style: 'professional and approachable',
    phrases: ['get in touch', 'reach out', 'we\'re here to help', 'contact us', 'let\'s connect'],
    urgency: 'Be professional yet approachable. Emphasize helpfulness and responsiveness.',
  },
}

function getCTAInstruction(primaryCTA?: PrimaryCTAType): string {
  if (!primaryCTA) return ''

  const cta = CTA_INSTRUCTIONS[primaryCTA]
  if (!cta) return ''

  return `

CTA Style: Write in a ${cta.style} manner. Use phrases like: "${cta.phrases.join('", "')}". ${cta.urgency}`
}

// Industry-specific vocabulary and context
const INDUSTRY_VOCABULARY: Record<string, { terms: string[]; context: string; reviewerTypes: string[] }> = {
  // Home Services
  plumber: {
    terms: ['licensed', 'insured', 'emergency service', '24/7', 'leak repair', 'drain cleaning', 'water heater'],
    context: 'Home plumbing services requiring trust, reliability, and quick response times.',
    reviewerTypes: ['Homeowner', 'Property Manager', 'Business Owner', 'Landlord'],
  },
  electrician: {
    terms: ['licensed', 'certified', 'code compliant', 'safety', 'rewiring', 'panel upgrade', 'troubleshooting'],
    context: 'Electrical services where safety, licensing, and expertise are paramount.',
    reviewerTypes: ['Homeowner', 'Contractor', 'Business Owner', 'Property Manager'],
  },
  hvac: {
    terms: ['energy efficient', 'maintenance', 'installation', 'repair', 'heating', 'cooling', 'air quality'],
    context: 'Climate control services focused on comfort, efficiency, and reliability.',
    reviewerTypes: ['Homeowner', 'Facility Manager', 'Business Owner', 'Property Manager'],
  },
  contractor: {
    terms: ['licensed', 'bonded', 'insured', 'renovation', 'remodel', 'construction', 'craftsmanship'],
    context: 'General contracting with emphasis on quality work and project management.',
    reviewerTypes: ['Homeowner', 'Real Estate Agent', 'Property Developer', 'Business Owner'],
  },
  landscaping: {
    terms: ['design', 'maintenance', 'hardscape', 'irrigation', 'lawn care', 'outdoor living', 'curb appeal'],
    context: 'Outdoor beautification services focused on aesthetics and property value.',
    reviewerTypes: ['Homeowner', 'Property Manager', 'HOA Board Member', 'Business Owner'],
  },
  cleaning: {
    terms: ['deep clean', 'sanitize', 'eco-friendly', 'thorough', 'reliable', 'bonded', 'detailed'],
    context: 'Cleaning services emphasizing thoroughness, trust, and attention to detail.',
    reviewerTypes: ['Homeowner', 'Office Manager', 'Property Manager', 'Business Owner'],
  },
  roofing: {
    terms: ['inspection', 'repair', 'replacement', 'warranty', 'storm damage', 'leak-free', 'durable'],
    context: 'Roofing services focused on protection, durability, and weather resistance.',
    reviewerTypes: ['Homeowner', 'Property Manager', 'Insurance Adjuster', 'Real Estate Agent'],
  },

  // Professional Services
  lawyer: {
    terms: ['experienced', 'confidential', 'representation', 'consultation', 'advocate', 'justice', 'rights'],
    context: 'Legal services requiring trust, expertise, and professional representation.',
    reviewerTypes: ['Client', 'Business Owner', 'Individual', 'Family'],
  },
  accountant: {
    terms: ['CPA', 'tax planning', 'bookkeeping', 'audit', 'compliance', 'financial', 'accurate'],
    context: 'Financial services focused on accuracy, compliance, and strategic planning.',
    reviewerTypes: ['Business Owner', 'Entrepreneur', 'Individual', 'Corporation'],
  },
  consultant: {
    terms: ['strategy', 'expertise', 'solutions', 'optimization', 'growth', 'analysis', 'implementation'],
    context: 'Advisory services focused on expertise, results, and strategic value.',
    reviewerTypes: ['CEO', 'Business Owner', 'Director', 'Manager'],
  },
  real_estate: {
    terms: ['listings', 'buyers', 'sellers', 'market expertise', 'negotiation', 'closing', 'investment'],
    context: 'Real estate services focused on market knowledge and successful transactions.',
    reviewerTypes: ['Home Buyer', 'Home Seller', 'Investor', 'First-time Buyer'],
  },

  // Health & Wellness
  dentist: {
    terms: ['gentle', 'modern', 'comfortable', 'preventive', 'cosmetic', 'family', 'pain-free'],
    context: 'Dental care emphasizing comfort, modern techniques, and patient care.',
    reviewerTypes: ['Patient', 'Parent', 'Family', 'Individual'],
  },
  doctor: {
    terms: ['compassionate', 'experienced', 'thorough', 'preventive', 'personalized', 'board-certified'],
    context: 'Medical care focused on patient wellbeing and comprehensive treatment.',
    reviewerTypes: ['Patient', 'Family Member', 'Caregiver', 'Individual'],
  },
  chiropractor: {
    terms: ['alignment', 'wellness', 'pain relief', 'natural', 'holistic', 'adjustment', 'mobility'],
    context: 'Chiropractic care focused on natural healing and pain management.',
    reviewerTypes: ['Patient', 'Athlete', 'Office Worker', 'Individual'],
  },
  salon: {
    terms: ['styling', 'color', 'treatments', 'relaxing', 'skilled', 'trendy', 'personalized'],
    context: 'Beauty services focused on personal care and style transformation.',
    reviewerTypes: ['Client', 'Regular Customer', 'Bride', 'Professional'],
  },
  spa: {
    terms: ['relaxation', 'rejuvenation', 'wellness', 'therapeutic', 'pampering', 'escape', 'tranquil'],
    context: 'Spa services focused on relaxation, self-care, and wellness.',
    reviewerTypes: ['Guest', 'Client', 'Member', 'Couple'],
  },
  gym: {
    terms: ['fitness', 'training', 'results', 'motivation', 'equipment', 'classes', 'community'],
    context: 'Fitness services focused on results, motivation, and supportive environment.',
    reviewerTypes: ['Member', 'Athlete', 'Fitness Enthusiast', 'Beginner'],
  },

  // Food & Hospitality
  restaurant: {
    terms: ['fresh', 'delicious', 'atmosphere', 'service', 'chef', 'menu', 'dining experience'],
    context: 'Restaurant services focused on food quality and dining experience.',
    reviewerTypes: ['Diner', 'Food Enthusiast', 'Local Resident', 'Couple'],
  },
  cafe: {
    terms: ['cozy', 'artisan', 'freshly brewed', 'pastries', 'atmosphere', 'local', 'community'],
    context: 'Cafe services focused on quality beverages and welcoming atmosphere.',
    reviewerTypes: ['Regular', 'Coffee Lover', 'Remote Worker', 'Student'],
  },
  bakery: {
    terms: ['fresh-baked', 'artisan', 'handcrafted', 'delicious', 'custom', 'traditional', 'quality ingredients'],
    context: 'Bakery services focused on fresh, quality baked goods.',
    reviewerTypes: ['Customer', 'Event Planner', 'Local Resident', 'Food Lover'],
  },
  catering: {
    terms: ['events', 'customized', 'professional', 'delicious', 'presentation', 'reliable', 'memorable'],
    context: 'Catering services focused on event success and memorable experiences.',
    reviewerTypes: ['Event Host', 'Wedding Planner', 'Corporate Client', 'Party Organizer'],
  },

  // Retail & E-commerce
  retail: {
    terms: ['selection', 'quality', 'value', 'customer service', 'brands', 'shopping experience'],
    context: 'Retail services focused on product selection and customer experience.',
    reviewerTypes: ['Shopper', 'Customer', 'Regular', 'Gift Buyer'],
  },
  boutique: {
    terms: ['curated', 'unique', 'exclusive', 'style', 'personalized', 'fashion', 'distinctive'],
    context: 'Boutique services focused on unique finds and personal style.',
    reviewerTypes: ['Fashion Lover', 'Customer', 'Style Enthusiast', 'Shopper'],
  },

  // Automotive
  auto_repair: {
    terms: ['certified', 'honest', 'diagnostic', 'maintenance', 'repair', 'warranty', 'reliable'],
    context: 'Auto repair services focused on trust, expertise, and fair pricing.',
    reviewerTypes: ['Vehicle Owner', 'Customer', 'Fleet Manager', 'Car Enthusiast'],
  },
  car_dealer: {
    terms: ['inventory', 'financing', 'trade-in', 'certified pre-owned', 'warranty', 'test drive'],
    context: 'Car sales focused on selection, value, and customer satisfaction.',
    reviewerTypes: ['Buyer', 'Customer', 'First-time Buyer', 'Returning Customer'],
  },

  // Education & Childcare
  school: {
    terms: ['education', 'curriculum', 'teachers', 'development', 'learning', 'enrichment', 'growth'],
    context: 'Educational services focused on student development and academic excellence.',
    reviewerTypes: ['Parent', 'Student', 'Alumni', 'Family'],
  },
  daycare: {
    terms: ['nurturing', 'safe', 'educational', 'caring', 'development', 'activities', 'trusted'],
    context: 'Childcare services focused on safety, development, and peace of mind.',
    reviewerTypes: ['Parent', 'Working Mom', 'Working Dad', 'Guardian'],
  },
  tutoring: {
    terms: ['personalized', 'results', 'improvement', 'confidence', 'expert', 'one-on-one', 'academic'],
    context: 'Tutoring services focused on academic improvement and student confidence.',
    reviewerTypes: ['Parent', 'Student', 'High Schooler', 'College Student'],
  },

  // Technology
  it_services: {
    terms: ['support', 'solutions', 'security', 'network', 'cloud', 'managed', 'responsive'],
    context: 'IT services focused on reliability, security, and technical expertise.',
    reviewerTypes: ['Business Owner', 'IT Manager', 'Office Manager', 'Startup Founder'],
  },
  web_design: {
    terms: ['creative', 'responsive', 'modern', 'user-friendly', 'custom', 'SEO', 'conversion'],
    context: 'Web services focused on design quality and business results.',
    reviewerTypes: ['Business Owner', 'Marketing Manager', 'Entrepreneur', 'Startup'],
  },
}

function getIndustryInstruction(businessType?: string): string {
  if (!businessType) return ''

  // Normalize business type to match our keys
  const normalizedType = businessType.toLowerCase().replace(/[^a-z]/g, '_').replace(/_+/g, '_')

  // Try exact match first, then partial match
  let industry = INDUSTRY_VOCABULARY[normalizedType]

  if (!industry) {
    // Try to find a partial match
    const keys = Object.keys(INDUSTRY_VOCABULARY)
    const matchedKey = keys.find(key =>
      normalizedType.includes(key) || key.includes(normalizedType)
    )
    if (matchedKey) {
      industry = INDUSTRY_VOCABULARY[matchedKey]
    }
  }

  if (!industry) return ''

  return `

Industry Context: ${industry.context} Use relevant terms like: ${industry.terms.slice(0, 5).join(', ')}.`
}

function getIndustryReviewerTypes(businessType?: string): string[] {
  if (!businessType) return ['Customer', 'Client', 'Homeowner', 'Business Owner']

  const normalizedType = businessType.toLowerCase().replace(/[^a-z]/g, '_').replace(/_+/g, '_')

  let industry = INDUSTRY_VOCABULARY[normalizedType]

  if (!industry) {
    const keys = Object.keys(INDUSTRY_VOCABULARY)
    const matchedKey = keys.find(key =>
      normalizedType.includes(key) || key.includes(normalizedType)
    )
    if (matchedKey) {
      industry = INDUSTRY_VOCABULARY[matchedKey]
    }
  }

  return industry?.reviewerTypes || ['Customer', 'Client', 'Homeowner', 'Business Owner']
}

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

export async function generateTagline(
  businessName: string,
  businessType: string,
  services: string[],
  brandTone?: BrandTone,
  primaryCTA?: PrimaryCTAType
): Promise<string> {
  const toneInstruction = getToneInstruction(brandTone)
  const ctaInstruction = getCTAInstruction(primaryCTA)
  const industryInstruction = getIndustryInstruction(businessType)

  const prompt = `Generate a short, catchy tagline for a ${businessType} business called "${businessName}".
${services.length > 0 ? `They offer these services: ${services.join(', ')}.` : ''}

The tagline should be:
- Maximum 8 words
- Professional yet memorable
- Highlight their expertise or value proposition${toneInstruction}${ctaInstruction}${industryInstruction}

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
  state: string,
  brandTone?: BrandTone,
  primaryCTA?: PrimaryCTAType
): Promise<string> {
  const location = city && state ? `${city}, ${state}` : ''
  const toneInstruction = getToneInstruction(brandTone)
  const ctaInstruction = getCTAInstruction(primaryCTA)
  const industryInstruction = getIndustryInstruction(businessType)

  const prompt = `Write a compelling business description for "${businessName}", a ${businessType} business${location ? ` located in ${location}` : ''}.

${services.length > 0 ? `Services offered: ${services.join(', ')}.` : ''}
${yearsInBusiness > 0 ? `They have ${yearsInBusiness} years of experience in the industry.` : ''}

The description should:
- Be 2-3 paragraphs (about 150-200 words total)
- Highlight their expertise and professionalism
- Mention their commitment to customer satisfaction
- Include a call to action
- Be SEO-friendly with natural keyword placement
- Sound authentic and trustworthy${toneInstruction}${ctaInstruction}${industryInstruction}

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
  existingServices: string[],
  businessName?: string
): Promise<string[]> {
  // Use businessType if available, otherwise infer from business name
  const businessContext = businessType
    ? `a ${businessType} business`
    : businessName
      ? `a business called "${businessName}"`
      : 'a business'

  const prompt = `Generate a list of 6-8 common services offered by ${businessContext}.

${businessName && !businessType ? `Based on the business name, determine what type of business this is and suggest relevant services.` : ''}
${existingServices.length > 0 ? `They already have these services: ${existingServices.join(', ')}. Add complementary services.` : ''}

Return ONLY a comma-separated list of service names, nothing else. Each service should be 2-4 words maximum.`

  const result = await callClaude([{ role: 'user', content: prompt }], 200)
  return result.split(',').map(s => s.trim()).filter(Boolean)
}

export async function generateTestimonials(
  businessName: string,
  businessType: string,
  services: string[],
  count: number = 3,
  brandTone?: BrandTone,
  primaryCTA?: PrimaryCTAType
): Promise<Omit<Testimonial, 'id'>[]> {
  const toneInstruction = getToneInstruction(brandTone)
  const industryInstruction = getIndustryInstruction(businessType)
  const reviewerTypes = getIndustryReviewerTypes(businessType)

  const prompt = `Generate ${count} realistic customer testimonials for "${businessName}", a ${businessType} business.

${services.length > 0 ? `Services they offer: ${services.join(', ')}.` : ''}

For each testimonial, create:
- A realistic customer name (first and last name)
- Their role should be one of these types appropriate for this industry: ${reviewerTypes.join(', ')}
- Their location (city, state abbreviation like "Austin, TX")
- A detailed, authentic-sounding review (40-60 words) that mentions specific positive experiences
- A rating (mostly 5 stars, occasionally 4)${toneInstruction}${industryInstruction}

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

export async function generatePricing(
  businessName: string,
  businessType: string,
  services: string[],
  brandTone?: BrandTone,
  primaryCTA?: PrimaryCTAType
): Promise<Omit<PricingPackage, 'id'>[]> {
  const toneInstruction = getToneInstruction(brandTone)
  const ctaInstruction = getCTAInstruction(primaryCTA)
  const industryInstruction = getIndustryInstruction(businessType)

  const prompt = `Generate 3 pricing packages/tiers for "${businessName}", a ${businessType} business.

${services.length > 0 ? `Services they offer: ${services.join(', ')}.` : ''}

Create realistic pricing tiers that would be appropriate for this type of business. Consider:
- Local market rates
- Typical pricing structures for ${businessType} businesses
- Common package names (Basic/Standard/Premium, Bronze/Silver/Gold, etc.)${toneInstruction}${ctaInstruction}${industryInstruction}

Return as a JSON array with this format:
[
  {
    "name": "Package Name",
    "price": "$XX" or "$XX/mo" or "From $XX" or "Custom",
    "description": "Brief description of who this package is for",
    "features": ["Feature 1", "Feature 2", "Feature 3", "Feature 4"],
    "isPopular": false
  }
]

Mark the middle tier as "isPopular": true.
Return ONLY the JSON array, no other text.`

  const result = await callClaude([{ role: 'user', content: prompt }], 800)

  try {
    const jsonMatch = result.match(/\[[\s\S]*\]/)
    if (jsonMatch) {
      return JSON.parse(jsonMatch[0])
    }
  } catch (e) {
    console.error('Failed to parse pricing:', e)
  }

  return []
}

export async function generateFAQs(
  businessName: string,
  businessType: string,
  services: string[],
  brandTone?: BrandTone,
  primaryCTA?: PrimaryCTAType
): Promise<Omit<FAQ, 'id'>[]> {
  const toneInstruction = getToneInstruction(brandTone)
  const ctaInstruction = getCTAInstruction(primaryCTA)
  const industryInstruction = getIndustryInstruction(businessType)

  const prompt = `Generate 5-6 frequently asked questions (FAQs) for "${businessName}", a ${businessType} business.

${services.length > 0 ? `Services they offer: ${services.join(', ')}.` : ''}

Create questions that potential customers typically ask about this type of business. Include questions about:
- Services and pricing
- Availability and scheduling
- Experience and qualifications
- Service areas
- Guarantees or warranties${toneInstruction}${ctaInstruction}${industryInstruction}

Return as a JSON array with this format:
[
  {
    "question": "The question?",
    "answer": "A helpful, informative answer (2-3 sentences)"
  }
]

Return ONLY the JSON array, no other text.`

  const result = await callClaude([{ role: 'user', content: prompt }], 1000)

  try {
    const jsonMatch = result.match(/\[[\s\S]*\]/)
    if (jsonMatch) {
      return JSON.parse(jsonMatch[0])
    }
  } catch (e) {
    console.error('Failed to parse FAQs:', e)
  }

  return []
}
