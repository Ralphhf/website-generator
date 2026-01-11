// Website Design Guidelines - These rules MUST be followed for every generated website
// This prompt is used by the AI content generator and website generator

export const WEBSITE_DESIGN_PROMPT = `
====================================
📌 WEBSITE GENERATION REQUIREMENTS
====================================

These websites are for LOCAL businesses that exist on Google.
They will be SOLD to real businesses, so **quality, performance, and SEO are critical**.

Every generated website must be:
- Extremely high-end
- Fast
- Mobile-friendly
- SEO-focused
- Awwwards-level visually

====================================
📌 MANDATORY TECHNOLOGIES & STACK
====================================
Every website MUST use this stack:

- **Framework:** Next.js 14+ (App Router)
- **Language:** TypeScript
- **UI Library:** React 18+
- **Styling:** Tailwind CSS
- **Animations:** Framer Motion
- **Design Inspiration:**
  - 21st.dev (Magic / advanced components, modern layouts)
  - Aceternity-style components and motion patterns
  - Awwwards-level layouts and aesthetics

====================================
📌 FOLDER STRUCTURE (REQUIRED)
====================================
/app          - App Router pages/layouts
/components   - Reusable UI pieces
/public       - Static assets
/lib          - Utility code
/styles       - Global styles if needed

====================================
📌 DESIGN & UX REQUIREMENTS
====================================
The websites must:

1. **Fully Responsive & Mobile-First**
   - Design must work beautifully on small screens
   - Navigation, buttons, spacing optimized for mobile
   - Touch-friendly interactions

2. **Fast-Loading**
   - Minimal blocking JS
   - Use Next.js Image component
   - Lazy-load heavy sections/images
   - Optimize Core Web Vitals

3. **Visually Elite (Awwwards-Level)**
   - Bold, clean typography
   - Strong visual hierarchy
   - Sophisticated spacing and rhythm
   - Micro-interactions (hover, focus, subtle parallax)
   - Smooth scroll-based animations with Framer Motion
   - Glassmorphism, gradients, soft shadows
   - Layered backgrounds with depth
   - Staggered fade-ins, scroll reveals
   - Modern sticky navbars

====================================
📌 SEO & LOCAL-BUSINESS REQUIREMENTS
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
   - Good color contrast
   - ARIA attributes
   - Keyboard navigation

====================================
📌 COMPONENT PATTERNS
====================================
Use these patterns throughout:

- Hero sections with gradient backgrounds and animated text
- Floating cards with glassmorphism effects
- Animated counters for statistics
- Testimonial carousels with smooth transitions
- Service cards with hover effects and icons
- Contact sections with animated form elements
- Footer with gradient accents
- Scroll-triggered animations
- Parallax effects on images
- Magnetic buttons
- Text reveal animations
- Staggered list animations
`

export const DESIGN_PRINCIPLES = {
  colors: {
    primary: 'Modern blue or brand-appropriate',
    gradients: 'Subtle gradients for depth',
    backgrounds: 'Light with subtle patterns or dark elegant themes',
  },
  typography: {
    headings: 'Bold, modern sans-serif (Inter, Plus Jakarta Sans)',
    body: 'Clean, readable, good line height',
    sizes: 'Large headings, comfortable body text',
  },
  spacing: {
    sections: 'Generous padding (py-20 to py-32)',
    elements: 'Consistent spacing scale',
    mobile: 'Tighter on mobile, breathable on desktop',
  },
  animations: {
    timing: 'Smooth easing (ease-out, spring)',
    duration: '0.3s for micro, 0.6s for sections',
    triggers: 'On scroll, on hover, on load',
  },
}

export const REQUIRED_PAGES = [
  { path: '/', name: 'Home', sections: ['Hero', 'Services', 'About Preview', 'Testimonials', 'CTA'] },
  { path: '/about', name: 'About', sections: ['Hero', 'Story', 'Team/Values', 'Stats', 'CTA'] },
  { path: '/services', name: 'Services', sections: ['Hero', 'Service List', 'Process', 'CTA'] },
  { path: '/contact', name: 'Contact', sections: ['Hero', 'Contact Form', 'Map/Location', 'Info'] },
]

export const REQUIRED_COMPONENTS = [
  'Navbar',
  'Footer',
  'Hero',
  'Button',
  'Card',
  'ServiceCard',
  'TestimonialCard',
  'ContactForm',
  'SectionHeading',
  'AnimatedText',
  'ScrollReveal',
]
