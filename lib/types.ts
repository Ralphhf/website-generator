// Business Profile Types
export interface BusinessProfile {
  placeId: string;
  name: string;
  address: string;
  city: string;
  state: string;
  zipCode: string;
  phone?: string;
  website?: string;
  types: string[];
  rating?: number;
  reviewCount?: number;
  photos?: string[];
  location: {
    lat: number;
    lng: number;
  };
  openingHours?: OpeningHours;
}

export interface OpeningHours {
  monday?: string;
  tuesday?: string;
  wednesday?: string;
  thursday?: string;
  friday?: string;
  saturday?: string;
  sunday?: string;
}

// Business Information Form Types
export interface BusinessInfo {
  // Basic Information
  name: string;
  tagline?: string;
  description: string;
  yearsInBusiness: number;

  // Contact Information
  email: string;
  phone: string;
  address: string;
  city: string;
  state: string;
  zipCode: string;

  // Online Presence
  googleProfileUrl?: string;
  facebookUrl?: string;
  instagramUrl?: string;
  linkedinUrl?: string;
  yelpUrl?: string;
  tiktokUrl?: string;
  youtubeUrl?: string;

  // Business Details
  businessType: string;
  services: string[];
  serviceAreas: string[];

  // Branding
  logo?: string;
  primaryColor?: string;
  secondaryColor?: string;
  heroImage?: string;
  branding?: BrandingConfig;

  // Hours
  openingHours: OpeningHours;

  // Testimonials
  testimonials: Testimonial[];

  // Portfolio/Work Sections
  portfolioSections: PortfolioSection[];

  // Pricing (Optional)
  pricing?: PricingPackage[];

  // FAQs (Optional)
  faqs?: FAQ[];

  // Primary Call-to-Action
  primaryCTA?: PrimaryCTAType;

  // CTA-specific fields
  calendlyUrl?: string; // For "book" CTA
  products?: Product[]; // For "shop" CTA

  // Industry-specific configurations
  menu?: MenuConfig; // For restaurants
  booking?: BookingConfig; // For service businesses
  medical?: MedicalConfig; // For healthcare
}

// Product Types (for Shop Now CTA)
export interface Product {
  id: string;
  name: string;
  price: string;
  description?: string;
  image?: string;
}

// Pricing Package Types
export interface PricingPackage {
  id: string;
  name: string;
  price: string; // e.g., "$99", "$99/mo", "From $500", "Custom"
  description?: string;
  features: string[];
  isPopular?: boolean;
}

// FAQ Types
export interface FAQ {
  id: string;
  question: string;
  answer: string;
}

// Primary CTA Types
export type PrimaryCTAType = 'call' | 'book' | 'quote' | 'visit' | 'shop' | 'contact';

// Branding Types
export type ColorScheme = 'blue' | 'green' | 'purple' | 'red' | 'orange' | 'teal' | 'slate' | 'custom';

export type FontStyle = 'modern' | 'classic' | 'elegant' | 'bold';

export type BrandTone = 'professional' | 'friendly' | 'luxury' | 'playful';

export interface BrandingConfig {
  colorScheme: ColorScheme;
  customPrimaryColor?: string; // Only used when colorScheme is 'custom'
  customSecondaryColor?: string;
  fontStyle: FontStyle;
  brandTone: BrandTone;
}

// Color scheme definitions
export const COLOR_SCHEMES: Record<Exclude<ColorScheme, 'custom'>, { primary: string; secondary: string; name: string }> = {
  blue: { primary: '#3b82f6', secondary: '#1e40af', name: 'Ocean Blue' },
  green: { primary: '#22c55e', secondary: '#15803d', name: 'Forest Green' },
  purple: { primary: '#8b5cf6', secondary: '#6d28d9', name: 'Royal Purple' },
  red: { primary: '#ef4444', secondary: '#b91c1c', name: 'Crimson Red' },
  orange: { primary: '#f97316', secondary: '#c2410c', name: 'Sunset Orange' },
  teal: { primary: '#14b8a6', secondary: '#0f766e', name: 'Teal' },
  slate: { primary: '#64748b', secondary: '#334155', name: 'Slate Gray' },
};

export const FONT_STYLES: Record<FontStyle, { heading: string; body: string; name: string; description: string }> = {
  modern: { heading: 'Inter', body: 'Inter', name: 'Modern', description: 'Clean and contemporary' },
  classic: { heading: 'Merriweather', body: 'Source Sans 3', name: 'Classic', description: 'Timeless and traditional' },
  elegant: { heading: 'Playfair Display', body: 'Lato', name: 'Elegant', description: 'Sophisticated and refined' },
  bold: { heading: 'Montserrat', body: 'Open Sans', name: 'Bold', description: 'Strong and impactful' },
};

export const BRAND_TONES: Record<BrandTone, { name: string; description: string; keywords: string[] }> = {
  professional: { name: 'Professional', description: 'Trustworthy, reliable, expert', keywords: ['trusted', 'expert', 'reliable', 'quality', 'proven'] },
  friendly: { name: 'Friendly', description: 'Approachable, warm, helpful', keywords: ['friendly', 'caring', 'helpful', 'welcoming', 'personal'] },
  luxury: { name: 'Luxury', description: 'Premium, exclusive, high-end', keywords: ['premium', 'exclusive', 'bespoke', 'exceptional', 'distinguished'] },
  playful: { name: 'Playful', description: 'Fun, energetic, creative', keywords: ['fun', 'creative', 'exciting', 'vibrant', 'fresh'] },
};

export interface Testimonial {
  id: string;
  author: string;
  role?: string;
  company?: string;
  content: string;
  rating: number;
  image?: string;
}

export interface PortfolioSection {
  id: string;
  title: string;
  description?: string;
  images: PortfolioImage[];
}

export interface PortfolioImage {
  id: string;
  url: string;
  alt: string;
  caption?: string;
}

// Generated Website Types
export interface GeneratedWebsite {
  id: string;
  businessInfo: BusinessInfo;
  template: WebsiteTemplate;
  pages: GeneratedPage[];
  seoConfig: SEOConfig;
  createdAt: Date;
  status: 'generating' | 'ready' | 'deployed';
  deploymentUrl?: string;
  githubRepoUrl?: string;
}

export interface WebsiteTemplate {
  id: string;
  name: string;
  description: string;
  thumbnail: string;
  style: 'modern' | 'classic' | 'minimal' | 'bold' | 'elegant';
  colorScheme: 'light' | 'dark' | 'gradient';
}

export interface GeneratedPage {
  slug: string;
  title: string;
  content: string;
  components: PageComponent[];
}

export interface PageComponent {
  type: ComponentType;
  props: Record<string, unknown>;
  order: number;
}

export type ComponentType =
  | 'hero'
  | 'about'
  | 'services'
  | 'portfolio'
  | 'testimonials'
  | 'contact'
  | 'cta'
  | 'features'
  | 'team'
  | 'faq'
  | 'pricing'
  | 'stats'
  | 'gallery'
  | 'map'
  | 'footer';

// SEO Types
export interface SEOConfig {
  title: string;
  description: string;
  keywords: string[];
  ogImage?: string;
  ogType: string;
  twitterCard: 'summary' | 'summary_large_image';
  canonicalUrl?: string;
  localBusinessSchema: LocalBusinessSchema;
}

export interface LocalBusinessSchema {
  '@type': string;
  name: string;
  description: string;
  url: string;
  telephone: string;
  email: string;
  address: {
    '@type': 'PostalAddress';
    streetAddress: string;
    addressLocality: string;
    addressRegion: string;
    postalCode: string;
    addressCountry: string;
  };
  geo?: {
    '@type': 'GeoCoordinates';
    latitude: number;
    longitude: number;
  };
  openingHoursSpecification?: OpeningHoursSpec[];
  sameAs?: string[];
  image?: string;
  priceRange?: string;
  aggregateRating?: {
    '@type': 'AggregateRating';
    ratingValue: number;
    reviewCount: number;
  };
}

export interface OpeningHoursSpec {
  '@type': 'OpeningHoursSpecification';
  dayOfWeek: string[];
  opens: string;
  closes: string;
}

// API Response Types
export interface SearchBusinessesResponse {
  businesses: BusinessProfile[];
  nextPageToken?: string;
  total: number;
}

export interface GenerateWebsiteResponse {
  success: boolean;
  websiteId?: string;
  previewUrl?: string;
  error?: string;
}

export interface DeployWebsiteResponse {
  success: boolean;
  deploymentUrl?: string;
  githubRepoUrl?: string;
  error?: string;
}

// Form Step Types
export type FormStep =
  | 'search'
  | 'select-business'
  | 'basic-info'
  | 'branding'
  | 'hero-image'
  | 'contact-info'
  | 'testimonials'
  | 'portfolio'
  | 'pricing'
  | 'faqs'
  | 'products'
  | 'menu'
  | 'booking'
  | 'medical-info'
  | 'preview'
  | 'generating'
  | 'complete'
  | 'logo-generator'
  | 'google-business'
  | 'social-media'
  | 'update-profiles'
  | 'all-done';

// ============================================
// INDUSTRY-SPECIFIC MODULE TYPES
// ============================================

// Restaurant Menu Types
export type DietaryOption = 'vegetarian' | 'vegan' | 'gluten-free' | 'dairy-free' | 'nut-free' | 'spicy';

export interface MenuItem {
  id: string;
  name: string;
  description?: string;
  price: string;
  image?: string;
  dietary?: DietaryOption[];
  isPopular?: boolean;
}

export interface MenuCategory {
  id: string;
  name: string;
  description?: string;
  items: MenuItem[];
}

export interface MenuConfig {
  categories: MenuCategory[];
  menuPdfUrl?: string; // Optional PDF menu upload
  showPrices: boolean;
  currency: string;
  note?: string; // e.g., "Prices subject to change"
}

// Booking/Appointment Types
export interface BookingConfig {
  enabled: boolean;
  provider: 'calendly' | 'acuity' | 'square' | 'custom' | 'none';
  bookingUrl?: string; // External booking URL
  showAvailability: boolean;
  services?: BookableService[];
  acceptWalkins: boolean;
  requireDeposit: boolean;
  depositAmount?: string;
  cancellationPolicy?: string;
}

export interface BookableService {
  id: string;
  name: string;
  duration: string; // e.g., "30 min", "1 hour"
  price: string;
  description?: string;
}

// Medical/Healthcare Types
export interface MedicalConfig {
  acceptingNewPatients: boolean;
  insuranceAccepted: string[];
  specialties?: string[];
  credentials?: string[]; // e.g., "MD", "DO", "DDS", "RN"
  hospitalAffiliations?: string[];
  languages?: string[];
  telehealth: boolean;
  patientPortalUrl?: string;
  hipaaNotice: boolean;
  emergencyNotice?: string; // e.g., "For emergencies, call 911"
}

// Industry Module Type Detection
export type IndustryModule = 'restaurant' | 'booking' | 'medical' | 'ecommerce';

// Keywords that trigger each module
export const INDUSTRY_MODULE_KEYWORDS: Record<IndustryModule, string[]> = {
  restaurant: [
    'restaurant', 'cafe', 'coffee', 'bakery', 'pizzeria', 'pizza', 'bar', 'grill',
    'bistro', 'diner', 'eatery', 'food', 'catering', 'kitchen', 'steakhouse',
    'sushi', 'mexican', 'italian', 'chinese', 'thai', 'indian', 'deli', 'sandwich',
    'burger', 'taco', 'bbq', 'barbecue', 'seafood', 'brewery', 'winery', 'pub'
  ],
  booking: [
    'salon', 'spa', 'barber', 'hair', 'nail', 'beauty', 'massage', 'therapy',
    'fitness', 'gym', 'yoga', 'pilates', 'personal trainer', 'consultant',
    'photography', 'photographer', 'studio', 'tattoo', 'piercing', 'coaching',
    'tutor', 'tutoring', 'lesson', 'class', 'workshop', 'tour', 'travel'
  ],
  medical: [
    'doctor', 'physician', 'dentist', 'dental', 'medical', 'clinic', 'health',
    'chiropractor', 'chiropractic', 'therapy', 'therapist', 'counseling',
    'psychiatry', 'psychology', 'dermatology', 'pediatric', 'optometry',
    'veterinary', 'vet', 'animal hospital', 'pharmacy', 'urgent care',
    'physical therapy', 'occupational therapy', 'orthodontist', 'oral surgery'
  ],
  ecommerce: [
    'shop', 'store', 'retail', 'boutique', 'market', 'online store', 'ecommerce',
    'jewelry', 'clothing', 'apparel', 'fashion', 'furniture', 'electronics'
  ]
};

// Helper function to detect applicable industry modules
export function detectIndustryModules(businessType: string): IndustryModule[] {
  const normalizedType = businessType.toLowerCase();
  const modules: IndustryModule[] = [];

  for (const [module, keywords] of Object.entries(INDUSTRY_MODULE_KEYWORDS)) {
    if (keywords.some(keyword => normalizedType.includes(keyword))) {
      modules.push(module as IndustryModule);
    }
  }

  return modules;
}

// Common insurance providers
export const COMMON_INSURANCE_PROVIDERS = [
  'Aetna', 'Blue Cross Blue Shield', 'Cigna', 'UnitedHealthcare', 'Humana',
  'Kaiser Permanente', 'Medicare', 'Medicaid', 'Anthem', 'MetLife',
  'Delta Dental', 'Guardian', 'Principal', 'Self-Pay', 'Workers Compensation'
];

// Common medical credentials
export const MEDICAL_CREDENTIALS = [
  'MD', 'DO', 'DDS', 'DMD', 'DC', 'DPT', 'OD', 'DPM', 'PharmD',
  'NP', 'PA', 'RN', 'LPN', 'LCSW', 'PhD', 'PsyD', 'LMFT', 'Board Certified'
];

// Booking providers
export const BOOKING_PROVIDERS = [
  { id: 'calendly', name: 'Calendly', placeholder: 'https://calendly.com/your-link' },
  { id: 'acuity', name: 'Acuity Scheduling', placeholder: 'https://acuityscheduling.com/your-link' },
  { id: 'square', name: 'Square Appointments', placeholder: 'https://squareup.com/appointments/your-link' },
  { id: 'custom', name: 'Custom URL', placeholder: 'https://your-booking-page.com' },
  { id: 'none', name: 'No Online Booking', placeholder: '' }
] as const;
