// Website Design Guidelines - CLASSIC/PROFESSIONAL Style
// Alternative prompt for traditional, trustworthy business websites
// Best for: Law firms, medical, accounting, real estate, insurance, established businesses

export const WEBSITE_DESIGN_PROMPT_CLASSIC = `
====================================
WEBSITE GENERATION REQUIREMENTS
====================================

These websites are for LOCAL businesses that exist on Google.
They will be SOLD to real businesses, so **quality, performance, and SEO are critical**.

This is the CLASSIC/PROFESSIONAL style - designed for businesses that want
to look established, trustworthy, and reliable rather than trendy.

Every generated website must be:
- Professional and trustworthy
- Fast and lightweight
- Mobile-friendly
- SEO-focused
- Clean and easy to navigate

====================================
MANDATORY TECHNOLOGIES & STACK
====================================
Every website MUST use this stack:

- **Framework:** Next.js 14+ (App Router)
- **Language:** TypeScript
- **UI Library:** React 18+
- **Styling:** Tailwind CSS
- **Animations:** Minimal Framer Motion (subtle fades only)
- **Design Philosophy:**
  - Clean, professional, corporate-ready
  - Traditional layouts that build trust
  - Content-focused, not effect-focused
  - Fast loading, minimal JavaScript

====================================
FOLDER STRUCTURE (REQUIRED)
====================================
/app          - App Router pages/layouts
/components   - Reusable UI pieces
/public       - Static assets
/lib          - Utility code
/styles       - Global styles if needed

====================================
DESIGN & UX REQUIREMENTS
====================================
The websites must:

1. **Fully Responsive & Mobile-First**
   - Design must work beautifully on small screens
   - Navigation, buttons, spacing optimized for mobile
   - Touch-friendly interactions

2. **Fast-Loading (Priority)**
   - Minimal JavaScript and animations
   - Use Next.js Image component
   - Lazy-load images
   - Optimize Core Web Vitals
   - No heavy animation libraries

3. **Professional & Trustworthy**
   - Clean, organized layouts
   - Strong visual hierarchy
   - Consistent spacing
   - Simple hover states (color change, subtle shadow)
   - NO parallax, NO magnetic buttons, NO complex animations
   - Solid color backgrounds (white, light gray, navy, dark blue)
   - Subtle box shadows for depth
   - Clean borders and dividers
   - Professional photography style

4. **Typography**
   - Serif fonts for headings (Georgia, Playfair Display, or similar) - conveys trust
   - Clean sans-serif for body (Inter, Open Sans)
   - Larger text sizes for readability
   - Strong contrast for accessibility

====================================
SEO & LOCAL-BUSINESS REQUIREMENTS
====================================
Critical SEO steps:

1. **Semantic HTML**
   - Use proper tags: header, main, section, footer, nav, article
   - ONE h1 per page, proper heading hierarchy

2. **Meta Tags**
   - Keyword-rich title per page
   - Compelling meta description
   - Use Next.js metadata/generateMetadata

3. **Open Graph & Social**
   - OG tags: title, description, image, url
   - Twitter Card tags

4. **Local SEO Schema (JSON-LD)**
   - LocalBusiness structured data
   - Include: name, address, phone, hours, URL, sameAs

5. **URL Structure**
   - Clean routes: /services, /about, /contact
   - No query-string-only pages

6. **Content for SEO**
   - Detailed business description
   - City/neighborhood mentions
   - Natural keyword usage

7. **Accessibility**
   - Alt text on images
   - Good color contrast (WCAG AA minimum)
   - ARIA attributes
   - Keyboard navigation

====================================
COMPONENT PATTERNS
====================================
Use these CLASSIC patterns throughout:

- Hero sections with solid color or subtle gradient background
- Clean white cards with subtle shadows
- Simple icon + text service blocks
- Grid-based testimonial layouts (no carousels)
- Straightforward contact forms
- Professional footer with organized columns
- Simple fade-in on scroll (subtle, 0.3s)
- Underline hover effects on links
- Button hover: darken color + subtle shadow
- NO floating elements
- NO glassmorphism
- NO parallax
- NO magnetic/animated buttons
- NO staggered animations
- NO text reveal animations

====================================
COLOR PALETTE GUIDELINES
====================================
Use professional, trustworthy colors:

PRIMARY OPTIONS:
- Navy Blue (#1e3a5f, #2c3e50)
- Dark Blue (#1a365d, #234e70)
- Forest Green (#2d5a3d, #1e4d2b)
- Burgundy (#722f37, #800020)
- Charcoal (#333333, #4a4a4a)

ACCENT OPTIONS:
- Gold (#c9a962, #b8860b)
- Subtle Blue (#4a90a4, #5f9ea0)
- Warm Gray (#6b7280, #9ca3af)

BACKGROUNDS:
- White (#ffffff)
- Light Gray (#f8f9fa, #f3f4f6)
- Off-white (#fafafa, #f5f5f5)

AVOID:
- Neon colors
- Bright gradients
- Overly vibrant palettes

====================================
LAYOUT STRUCTURE
====================================
Keep layouts simple and scannable:

HEADER:
- Clean logo on left
- Navigation links on right
- Simple dropdown menus if needed
- Optional: Phone number visible in header
- Subtle shadow on scroll

HERO:
- Clear headline (what you do)
- Subheadline (value proposition)
- 1-2 call-to-action buttons
- Optional: Professional image or simple background

SECTIONS:
- Clear section headings
- Generous but not excessive padding (py-16 to py-24)
- 2-3 column grids for services/features
- Alternating background colors (white/gray)

FOOTER:
- Logo and tagline
- Contact information
- Quick links
- Social media icons (simple)
- Copyright

====================================
TRUST ELEMENTS (IMPORTANT)
====================================
Include these trust-building elements:

- Years in business
- Number of clients served
- Professional certifications/licenses
- Association memberships
- Awards and recognition
- Client testimonials with full names
- Before/after or case studies
- Clear contact information on every page
- Professional team photos if available
`

export const DESIGN_PRINCIPLES_CLASSIC = {
  colors: {
    primary: 'Navy, dark blue, forest green, or burgundy',
    accents: 'Gold, subtle blue, or warm gray',
    backgrounds: 'White, light gray, off-white',
  },
  typography: {
    headings: 'Serif fonts for elegance and trust (Georgia, Playfair Display)',
    body: 'Clean sans-serif for readability (Inter, Open Sans)',
    sizes: 'Large, readable, accessible',
  },
  spacing: {
    sections: 'Generous but practical padding (py-16 to py-24)',
    elements: 'Consistent, organized spacing',
    mobile: 'Well-adapted for all screen sizes',
  },
  animations: {
    timing: 'Subtle, professional',
    duration: '0.3s maximum for any transition',
    triggers: 'Hover states, simple scroll fade-in only',
    avoid: 'Parallax, staggered, magnetic, complex reveals',
  },
}

export const REQUIRED_PAGES_CLASSIC = [
  { path: '/', name: 'Home', sections: ['Hero', 'Services Overview', 'About Preview', 'Testimonials', 'CTA'] },
  { path: '/about', name: 'About', sections: ['Hero', 'Our Story', 'Team/Values', 'Credentials', 'CTA'] },
  { path: '/services', name: 'Services', sections: ['Hero', 'Service List', 'Process', 'FAQ', 'CTA'] },
  { path: '/contact', name: 'Contact', sections: ['Hero', 'Contact Form', 'Location/Map', 'Business Hours'] },
]

export const REQUIRED_COMPONENTS_CLASSIC = [
  'Navbar',
  'Footer',
  'Hero',
  'Button',
  'Card',
  'ServiceCard',
  'TestimonialCard',
  'ContactForm',
  'SectionHeading',
]

export const STYLE_DESCRIPTION = {
  name: 'Classic Professional',
  tagline: 'Trustworthy & Established',
  bestFor: [
    'Law Firms',
    'Medical & Dental Practices',
    'Accounting & Financial Services',
    'Insurance Agencies',
    'Real Estate',
    'Contractors & Home Services',
    'Consulting Firms',
    'Established Local Businesses',
  ],
  features: [
    'Clean, professional layouts',
    'Subtle animations only',
    'Serif headings for trust',
    'Fast loading, minimal JS',
    'Traditional color schemes',
    'Content-focused design',
  ],
}
