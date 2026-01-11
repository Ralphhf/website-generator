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

  // Business Details
  businessType: string;
  services: string[];
  serviceAreas: string[];

  // Branding
  logo?: string;
  primaryColor?: string;
  secondaryColor?: string;
  heroImage?: string;

  // Hours
  openingHours: OpeningHours;

  // Testimonials
  testimonials: Testimonial[];

  // Portfolio/Work Sections
  portfolioSections: PortfolioSection[];
}

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
  | 'hero-image'
  | 'contact-info'
  | 'testimonials'
  | 'portfolio'
  | 'preview'
  | 'generating'
  | 'complete'
  | 'logo-generator'
  | 'google-business'
  | 'social-media'
  | 'update-profiles'
  | 'all-done';
