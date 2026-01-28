import { BusinessInfo, COLOR_SCHEMES, FONT_STYLES, ColorScheme } from './types'
import { slugify, formatPhoneNumber } from './utils'
import { WEBSITE_DESIGN_PROMPT } from './website-design-prompt'

// Get colors from branding config
function getBrandColors(businessInfo: BusinessInfo): { primary: string; secondary: string } {
  const branding = businessInfo.branding
  if (!branding) {
    return { primary: '#3b82f6', secondary: '#1e40af' } // Default blue
  }

  if (branding.colorScheme === 'custom') {
    return {
      primary: branding.customPrimaryColor || '#3b82f6',
      secondary: branding.customSecondaryColor || '#1e40af',
    }
  }

  return COLOR_SCHEMES[branding.colorScheme] || { primary: '#3b82f6', secondary: '#1e40af' }
}

// Get fonts from branding config
function getBrandFonts(businessInfo: BusinessInfo): { heading: string; body: string } {
  const branding = businessInfo.branding
  if (!branding) {
    return { heading: 'Inter', body: 'Inter' } // Default modern
  }

  return FONT_STYLES[branding.fontStyle] || { heading: 'Inter', body: 'Inter' }
}

// Convert hex to RGB values for Tailwind
function hexToRgb(hex: string): { r: number; g: number; b: number } {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex)
  return result
    ? {
        r: parseInt(result[1], 16),
        g: parseInt(result[2], 16),
        b: parseInt(result[3], 16),
      }
    : { r: 59, g: 130, b: 246 } // Default blue
}

// Generate color shades from a base color
function generateColorShades(hex: string): Record<number, string> {
  const { r, g, b } = hexToRgb(hex)

  // Generate shades by adjusting lightness
  return {
    50: adjustColor(r, g, b, 0.95),
    100: adjustColor(r, g, b, 0.9),
    200: adjustColor(r, g, b, 0.75),
    300: adjustColor(r, g, b, 0.6),
    400: adjustColor(r, g, b, 0.4),
    500: `#${hex.replace('#', '')}`,
    600: adjustColor(r, g, b, -0.1),
    700: adjustColor(r, g, b, -0.25),
    800: adjustColor(r, g, b, -0.4),
    900: adjustColor(r, g, b, -0.55),
    950: adjustColor(r, g, b, -0.7),
  }
}

// Adjust color brightness
function adjustColor(r: number, g: number, b: number, factor: number): string {
  if (factor > 0) {
    // Lighten
    r = Math.round(r + (255 - r) * factor)
    g = Math.round(g + (255 - g) * factor)
    b = Math.round(b + (255 - b) * factor)
  } else {
    // Darken
    r = Math.round(r * (1 + factor))
    g = Math.round(g * (1 + factor))
    b = Math.round(b * (1 + factor))
  }

  return `#${r.toString(16).padStart(2, '0')}${g.toString(16).padStart(2, '0')}${b.toString(16).padStart(2, '0')}`
}

// Escape strings for safe use in JavaScript single-quoted strings
function escapeJs(str: string): string {
  if (!str) return ''
  return str
    .replace(/\\/g, '\\\\')  // Escape backslashes first
    .replace(/'/g, "\\'")     // Escape single quotes
    .replace(/"/g, '\\"')     // Escape double quotes
    .replace(/\n/g, '\\n')    // Escape newlines
    .replace(/\r/g, '\\r')    // Escape carriage returns
}

// Create a sanitized version of business info with all strings escaped for JS
function sanitizeBusinessInfo(info: BusinessInfo): BusinessInfo {
  return {
    ...info,
    name: escapeJs(info.name),
    description: escapeJs(info.description || ''),
    tagline: escapeJs(info.tagline || ''),
    phone: escapeJs(info.phone || ''),
    email: escapeJs(info.email || ''),
    address: escapeJs(info.address || ''),
    city: escapeJs(info.city || ''),
    state: escapeJs(info.state || ''),
    businessType: escapeJs((info.businessType || '').replace(/_/g, ' ')),
    services: info.services?.map(s => escapeJs(s)),
    pricing: info.pricing?.map(p => ({
      ...p,
      name: escapeJs(p.name),
      price: escapeJs(p.price),
      description: p.description ? escapeJs(p.description) : undefined,
      features: p.features.map(f => escapeJs(f)),
    })),
    faqs: info.faqs?.map(f => ({
      ...f,
      question: escapeJs(f.question),
      answer: escapeJs(f.answer),
    })),
    products: info.products?.map(p => ({
      ...p,
      name: escapeJs(p.name),
      price: escapeJs(p.price),
      description: p.description ? escapeJs(p.description) : undefined,
      image: p.image || undefined,
    })),
    calendlyUrl: info.calendlyUrl ? escapeJs(info.calendlyUrl) : undefined,
  }
}

// Get CTA button text based on primaryCTA type
function getCTAText(primaryCTA?: string): { primary: string; secondary: string } {
  switch (primaryCTA) {
    case 'call':
      return { primary: 'Call Now', secondary: 'View Services' }
    case 'book':
      return { primary: 'Book Appointment', secondary: 'Our Services' }
    case 'quote':
      return { primary: 'Get Free Quote', secondary: 'View Services' }
    case 'visit':
      return { primary: 'Visit Us', secondary: 'Get Directions' }
    case 'shop':
      return { primary: 'Shop Now', secondary: 'Browse Products' }
    case 'contact':
    default:
      return { primary: 'Contact Us', secondary: 'View Services' }
  }
}

// Generate a premium Next.js website with Awwwards-level design
export function generatePremiumWebsite(businessInfo: BusinessInfo): Record<string, string> {
  const files: Record<string, string> = {}
  // Sanitize all business info strings to escape quotes and special characters
  const safeInfo = sanitizeBusinessInfo(businessInfo)
  const slug = slugify(businessInfo.name) // Use original for slug (escaping would break it)

  // Package.json
  files['package.json'] = generatePackageJson(slug)

  // Config files
  files['next.config.js'] = generateNextConfig()
  files['tailwind.config.ts'] = generateTailwindConfig(safeInfo)
  files['tsconfig.json'] = generateTsConfig()
  files['postcss.config.js'] = `module.exports = { plugins: { tailwindcss: {}, autoprefixer: {} } }`

  // App files - use safeInfo with escaped strings
  files['app/layout.tsx'] = generateRootLayout(safeInfo)
  files['app/globals.css'] = generateGlobalStyles()
  files['app/page.tsx'] = generateHomePage(safeInfo)
  files['app/about/page.tsx'] = generateAboutPage(safeInfo)
  files['app/services/page.tsx'] = generateServicesPage(safeInfo)
  files['app/contact/page.tsx'] = generateContactPage(safeInfo)

  // Generate Shop page if products exist
  if (safeInfo.products && safeInfo.products.length > 0) {
    files['app/shop/page.tsx'] = generateShopPage(safeInfo)
  }

  // Generate Menu page for restaurants
  if (safeInfo.menu && (safeInfo.menu.categories.length > 0 || safeInfo.menu.menuPdfUrl)) {
    files['app/menu/page.tsx'] = generateMenuPage(safeInfo)
  }

  // Generate booking section component if booking is configured
  if (safeInfo.booking && safeInfo.booking.enabled) {
    files['components/sections/booking.tsx'] = generateBookingComponent(safeInfo)
  }

  // Generate medical info component for healthcare
  if (safeInfo.medical) {
    files['components/sections/medical-info.tsx'] = generateMedicalComponent(safeInfo)
  }

  // Components - use safeInfo with escaped strings
  files['components/ui/navbar.tsx'] = generateNavbar(safeInfo)
  files['components/ui/footer.tsx'] = generateFooter(safeInfo)
  files['components/ui/button.tsx'] = generateButton()
  files['components/sections/hero.tsx'] = generateHeroComponent(safeInfo)
  files['components/sections/services.tsx'] = generateServicesComponent(safeInfo)
  files['components/sections/testimonials.tsx'] = generateTestimonialsComponent(safeInfo)
  files['components/sections/cta.tsx'] = generateCTAComponent(safeInfo)
  files['components/sections/about-preview.tsx'] = generateAboutPreviewComponent(safeInfo)

  // Optional sections based on data
  if (safeInfo.pricing && safeInfo.pricing.length > 0) {
    files['components/sections/pricing.tsx'] = generatePricingComponent(safeInfo)
  }
  if (safeInfo.faqs && safeInfo.faqs.length > 0) {
    files['components/sections/faq.tsx'] = generateFAQComponent(safeInfo)
  }

  files['components/animations/scroll-reveal.tsx'] = generateScrollReveal()
  files['components/animations/animated-text.tsx'] = generateAnimatedText()

  // Lib
  files['lib/utils.ts'] = generateUtilsFile()

  // Public files
  files['public/robots.txt'] = generateRobotsTxt(slug)

  return files
}

function generatePackageJson(slug: string): string {
  return JSON.stringify({
    name: slug,
    version: '1.0.0',
    private: true,
    scripts: {
      dev: 'next dev',
      build: 'next build',
      start: 'next start',
      lint: 'next lint',
    },
    dependencies: {
      next: '^14.2.0',
      react: '^18.2.0',
      'react-dom': '^18.2.0',
      'framer-motion': '^11.0.0',
      'lucide-react': '^0.400.0',
      clsx: '^2.1.0',
      'tailwind-merge': '^2.2.0',
    },
    devDependencies: {
      typescript: '^5',
      '@types/node': '^20',
      '@types/react': '^18',
      '@types/react-dom': '^18',
      tailwindcss: '^3.4.0',
      postcss: '^8',
      autoprefixer: '^10',
    },
  }, null, 2)
}

function generateNextConfig(): string {
  return `/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',
  trailingSlash: true,
  images: {
    unoptimized: true,
  },
}
module.exports = nextConfig`
}

function generateTailwindConfig(businessInfo: BusinessInfo): string {
  const colors = getBrandColors(businessInfo)
  const primaryShades = generateColorShades(colors.primary)

  return `import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          50: '${primaryShades[50]}',
          100: '${primaryShades[100]}',
          200: '${primaryShades[200]}',
          300: '${primaryShades[300]}',
          400: '${primaryShades[400]}',
          500: '${primaryShades[500]}',
          600: '${primaryShades[600]}',
          700: '${primaryShades[700]}',
          800: '${primaryShades[800]}',
          900: '${primaryShades[900]}',
          950: '${primaryShades[950]}',
        },
      },
      fontFamily: {
        sans: ['var(--font-body)', 'system-ui', 'sans-serif'],
        heading: ['var(--font-heading)', 'system-ui', 'sans-serif'],
      },
      animation: {
        'fade-in': 'fadeIn 0.5s ease-out',
        'slide-up': 'slideUp 0.5s ease-out',
        'slide-down': 'slideDown 0.3s ease-out',
        'scale-in': 'scaleIn 0.3s ease-out',
        'float': 'float 6s ease-in-out infinite',
        'pulse-slow': 'pulse 4s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'gradient': 'gradient 8s linear infinite',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { opacity: '0', transform: 'translateY(20px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        slideDown: {
          '0%': { opacity: '0', transform: 'translateY(-10px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        scaleIn: {
          '0%': { opacity: '0', transform: 'scale(0.95)' },
          '100%': { opacity: '1', transform: 'scale(1)' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-20px)' },
        },
        gradient: {
          '0%, 100%': { backgroundPosition: '0% 50%' },
          '50%': { backgroundPosition: '100% 50%' },
        },
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'gradient-conic': 'conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))',
        'hero-pattern': 'url("data:image/svg+xml,%3Csvg width=\\'60\\' height=\\'60\\' viewBox=\\'0 0 60 60\\' xmlns=\\'http://www.w3.org/2000/svg\\'%3E%3Cg fill=\\'none\\' fill-rule=\\'evenodd\\'%3E%3Cg fill=\\'%239C92AC\\' fill-opacity=\\'0.05\\'%3E%3Cpath d=\\'M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z\\'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")',
      },
    },
  },
  plugins: [],
}
export default config`
}

function generateTsConfig(): string {
  return JSON.stringify({
    compilerOptions: {
      target: 'es5',
      lib: ['dom', 'dom.iterable', 'esnext'],
      allowJs: true,
      skipLibCheck: true,
      strict: true,
      noEmit: true,
      esModuleInterop: true,
      module: 'esnext',
      moduleResolution: 'bundler',
      resolveJsonModule: true,
      isolatedModules: true,
      jsx: 'preserve',
      incremental: true,
      plugins: [{ name: 'next' }],
      paths: {
        '@/*': ['./*'],
      },
    },
    include: ['next-env.d.ts', '**/*.ts', '**/*.tsx', '.next/types/**/*.ts'],
    exclude: ['node_modules'],
  }, null, 2)
}

function generateRootLayout(businessInfo: BusinessInfo): string {
  const fonts = getBrandFonts(businessInfo)
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'LocalBusiness',
    name: businessInfo.name,
    description: businessInfo.description,
    telephone: businessInfo.phone,
    email: businessInfo.email,
    address: {
      '@type': 'PostalAddress',
      streetAddress: businessInfo.address,
      addressLocality: businessInfo.city,
      addressRegion: businessInfo.state,
      postalCode: businessInfo.zipCode,
    },
  }

  // Map font names to their Google Fonts import names
  const fontImportMap: Record<string, string> = {
    'Inter': 'Inter',
    'Merriweather': 'Merriweather',
    'Source Sans 3': 'Source_Sans_3',
    'Playfair Display': 'Playfair_Display',
    'Lato': 'Lato',
    'Montserrat': 'Montserrat',
    'Open Sans': 'Open_Sans',
  }

  const headingFontImport = fontImportMap[fonts.heading] || 'Inter'
  const bodyFontImport = fontImportMap[fonts.body] || 'Inter'
  const isSameFont = fonts.heading === fonts.body

  // Always generate both font variables for consistency
  // When same font, both variables use the same font
  const fontImports = isSameFont
    ? `import { ${headingFontImport} } from 'next/font/google'

const headingFont = ${headingFontImport}({
  subsets: ['latin'],
  variable: '--font-heading',
})
const bodyFont = ${headingFontImport}({
  subsets: ['latin'],
  variable: '--font-body',
})`
    : `import { ${headingFontImport}, ${bodyFontImport} } from 'next/font/google'

const headingFont = ${headingFontImport}({
  subsets: ['latin'],
  variable: '--font-heading',
})
const bodyFont = ${bodyFontImport}({
  subsets: ['latin'],
  variable: '--font-body',
})`

  return `import type { Metadata } from 'next'
${fontImports}
import './globals.css'
import { Navbar } from '@/components/ui/navbar'
import { Footer } from '@/components/ui/footer'

export const metadata: Metadata = {
  title: {
    default: '${businessInfo.name} | ${businessInfo.tagline || `Professional ${businessInfo.businessType?.replace(/_/g, ' ')} Services`}',
    template: '%s | ${businessInfo.name}',
  },
  description: '${businessInfo.description || `${businessInfo.name} provides professional ${businessInfo.businessType?.replace(/_/g, ' ')} services in ${businessInfo.city || 'your area'}.`}',
  keywords: ['${businessInfo.businessType?.replace(/_/g, ' ')}', '${businessInfo.city}', '${businessInfo.services?.slice(0, 5).join("', '")}'],
  openGraph: {
    type: 'website',
    locale: 'en_US',
    siteName: '${businessInfo.name}',
    title: '${businessInfo.name}',
    description: '${businessInfo.description?.slice(0, 160) || `Professional ${businessInfo.businessType?.replace(/_/g, ' ')} services`}',
  },
  twitter: {
    card: 'summary_large_image',
    title: '${businessInfo.name}',
    description: '${businessInfo.description?.slice(0, 160) || `Professional ${businessInfo.businessType?.replace(/_/g, ' ')} services`}',
  },
  robots: {
    index: true,
    follow: true,
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className={\`\${headingFont.variable} \${bodyFont.variable}\`}>
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(${JSON.stringify(jsonLd)}) }}
        />
      </head>
      <body className="min-h-screen bg-white text-gray-900 antialiased font-sans">
        <Navbar />
        <main>{children}</main>
        <Footer />
      </body>
    </html>
  )
}`
}

function generateGlobalStyles(): string {
  return `@tailwind base;
@tailwind components;
@tailwind utilities;

@layer base {
  :root {
    --background: 0 0% 100%;
    --foreground: 222.2 84% 4.9%;
  }

  * {
    @apply border-gray-200;
  }

  body {
    @apply bg-white text-gray-900;
  }

  h1, h2, h3, h4, h5, h6 {
    @apply font-heading;
  }

  ::selection {
    @apply bg-primary-500/20 text-primary-900;
  }
}

@layer components {
  .gradient-text {
    @apply bg-clip-text text-transparent bg-gradient-to-r from-primary-600 via-primary-500 to-primary-400;
  }

  .glass {
    @apply bg-white/70 backdrop-blur-xl border border-white/20 shadow-xl;
  }

  .glass-dark {
    @apply bg-gray-900/70 backdrop-blur-xl border border-white/10;
  }

  .section-padding {
    @apply py-20 md:py-28 lg:py-32;
  }

  .container-custom {
    @apply max-w-7xl mx-auto px-4 sm:px-6 lg:px-8;
  }

  .heading-1 {
    @apply text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold tracking-tight;
  }

  .heading-2 {
    @apply text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight;
  }

  .heading-3 {
    @apply text-2xl sm:text-3xl font-bold;
  }

  .text-balance {
    text-wrap: balance;
  }

  .animate-in {
    animation: fadeIn 0.5s ease-out forwards;
  }
}

@layer utilities {
  .text-shadow {
    text-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  }

  .text-shadow-lg {
    text-shadow: 0 4px 8px rgba(0, 0, 0, 0.12);
  }
}

/* Smooth scrolling */
html {
  scroll-behavior: smooth;
}

/* Custom scrollbar */
::-webkit-scrollbar {
  width: 10px;
}

::-webkit-scrollbar-track {
  background: #f1f1f1;
}

::-webkit-scrollbar-thumb {
  background: #c1c1c1;
  border-radius: 5px;
}

::-webkit-scrollbar-thumb:hover {
  background: #a1a1a1;
}`
}

function generateNavbar(businessInfo: BusinessInfo): string {
  const ctaText = getCTAText(businessInfo.primaryCTA)
  const hasShop = businessInfo.products && businessInfo.products.length > 0
  const hasMenu = businessInfo.menu && (businessInfo.menu.categories.length > 0 || businessInfo.menu.menuPdfUrl)

  return `'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { motion, AnimatePresence } from 'framer-motion'
import { Menu, X, Phone } from 'lucide-react'
import { Button } from './button'

const navLinks = [
  { href: '/', label: 'Home' },
  { href: '/about', label: 'About' },
  { href: '/services', label: 'Services' },
  ${hasMenu ? `{ href: '/menu', label: 'Menu' },` : ''}
  ${hasShop ? `{ href: '/shop', label: 'Shop' },` : ''}
  { href: '/contact', label: 'Contact' },
]

export function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20)
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  return (
    <header
      className={\`fixed top-0 left-0 right-0 z-50 transition-all duration-300 \${
        isScrolled
          ? 'bg-white/80 backdrop-blur-xl shadow-lg shadow-gray-900/5'
          : 'bg-transparent'
      }\`}
    >
      <nav className="container-custom">
        <div className="flex items-center justify-between h-20">
          {/* Logo */}
          <Link href="/" className="relative z-10">
            <motion.span
              className="text-2xl font-bold gradient-text"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              ${businessInfo.name}
            </motion.span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="relative text-gray-600 hover:text-gray-900 font-medium transition-colors group"
              >
                {link.label}
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-primary-500 transition-all group-hover:w-full" />
              </Link>
            ))}
          </div>

          {/* CTA Button */}
          <div className="hidden md:flex items-center gap-4">
            ${businessInfo.phone ? `<a href="tel:${businessInfo.phone}" className="flex items-center gap-2 text-gray-600 hover:text-primary-600 transition-colors">
              <Phone className="w-4 h-4" />
              <span className="font-medium">${formatPhoneNumber(businessInfo.phone)}</span>
            </a>` : ''}
            <Button asChild>
              <Link href="/contact">${ctaText.primary}</Link>
            </Button>
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden relative z-10 p-2"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            aria-label="Toggle menu"
          >
            {isMobileMenuOpen ? (
              <X className="w-6 h-6" />
            ) : (
              <Menu className="w-6 h-6" />
            )}
          </button>
        </div>
      </nav>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="md:hidden absolute top-full left-0 right-0 bg-white border-b shadow-xl"
          >
            <div className="container-custom py-6 space-y-4">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="block py-2 text-lg font-medium text-gray-900 hover:text-primary-600 transition-colors"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  {link.label}
                </Link>
              ))}
              <Button asChild className="w-full mt-4">
                <Link href="/contact">${ctaText.primary}</Link>
              </Button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  )
}`
}

function generateFooter(businessInfo: BusinessInfo): string {
  const year = new Date().getFullYear()

  return `'use client'

import Link from 'next/link'
import { Phone, Mail, MapPin } from 'lucide-react'

const footerLinks = {
  company: [
    { label: 'About', href: '/about' },
    { label: 'Services', href: '/services' },
    { label: 'Contact', href: '/contact' },
  ],
  services: ${JSON.stringify(businessInfo.services?.slice(0, 4).map(s => ({ label: s, href: '/services' })) || [])},
}

export function Footer() {
  return (
    <footer className="bg-gray-900 text-gray-300">
      {/* Main Footer */}
      <div className="container-custom section-padding">
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-12">
          {/* Brand */}
          <div className="lg:col-span-1">
            <Link href="/" className="text-2xl font-bold text-white">
              ${businessInfo.name}
            </Link>
            ${businessInfo.tagline ? `<p className="mt-4 text-gray-400">${businessInfo.tagline}</p>` : ''}
            ${businessInfo.yearsInBusiness ? `<p className="mt-2 text-sm text-gray-500">${businessInfo.yearsInBusiness}+ Years of Excellence</p>` : ''}
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-white font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-3">
              {footerLinks.company.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="hover:text-white transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Services */}
          <div>
            <h3 className="text-white font-semibold mb-4">Services</h3>
            <ul className="space-y-3">
              {footerLinks.services.map((link: { label: string; href: string }) => (
                <li key={link.label}>
                  <Link
                    href={link.href}
                    className="hover:text-white transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="text-white font-semibold mb-4">Contact</h3>
            <ul className="space-y-3">
              ${businessInfo.phone ? `<li className="flex items-center gap-3">
                <Phone className="w-4 h-4 text-primary-400" />
                <a href="tel:${businessInfo.phone}" className="hover:text-white transition-colors">
                  ${formatPhoneNumber(businessInfo.phone)}
                </a>
              </li>` : ''}
              ${businessInfo.email ? `<li className="flex items-center gap-3">
                <Mail className="w-4 h-4 text-primary-400" />
                <a href="mailto:${businessInfo.email}" className="hover:text-white transition-colors">
                  ${businessInfo.email}
                </a>
              </li>` : ''}
              ${businessInfo.address ? `<li className="flex items-start gap-3">
                <MapPin className="w-4 h-4 text-primary-400 mt-1" />
                <span>${businessInfo.address}${businessInfo.city ? `, ${businessInfo.city}` : ''}${businessInfo.state ? `, ${businessInfo.state}` : ''}</span>
              </li>` : ''}
            </ul>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-gray-800">
        <div className="container-custom py-6 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-sm text-gray-500">
            © ${year} ${businessInfo.name}. All rights reserved.
          </p>
          <div className="flex gap-6 text-sm text-gray-500">
            <Link href="/contact" className="hover:text-white transition-colors">
              Privacy Policy
            </Link>
            <Link href="/contact" className="hover:text-white transition-colors">
              Terms of Service
            </Link>
          </div>
        </div>
      </div>
    </footer>
  )
}`
}

function generateButton(): string {
  return `'use client'

import * as React from 'react'
import { cn } from '@/lib/utils'

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'default' | 'outline' | 'ghost' | 'secondary'
  size?: 'default' | 'sm' | 'lg' | 'icon'
  asChild?: boolean
  children?: React.ReactNode
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = 'default', size = 'default', asChild = false, children, ...props }, ref) => {
    const classes = cn(
      'inline-flex items-center justify-center whitespace-nowrap rounded-full font-semibold transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50',
      {
        'bg-primary-600 text-white shadow-lg shadow-primary-500/25 hover:bg-primary-700 hover:shadow-xl hover:shadow-primary-500/30 hover:-translate-y-0.5': variant === 'default',
        'border-2 border-gray-200 bg-transparent hover:bg-gray-50 hover:border-gray-300': variant === 'outline',
        'hover:bg-gray-100': variant === 'ghost',
        'bg-gray-100 text-gray-900 hover:bg-gray-200': variant === 'secondary',
      },
      {
        'h-10 px-6 text-sm': size === 'default',
        'h-8 px-4 text-xs': size === 'sm',
        'h-12 px-8 text-base': size === 'lg',
        'h-10 w-10': size === 'icon',
      },
      className
    )

    // If asChild is true and children is a Link, render the link with button styles
    if (asChild && React.isValidElement(children)) {
      return React.cloneElement(children as React.ReactElement<any>, {
        className: cn(classes, (children as React.ReactElement<any>).props.className),
      })
    }

    return (
      <button
        className={classes}
        ref={ref}
        {...props}
      >
        {children}
      </button>
    )
  }
)
Button.displayName = 'Button'

export { Button }`
}

function generateHeroComponent(businessInfo: BusinessInfo): string {
  const ctaText = getCTAText(businessInfo.primaryCTA)

  return `'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'
import { ArrowRight, Star } from 'lucide-react'
import { Button } from '@/components/ui/button'

interface HeroProps {
  title?: string
  subtitle?: string
  description?: string
  showRating?: boolean
}

export function Hero({
  title = '${businessInfo.name}',
  subtitle = '${businessInfo.tagline || `Professional ${businessInfo.businessType?.replace(/_/g, ' ')} Services`}',
  description = '${businessInfo.description?.slice(0, 200) || `We provide exceptional ${businessInfo.businessType?.replace(/_/g, ' ')} services in ${businessInfo.city || 'your area'}. Quality work, professional service, and customer satisfaction guaranteed.`}',
  showRating = true,
}: HeroProps) {
  return (
    <section className="relative min-h-screen flex items-center overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-gray-50 via-white to-primary-50" />
      <div className="absolute inset-0 bg-hero-pattern opacity-50" />

      {/* Animated gradient orbs */}
      <div className="absolute top-1/4 -left-32 w-96 h-96 bg-primary-400/20 rounded-full blur-3xl animate-pulse-slow" />
      <div className="absolute bottom-1/4 -right-32 w-96 h-96 bg-blue-400/20 rounded-full blur-3xl animate-pulse-slow animation-delay-2000" />

      <div className="container-custom relative z-10 py-32">
        <div className="max-w-4xl">
          {/* Rating Badge */}
          {showRating && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="inline-flex items-center gap-2 bg-white/80 backdrop-blur-sm rounded-full px-4 py-2 shadow-lg mb-8"
            >
              <div className="flex">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                ))}
              </div>
              <span className="text-sm font-medium text-gray-700">
                5.0 Rating • Trusted by 100+ Clients
              </span>
            </motion.div>
          )}

          {/* Title */}
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="heading-1 text-gray-900 mb-6"
          >
            {title.split(' ').map((word, i) => (
              <span key={i}>
                {i === 0 ? (
                  <span className="gradient-text">{word}</span>
                ) : (
                  <span> {word}</span>
                )}
              </span>
            ))}
          </motion.h1>

          {/* Subtitle */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="text-xl md:text-2xl text-gray-600 mb-4 font-medium"
          >
            {subtitle}
          </motion.p>

          {/* Description */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="text-lg text-gray-500 mb-8 max-w-2xl"
          >
            {description}
          </motion.p>

          {/* CTA Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="flex flex-wrap gap-4"
          >
            <Button size="lg" asChild>
              <Link href="/contact">
                ${ctaText.primary}
                <ArrowRight className="ml-2 w-5 h-5" />
              </Link>
            </Button>
            <Button size="lg" variant="outline" asChild>
              <Link href="/services">${ctaText.secondary}</Link>
            </Button>
          </motion.div>

          {/* Trust indicators */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.6 }}
            className="mt-12 pt-8 border-t border-gray-200"
          >
            <div className="flex flex-wrap gap-8">
              ${businessInfo.yearsInBusiness ? `<div>
                <p className="text-3xl font-bold gradient-text">${businessInfo.yearsInBusiness}+</p>
                <p className="text-sm text-gray-500">Years Experience</p>
              </div>` : ''}
              <div>
                <p className="text-3xl font-bold gradient-text">100%</p>
                <p className="text-sm text-gray-500">Satisfaction</p>
              </div>
              <div>
                <p className="text-3xl font-bold gradient-text">24/7</p>
                <p className="text-sm text-gray-500">Support</p>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}`
}

function generateServicesComponent(businessInfo: BusinessInfo): string {
  const services = businessInfo.services || []
  const icons = ['Wrench', 'Star', 'Shield', 'Zap', 'Award', 'CheckCircle']

  return `'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'
import { ${icons.slice(0, Math.min(services.length, 6)).join(', ')}, ArrowRight } from 'lucide-react'
import { ScrollReveal } from '@/components/animations/scroll-reveal'

const services = [
  ${services.slice(0, 6).map((service, i) => `{
    title: '${service}',
    description: 'Professional ${service.toLowerCase()} services with attention to detail and quality workmanship.',
    icon: ${icons[i % icons.length]},
  }`).join(',\n  ')}
]

export function Services() {
  return (
    <section className="section-padding bg-gray-50">
      <div className="container-custom">
        <ScrollReveal>
          <div className="text-center max-w-3xl mx-auto mb-16">
            <span className="text-primary-600 font-semibold text-sm uppercase tracking-wider">
              Our Services
            </span>
            <h2 className="heading-2 text-gray-900 mt-4 mb-6">
              What We Offer
            </h2>
            <p className="text-lg text-gray-600">
              We provide comprehensive ${businessInfo.businessType?.replace(/_/g, ' ')} services to meet all your needs.
            </p>
          </div>
        </ScrollReveal>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {services.map((service, index) => (
            <ScrollReveal key={service.title} delay={index * 0.1}>
              <motion.div
                whileHover={{ y: -8 }}
                className="group relative bg-white rounded-2xl p-8 shadow-lg shadow-gray-200/50 hover:shadow-xl transition-all duration-300"
              >
                {/* Icon */}
                <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-primary-500 to-primary-600 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                  <service.icon className="w-7 h-7 text-white" />
                </div>

                {/* Content */}
                <h3 className="text-xl font-bold text-gray-900 mb-3">
                  {service.title}
                </h3>
                <p className="text-gray-600 mb-4">
                  {service.description}
                </p>

                {/* Link */}
                <Link
                  href="/services"
                  className="inline-flex items-center text-primary-600 font-semibold hover:text-primary-700 transition-colors"
                >
                  Learn More
                  <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </Link>

                {/* Hover gradient */}
                <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-primary-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
              </motion.div>
            </ScrollReveal>
          ))}
        </div>

        {/* CTA */}
        <ScrollReveal delay={0.4}>
          <div className="text-center mt-12">
            <Link
              href="/services"
              className="inline-flex items-center gap-2 text-primary-600 font-semibold hover:text-primary-700 transition-colors"
            >
              View All Services
              <ArrowRight className="w-5 h-5" />
            </Link>
          </div>
        </ScrollReveal>
      </div>
    </section>
  )
}`
}

function generateTestimonialsComponent(businessInfo: BusinessInfo): string {
  const testimonials = businessInfo.testimonials || []

  return `'use client'

import { motion } from 'framer-motion'
import { Star, Quote } from 'lucide-react'
import { ScrollReveal } from '@/components/animations/scroll-reveal'

const testimonials = [
  ${testimonials.length > 0 ? testimonials.map(t => `{
    content: "${t.content.replace(/"/g, '\\"')}",
    author: "${t.author}",
    role: "${t.role || 'Customer'}",
    rating: ${t.rating},
  }`).join(',\n  ') : `{
    content: "Exceptional service from start to finish. Highly recommend!",
    author: "John D.",
    role: "Homeowner",
    rating: 5,
  },
  {
    content: "Professional, reliable, and great quality work.",
    author: "Sarah M.",
    role: "Business Owner",
    rating: 5,
  },
  {
    content: "Best in the area. Will definitely use again!",
    author: "Mike R.",
    role: "Property Manager",
    rating: 5,
  }`}
]

export function Testimonials() {
  return (
    <section className="section-padding bg-white">
      <div className="container-custom">
        <ScrollReveal>
          <div className="text-center max-w-3xl mx-auto mb-16">
            <span className="text-primary-600 font-semibold text-sm uppercase tracking-wider">
              Testimonials
            </span>
            <h2 className="heading-2 text-gray-900 mt-4 mb-6">
              What Our Clients Say
            </h2>
            <p className="text-lg text-gray-600">
              Don't just take our word for it - hear from our satisfied customers.
            </p>
          </div>
        </ScrollReveal>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <ScrollReveal key={index} delay={index * 0.1}>
              <motion.div
                whileHover={{ y: -4 }}
                className="relative bg-gray-50 rounded-2xl p-8 hover:bg-white hover:shadow-xl transition-all duration-300"
              >
                {/* Quote icon */}
                <Quote className="w-10 h-10 text-primary-200 mb-4" />

                {/* Stars */}
                <div className="flex gap-1 mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} className="w-5 h-5 fill-yellow-400 text-yellow-400" />
                  ))}
                </div>

                {/* Content */}
                <p className="text-gray-700 mb-6 leading-relaxed">
                  "{testimonial.content}"
                </p>

                {/* Author */}
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-br from-primary-400 to-primary-600 flex items-center justify-center text-white font-bold">
                    {testimonial.author.charAt(0)}
                  </div>
                  <div>
                    <p className="font-semibold text-gray-900">{testimonial.author}</p>
                    <p className="text-sm text-gray-500">{testimonial.role}</p>
                  </div>
                </div>
              </motion.div>
            </ScrollReveal>
          ))}
        </div>
      </div>
    </section>
  )
}`
}

function generateCTAComponent(businessInfo: BusinessInfo): string {
  const ctaText = getCTAText(businessInfo.primaryCTA)

  return `'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'
import { ArrowRight, Phone } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { ScrollReveal } from '@/components/animations/scroll-reveal'

export function CTA() {
  return (
    <section className="relative py-24 overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary-600 via-primary-700 to-primary-800" />
      <div className="absolute inset-0 bg-hero-pattern opacity-10" />

      {/* Animated orbs */}
      <div className="absolute top-0 left-1/4 w-64 h-64 bg-white/10 rounded-full blur-3xl" />
      <div className="absolute bottom-0 right-1/4 w-64 h-64 bg-primary-400/20 rounded-full blur-3xl" />

      <div className="container-custom relative z-10">
        <ScrollReveal>
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="heading-2 text-white mb-6">
              Ready to Get Started?
            </h2>
            <p className="text-xl text-primary-100 mb-8">
              Contact us today for a free consultation and quote. We're here to help with all your ${businessInfo.businessType?.replace(/_/g, ' ')} needs.
            </p>

            <div className="flex flex-wrap justify-center gap-4">
              <Button size="lg" className="bg-white text-primary-700 hover:bg-gray-100" asChild>
                <Link href="/contact">
                  ${ctaText.primary}
                  <ArrowRight className="ml-2 w-5 h-5" />
                </Link>
              </Button>
              ${businessInfo.phone ? `<Button size="lg" variant="outline" className="border-white/30 text-white hover:bg-white/10" asChild>
                <a href="tel:${businessInfo.phone}">
                  <Phone className="mr-2 w-5 h-5" />
                  Call Now
                </a>
              </Button>` : ''}
            </div>
          </div>
        </ScrollReveal>
      </div>
    </section>
  )
}`
}

function generateAboutPreviewComponent(businessInfo: BusinessInfo): string {
  return `'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'
import { ArrowRight, CheckCircle } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { ScrollReveal } from '@/components/animations/scroll-reveal'

const features = [
  'Licensed & Insured Professionals',
  'Quality Workmanship Guaranteed',
  'Competitive Pricing',
  'Customer Satisfaction Focus',
  ${businessInfo.yearsInBusiness ? `'${businessInfo.yearsInBusiness}+ Years of Experience',` : ''}
  'Free Consultations',
]

export function AboutPreview() {
  return (
    <section className="section-padding bg-white">
      <div className="container-custom">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Content */}
          <ScrollReveal>
            <div>
              <span className="text-primary-600 font-semibold text-sm uppercase tracking-wider">
                About Us
              </span>
              <h2 className="heading-2 text-gray-900 mt-4 mb-6">
                Why Choose ${businessInfo.name}?
              </h2>
              <p className="text-lg text-gray-600 mb-8">
                ${businessInfo.description || `${businessInfo.name} has been providing exceptional ${businessInfo.businessType?.replace(/_/g, ' ')} services to our community. We take pride in our work and are committed to delivering the highest quality results for every project.`}
              </p>

              {/* Features list */}
              <ul className="space-y-4 mb-8">
                {features.map((feature, index) => (
                  <motion.li
                    key={feature}
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                    viewport={{ once: true }}
                    className="flex items-center gap-3"
                  >
                    <CheckCircle className="w-5 h-5 text-primary-500 flex-shrink-0" />
                    <span className="text-gray-700">{feature}</span>
                  </motion.li>
                ))}
              </ul>

              <Button asChild>
                <Link href="/about">
                  Learn More About Us
                  <ArrowRight className="ml-2 w-5 h-5" />
                </Link>
              </Button>
            </div>
          </ScrollReveal>

          {/* Stats Card */}
          <ScrollReveal delay={0.2}>
            <div className="relative">
              <div className="bg-gradient-to-br from-gray-900 to-gray-800 rounded-3xl p-8 md:p-12">
                <div className="grid grid-cols-2 gap-8">
                  ${businessInfo.yearsInBusiness ? `<div className="text-center">
                    <p className="text-4xl md:text-5xl font-bold text-white mb-2">${businessInfo.yearsInBusiness}+</p>
                    <p className="text-gray-400">Years Experience</p>
                  </div>` : ''}
                  <div className="text-center">
                    <p className="text-4xl md:text-5xl font-bold text-white mb-2">500+</p>
                    <p className="text-gray-400">Projects Done</p>
                  </div>
                  <div className="text-center">
                    <p className="text-4xl md:text-5xl font-bold text-white mb-2">100%</p>
                    <p className="text-gray-400">Satisfaction</p>
                  </div>
                  <div className="text-center">
                    <p className="text-4xl md:text-5xl font-bold text-white mb-2">24/7</p>
                    <p className="text-gray-400">Support</p>
                  </div>
                </div>
              </div>

              {/* Decorative elements */}
              <div className="absolute -top-4 -right-4 w-24 h-24 bg-primary-500/20 rounded-full blur-2xl" />
              <div className="absolute -bottom-4 -left-4 w-32 h-32 bg-blue-500/20 rounded-full blur-2xl" />
            </div>
          </ScrollReveal>
        </div>
      </div>
    </section>
  )
}`
}

function generateScrollReveal(): string {
  return `'use client'

import { motion } from 'framer-motion'
import { ReactNode } from 'react'

interface ScrollRevealProps {
  children: ReactNode
  delay?: number
  direction?: 'up' | 'down' | 'left' | 'right'
  className?: string
}

export function ScrollReveal({
  children,
  delay = 0,
  direction = 'up',
  className = '',
}: ScrollRevealProps) {
  const directions = {
    up: { y: 40, x: 0 },
    down: { y: -40, x: 0 },
    left: { y: 0, x: 40 },
    right: { y: 0, x: -40 },
  }

  return (
    <motion.div
      initial={{
        opacity: 0,
        ...directions[direction],
      }}
      whileInView={{
        opacity: 1,
        y: 0,
        x: 0,
      }}
      viewport={{ once: true, margin: '-100px' }}
      transition={{
        duration: 0.6,
        delay,
        ease: [0.21, 0.47, 0.32, 0.98],
      }}
      className={className}
    >
      {children}
    </motion.div>
  )
}`
}

function generateAnimatedText(): string {
  return `'use client'

import { motion } from 'framer-motion'

interface AnimatedTextProps {
  text: string
  className?: string
  delay?: number
}

export function AnimatedText({ text, className = '', delay = 0 }: AnimatedTextProps) {
  const words = text.split(' ')

  return (
    <motion.span className={className}>
      {words.map((word, index) => (
        <motion.span
          key={index}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{
            duration: 0.5,
            delay: delay + index * 0.1,
            ease: [0.21, 0.47, 0.32, 0.98],
          }}
          className="inline-block mr-[0.25em]"
        >
          {word}
        </motion.span>
      ))}
    </motion.span>
  )
}`
}

function generateUtilsFile(): string {
  return `import { type ClassValue, clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}`
}

function generateHomePage(businessInfo: BusinessInfo): string {
  const hasPricing = businessInfo.pricing && businessInfo.pricing.length > 0
  const hasFaqs = businessInfo.faqs && businessInfo.faqs.length > 0

  const imports = [
    `import { Hero } from '@/components/sections/hero'`,
    `import { Services } from '@/components/sections/services'`,
    `import { AboutPreview } from '@/components/sections/about-preview'`,
    `import { Testimonials } from '@/components/sections/testimonials'`,
    hasPricing ? `import { Pricing } from '@/components/sections/pricing'` : '',
    hasFaqs ? `import { FAQ } from '@/components/sections/faq'` : '',
    `import { CTA } from '@/components/sections/cta'`,
  ].filter(Boolean).join('\n')

  const components = [
    `      <Hero />`,
    `      <Services />`,
    `      <AboutPreview />`,
    hasPricing ? `      <Pricing />` : '',
    `      <Testimonials />`,
    hasFaqs ? `      <FAQ />` : '',
    `      <CTA />`,
  ].filter(Boolean).join('\n')

  return `${imports}

export default function HomePage() {
  return (
    <>
${components}
    </>
  )
}`
}

function generateAboutPage(businessInfo: BusinessInfo): string {
  return `import type { Metadata } from 'next'
import { Hero } from '@/components/sections/hero'
import { CTA } from '@/components/sections/cta'
import { ScrollReveal } from '@/components/animations/scroll-reveal'
import { CheckCircle, Award, Users, Clock } from 'lucide-react'

export const metadata: Metadata = {
  title: 'About Us',
  description: 'Learn more about ${businessInfo.name} and our commitment to excellence in ${businessInfo.businessType?.replace(/_/g, ' ')} services.',
}

const values = [
  {
    icon: Award,
    title: 'Quality Excellence',
    description: 'We never compromise on quality, ensuring every project meets the highest standards.',
  },
  {
    icon: Users,
    title: 'Customer First',
    description: 'Your satisfaction is our priority. We listen, understand, and deliver.',
  },
  {
    icon: Clock,
    title: 'Reliability',
    description: 'We show up on time, communicate clearly, and finish when we say we will.',
  },
  {
    icon: CheckCircle,
    title: 'Integrity',
    description: 'Honest pricing, transparent processes, and ethical business practices.',
  },
]

export default function AboutPage() {
  return (
    <>
      <Hero
        title="About ${businessInfo.name}"
        subtitle="Our Story & Values"
        description="${businessInfo.description || `We've been serving our community with dedication and excellence. Learn more about who we are and what drives us.`}"
        showRating={false}
      />

      {/* Story Section */}
      <section className="section-padding bg-white">
        <div className="container-custom">
          <div className="max-w-3xl mx-auto">
            <ScrollReveal>
              <h2 className="heading-2 text-gray-900 mb-6">Our Story</h2>
              <div className="prose prose-lg text-gray-600">
                <p>
                  ${businessInfo.description || `${businessInfo.name} was founded with a simple mission: to provide exceptional ${businessInfo.businessType?.replace(/_/g, ' ')} services that exceed expectations.`}
                </p>
                ${businessInfo.yearsInBusiness ? `<p>
                  With over ${businessInfo.yearsInBusiness} years of experience, we've built a reputation for quality workmanship and outstanding customer service in ${businessInfo.city || 'the area'}.
                </p>` : ''}
                <p>
                  Our team of skilled professionals is dedicated to delivering results that not only meet but exceed your expectations. We believe in doing the job right the first time.
                </p>
              </div>
            </ScrollReveal>
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="section-padding bg-gray-50">
        <div className="container-custom">
          <ScrollReveal>
            <div className="text-center max-w-3xl mx-auto mb-16">
              <span className="text-primary-600 font-semibold text-sm uppercase tracking-wider">
                Our Values
              </span>
              <h2 className="heading-2 text-gray-900 mt-4">
                What We Stand For
              </h2>
            </div>
          </ScrollReveal>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {values.map((value, index) => (
              <ScrollReveal key={value.title} delay={index * 0.1}>
                <div className="text-center">
                  <div className="w-16 h-16 rounded-2xl bg-primary-100 flex items-center justify-center mx-auto mb-4">
                    <value.icon className="w-8 h-8 text-primary-600" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-2">{value.title}</h3>
                  <p className="text-gray-600">{value.description}</p>
                </div>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      <CTA />
    </>
  )
}`
}

function generateServicesPage(businessInfo: BusinessInfo): string {
  const services = businessInfo.services || []

  return `import type { Metadata } from 'next'
import { Hero } from '@/components/sections/hero'
import { CTA } from '@/components/sections/cta'
import { ScrollReveal } from '@/components/animations/scroll-reveal'
import { CheckCircle, ArrowRight } from 'lucide-react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'

export const metadata: Metadata = {
  title: 'Our Services',
  description: 'Explore the professional ${businessInfo.businessType?.replace(/_/g, ' ')} services offered by ${businessInfo.name} in ${businessInfo.city || 'your area'}.',
}

const services = [
  ${services.map(s => `{
    title: '${s}',
    description: 'Professional ${s.toLowerCase()} services tailored to your specific needs. We deliver quality results with attention to detail.',
    features: [
      'Free consultation and estimates',
      'Quality materials and workmanship',
      'Timely project completion',
      'Satisfaction guaranteed',
    ],
  }`).join(',\n  ')}
]

export default function ServicesPage() {
  return (
    <>
      <Hero
        title="Our Services"
        subtitle="Professional Solutions for Your Needs"
        description="We offer a comprehensive range of ${businessInfo.businessType?.replace(/_/g, ' ')} services designed to meet your specific requirements."
        showRating={false}
      />

      {/* Services List */}
      <section className="section-padding bg-white">
        <div className="container-custom">
          <div className="space-y-16">
            {services.map((service, index) => (
              <ScrollReveal key={service.title} delay={index * 0.1}>
                <div className={\`grid lg:grid-cols-2 gap-12 items-center \${index % 2 === 1 ? 'lg:flex-row-reverse' : ''}\`}>
                  <div className={index % 2 === 1 ? 'lg:order-2' : ''}>
                    <h2 className="heading-3 text-gray-900 mb-4">{service.title}</h2>
                    <p className="text-lg text-gray-600 mb-6">{service.description}</p>

                    <ul className="space-y-3 mb-8">
                      {service.features.map((feature) => (
                        <li key={feature} className="flex items-center gap-3">
                          <CheckCircle className="w-5 h-5 text-primary-500 flex-shrink-0" />
                          <span className="text-gray-700">{feature}</span>
                        </li>
                      ))}
                    </ul>

                    <Button asChild>
                      <Link href="/contact">
                        Get a Quote
                        <ArrowRight className="ml-2 w-4 h-4" />
                      </Link>
                    </Button>
                  </div>

                  <div className={index % 2 === 1 ? 'lg:order-1' : ''}>
                    <div className="aspect-[4/3] rounded-2xl bg-gradient-to-br from-primary-100 to-primary-200 flex items-center justify-center">
                      <span className="text-6xl">{['🔧', '⭐', '🏆', '💡', '🛠️', '✨'][index % 6]}</span>
                    </div>
                  </div>
                </div>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      <CTA />
    </>
  )
}`
}

function generateContactPage(businessInfo: BusinessInfo): string {
  const primaryCTA = businessInfo.primaryCTA || 'contact'
  const services = businessInfo.services || []
  const hasCalendly = primaryCTA === 'book' && businessInfo.calendlyUrl
  const isCallCTA = primaryCTA === 'call'
  const isVisitCTA = primaryCTA === 'visit'
  const isQuoteCTA = primaryCTA === 'quote'

  // Generate Google Maps embed URL if address exists
  const mapQuery = encodeURIComponent(
    `${businessInfo.address || ''}, ${businessInfo.city || ''}, ${businessInfo.state || ''} ${businessInfo.zipCode || ''}`
  )

  // Hero title and description based on CTA type
  const heroContent = {
    call: { title: 'Call Us Today', desc: "Speak directly with our team. We're here to help with all your needs." },
    book: { title: 'Book Your Appointment', desc: 'Schedule a convenient time that works for you.' },
    quote: { title: 'Get a Free Quote', desc: "Tell us about your project and we'll provide a detailed estimate." },
    visit: { title: 'Visit Our Location', desc: "Come see us in person. We'd love to meet you!" },
    shop: { title: 'Get In Touch', desc: "Have questions about our products? We're here to help." },
    contact: { title: 'Get In Touch', desc: 'Ready to start your project? Contact us today for a free consultation.' },
  }

  const hero = heroContent[primaryCTA as keyof typeof heroContent] || heroContent.contact

  return `'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { Phone, Mail, MapPin, Clock, Send, PhoneCall } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { ScrollReveal } from '@/components/animations/scroll-reveal'

const contactInfo = [
  ${businessInfo.phone ? `{ icon: Phone, label: 'Phone', value: '${formatPhoneNumber(businessInfo.phone)}', href: 'tel:${businessInfo.phone}' },` : ''}
  ${businessInfo.email ? `{ icon: Mail, label: 'Email', value: '${businessInfo.email}', href: 'mailto:${businessInfo.email}' },` : ''}
  ${businessInfo.address ? `{ icon: MapPin, label: 'Address', value: '${businessInfo.address}, ${businessInfo.city || ''} ${businessInfo.state || ''}', href: 'https://maps.google.com/?q=${mapQuery}' },` : ''}
  { icon: Clock, label: 'Hours', value: 'Mon-Fri: 8am - 6pm', href: '#' },
]

${isQuoteCTA ? `const services = [${services.map(s => `'${s}'`).join(', ')}]` : ''}

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    message: '',
    ${isQuoteCTA ? `service: '',
    projectDetails: '',` : ''}
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSubmitted, setIsSubmitted] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    // Simulate form submission
    await new Promise(resolve => setTimeout(resolve, 1000))

    setIsSubmitting(false)
    setIsSubmitted(true)
    setFormData({ name: '', email: '', phone: '', message: ''${isQuoteCTA ? `, service: '', projectDetails: ''` : ''} })
  }

  return (
    <>
      {/* Hero */}
      <section className="relative pt-32 pb-20 bg-gradient-to-br from-gray-50 via-white to-primary-50">
        <div className="absolute inset-0 bg-hero-pattern opacity-50" />
        <div className="container-custom relative z-10">
          <div className="max-w-3xl">
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="heading-1 text-gray-900 mb-6"
            >
              ${hero.title.split(' ').map((word, i) => i === 0 ? `<span className="gradient-text">${word}</span>` : ` ${word}`).join('')}
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="text-xl text-gray-600"
            >
              ${hero.desc}
            </motion.p>
          </div>
        </div>
      </section>

${isCallCTA && businessInfo.phone ? `
      {/* Call Now Hero Section */}
      <section className="py-16 bg-gradient-to-r from-primary-600 to-primary-700">
        <div className="container-custom">
          <div className="flex flex-col md:flex-row items-center justify-between gap-8">
            <div className="text-center md:text-left">
              <h2 className="text-3xl font-bold text-white mb-2">Ready to Talk?</h2>
              <p className="text-primary-100">Our team is standing by to help you.</p>
            </div>
            <a
              href="tel:${businessInfo.phone}"
              className="inline-flex items-center gap-3 bg-white text-primary-700 px-8 py-4 rounded-full font-bold text-xl hover:bg-primary-50 transition-colors shadow-lg"
            >
              <PhoneCall className="w-6 h-6" />
              ${formatPhoneNumber(businessInfo.phone)}
            </a>
          </div>
        </div>
      </section>
` : ''}

${hasCalendly ? `
      {/* Calendly Embed Section */}
      <section className="section-padding bg-white">
        <div className="container-custom">
          <ScrollReveal>
            <div className="max-w-4xl mx-auto">
              <h2 className="heading-3 text-gray-900 mb-8 text-center">Schedule Your Appointment</h2>
              <div className="rounded-2xl overflow-hidden shadow-xl border border-gray-100">
                <iframe
                  src="${businessInfo.calendlyUrl}"
                  width="100%"
                  height="700"
                  frameBorder="0"
                  title="Schedule Appointment"
                ></iframe>
              </div>
            </div>
          </ScrollReveal>
        </div>
      </section>
` : ''}

${isVisitCTA && businessInfo.address ? `
      {/* Map Section - Prominent for Visit CTA */}
      <section className="section-padding bg-white">
        <div className="container-custom">
          <ScrollReveal>
            <div className="text-center mb-12">
              <h2 className="heading-2 text-gray-900 mb-4">Find Us</h2>
              <p className="text-xl text-gray-600">${businessInfo.address}, ${businessInfo.city || ''} ${businessInfo.state || ''}</p>
              <a
                href="https://maps.google.com/?q=${mapQuery}"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 text-primary-600 font-semibold mt-4 hover:text-primary-700"
              >
                <MapPin className="w-5 h-5" />
                Get Directions
              </a>
            </div>
            <div className="aspect-[16/9] rounded-2xl overflow-hidden shadow-xl">
              <iframe
                src="https://maps.google.com/maps?q=${mapQuery}&t=&z=15&ie=UTF8&iwloc=&output=embed"
                width="100%"
                height="100%"
                style={{ border: 0 }}
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                title="Location Map"
              ></iframe>
            </div>
          </ScrollReveal>
        </div>
      </section>
` : ''}

      {/* Contact Section */}
      <section className="section-padding bg-${isVisitCTA ? 'gray-50' : 'white'}">
        <div className="container-custom">
          <div className="grid lg:grid-cols-2 gap-12">
            {/* Contact Info */}
            <ScrollReveal>
              <div>
                <h2 className="heading-3 text-gray-900 mb-8">Contact Information</h2>

                <div className="space-y-6 mb-12">
                  {contactInfo.map((item) => (
                    <a
                      key={item.label}
                      href={item.href}
                      className="flex items-start gap-4 group"
                      ${businessInfo.address ? `target={item.label === 'Address' ? '_blank' : undefined}
                      rel={item.label === 'Address' ? 'noopener noreferrer' : undefined}` : ''}
                    >
                      <div className="w-12 h-12 rounded-xl bg-primary-100 flex items-center justify-center group-hover:bg-primary-200 transition-colors">
                        <item.icon className="w-5 h-5 text-primary-600" />
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">{item.label}</p>
                        <p className="text-gray-900 font-medium group-hover:text-primary-600 transition-colors">
                          {item.value}
                        </p>
                      </div>
                    </a>
                  ))}
                </div>

                ${!isVisitCTA ? `{/* Map */}
                <div className="aspect-video rounded-2xl overflow-hidden shadow-lg">
                  ${businessInfo.address ? `<iframe
                    src="https://maps.google.com/maps?q=${mapQuery}&t=&z=15&ie=UTF8&iwloc=&output=embed"
                    width="100%"
                    height="100%"
                    style={{ border: 0 }}
                    allowFullScreen
                    loading="lazy"
                    referrerPolicy="no-referrer-when-downgrade"
                    title="Location Map"
                  ></iframe>` : `<div className="w-full h-full bg-gray-100 flex items-center justify-center">
                    <MapPin className="w-8 h-8 text-gray-400" />
                  </div>`}
                </div>` : ''}
              </div>
            </ScrollReveal>

            {/* Contact Form */}
            <ScrollReveal delay={0.2}>
              <div className="bg-gray-50 rounded-2xl p-8">
                <h2 className="heading-3 text-gray-900 mb-6">${isQuoteCTA ? 'Request a Free Quote' : 'Send Us a Message'}</h2>

                {isSubmitted ? (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="text-center py-12"
                  >
                    <div className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-4">
                      <Send className="w-8 h-8 text-green-600" />
                    </div>
                    <h3 className="text-xl font-bold text-gray-900 mb-2">${isQuoteCTA ? 'Quote Request Sent!' : 'Message Sent!'}</h3>
                    <p className="text-gray-600">We'll get back to you as soon as possible.</p>
                  </motion.div>
                ) : (
                  <form onSubmit={handleSubmit} className="space-y-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Name
                      </label>
                      <input
                        type="text"
                        required
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none transition-all"
                        placeholder="Your name"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Email
                      </label>
                      <input
                        type="email"
                        required
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none transition-all"
                        placeholder="your@email.com"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Phone${isQuoteCTA ? '' : ' (Optional)'}
                      </label>
                      <input
                        type="tel"
                        ${isQuoteCTA ? 'required' : ''}
                        value={formData.phone}
                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                        className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none transition-all"
                        placeholder="(555) 123-4567"
                      />
                    </div>

${isQuoteCTA && services.length > 0 ? `
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Service Needed
                      </label>
                      <select
                        required
                        value={formData.service}
                        onChange={(e) => setFormData({ ...formData, service: e.target.value })}
                        className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none transition-all bg-white"
                      >
                        <option value="">Select a service</option>
                        {services.map((service) => (
                          <option key={service} value={service}>{service}</option>
                        ))}
                        <option value="other">Other</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Project Details
                      </label>
                      <textarea
                        required
                        rows={5}
                        value={formData.projectDetails}
                        onChange={(e) => setFormData({ ...formData, projectDetails: e.target.value })}
                        className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none transition-all resize-none"
                        placeholder="Please describe your project, including timeline, budget range, and any specific requirements..."
                      />
                    </div>
` : `
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Message
                      </label>
                      <textarea
                        required
                        rows={5}
                        value={formData.message}
                        onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                        className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none transition-all resize-none"
                        placeholder="Tell us about your project..."
                      />
                    </div>
`}

                    <Button type="submit" size="lg" className="w-full" disabled={isSubmitting}>
                      {isSubmitting ? (
                        <span className="flex items-center gap-2">
                          <motion.span
                            animate={{ rotate: 360 }}
                            transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                            className="w-5 h-5 border-2 border-white border-t-transparent rounded-full"
                          />
                          Sending...
                        </span>
                      ) : (
                        <span className="flex items-center gap-2">
                          ${isQuoteCTA ? 'Request Quote' : 'Send Message'}
                          <Send className="w-5 h-5" />
                        </span>
                      )}
                    </Button>
                  </form>
                )}
              </div>
            </ScrollReveal>
          </div>
        </div>
      </section>
    </>
  )
}`
}

function generateRobotsTxt(slug: string): string {
  return `User-agent: *
Allow: /

Sitemap: https://${slug}.vercel.app/sitemap.xml`
}

function generatePricingComponent(businessInfo: BusinessInfo): string {
  const pricing = businessInfo.pricing || []

  return `'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'
import { Check, Star } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { ScrollReveal } from '@/components/animations/scroll-reveal'

const pricingPlans = [
  ${pricing.map(p => `{
    name: '${p.name}',
    price: '${p.price}',
    description: '${p.description || ''}',
    features: [${p.features.map(f => `'${f}'`).join(', ')}],
    isPopular: ${p.isPopular || false},
  }`).join(',\n  ')}
]

export function Pricing() {
  return (
    <section className="section-padding bg-gray-50">
      <div className="container-custom">
        <ScrollReveal>
          <div className="text-center max-w-3xl mx-auto mb-16">
            <span className="text-primary-600 font-semibold text-sm uppercase tracking-wider">
              Pricing
            </span>
            <h2 className="heading-2 text-gray-900 mt-4 mb-6">
              Simple, Transparent Pricing
            </h2>
            <p className="text-lg text-gray-600">
              Choose the plan that best fits your needs. All plans include our quality guarantee.
            </p>
          </div>
        </ScrollReveal>

        <div className="grid md:grid-cols-2 lg:grid-cols-${Math.min(pricing.length, 3)} gap-8 max-w-5xl mx-auto">
          {pricingPlans.map((plan, index) => (
            <ScrollReveal key={plan.name} delay={index * 0.1}>
              <motion.div
                whileHover={{ y: -8 }}
                className={\`relative bg-white rounded-2xl p-8 shadow-lg \${
                  plan.isPopular
                    ? 'ring-2 ring-primary-500 shadow-primary-100'
                    : 'hover:shadow-xl'
                } transition-all duration-300\`}
              >
                {plan.isPopular && (
                  <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                    <span className="inline-flex items-center gap-1 bg-primary-500 text-white text-sm font-semibold px-4 py-1 rounded-full">
                      <Star className="w-4 h-4 fill-current" />
                      Most Popular
                    </span>
                  </div>
                )}

                <div className="text-center mb-6">
                  <h3 className="text-xl font-bold text-gray-900 mb-2">{plan.name}</h3>
                  <div className="text-4xl font-bold text-gray-900 mb-2">{plan.price}</div>
                  {plan.description && (
                    <p className="text-gray-500 text-sm">{plan.description}</p>
                  )}
                </div>

                <ul className="space-y-3 mb-8">
                  {plan.features.map((feature) => (
                    <li key={feature} className="flex items-start gap-3">
                      <Check className="w-5 h-5 text-primary-500 flex-shrink-0 mt-0.5" />
                      <span className="text-gray-700">{feature}</span>
                    </li>
                  ))}
                </ul>

                <Button
                  className={\`w-full \${plan.isPopular ? '' : 'bg-gray-900 hover:bg-gray-800'}\`}
                  asChild
                >
                  <Link href="/contact">Get Started</Link>
                </Button>
              </motion.div>
            </ScrollReveal>
          ))}
        </div>
      </div>
    </section>
  )
}`
}

function generateShopPage(businessInfo: BusinessInfo): string {
  const products = businessInfo.products || []

  return `import type { Metadata } from 'next'
import { Hero } from '@/components/sections/hero'
import { ScrollReveal } from '@/components/animations/scroll-reveal'
import { ShoppingBag } from 'lucide-react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'

export const metadata: Metadata = {
  title: 'Shop',
  description: 'Browse our products and shop online at ${businessInfo.name}.',
}

const products = [
  ${products.map(p => `{
    name: '${p.name}',
    price: '${p.price}',
    description: '${p.description || ''}',
    image: '${p.image || ''}',
  }`).join(',\n  ')}
]

export default function ShopPage() {
  return (
    <>
      <Hero
        title="Shop Our Products"
        subtitle="Quality Products for You"
        description="Browse our selection of products and find exactly what you need."
        showRating={false}
      />

      <section className="section-padding bg-white">
        <div className="container-custom">
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
            {products.map((product, index) => (
              <ScrollReveal key={product.name} delay={index * 0.1}>
                <div className="group bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300">
                  {/* Product Image */}
                  <div className="aspect-square bg-gray-100 relative overflow-hidden">
                    {product.image ? (
                      <img
                        src={product.image}
                        alt={product.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <ShoppingBag className="w-12 h-12 text-gray-300" />
                      </div>
                    )}
                  </div>

                  {/* Product Info */}
                  <div className="p-6">
                    <h3 className="text-lg font-bold text-gray-900 mb-2">{product.name}</h3>
                    {product.description && (
                      <p className="text-gray-600 text-sm mb-4 line-clamp-2">{product.description}</p>
                    )}
                    <div className="flex items-center justify-between">
                      <span className="text-xl font-bold text-primary-600">{product.price}</span>
                      <Button size="sm" asChild>
                        <Link href="/contact">Buy Now</Link>
                      </Button>
                    </div>
                  </div>
                </div>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>
    </>
  )
}`
}

function generateFAQComponent(businessInfo: BusinessInfo): string {
  const faqs = businessInfo.faqs || []

  return `'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ChevronDown } from 'lucide-react'
import { ScrollReveal } from '@/components/animations/scroll-reveal'

const faqs = [
  ${faqs.map(f => `{
    question: '${f.question}',
    answer: '${f.answer}',
  }`).join(',\n  ')}
]

export function FAQ() {
  const [openIndex, setOpenIndex] = useState<number | null>(0)

  return (
    <section className="section-padding bg-white">
      <div className="container-custom">
        <ScrollReveal>
          <div className="text-center max-w-3xl mx-auto mb-16">
            <span className="text-primary-600 font-semibold text-sm uppercase tracking-wider">
              FAQ
            </span>
            <h2 className="heading-2 text-gray-900 mt-4 mb-6">
              Frequently Asked Questions
            </h2>
            <p className="text-lg text-gray-600">
              Find answers to common questions about our services.
            </p>
          </div>
        </ScrollReveal>

        <div className="max-w-3xl mx-auto space-y-4">
          {faqs.map((faq, index) => (
            <ScrollReveal key={index} delay={index * 0.05}>
              <div
                className="bg-gray-50 rounded-xl overflow-hidden"
              >
                <button
                  onClick={() => setOpenIndex(openIndex === index ? null : index)}
                  className="w-full px-6 py-5 flex items-center justify-between text-left"
                >
                  <span className="font-semibold text-gray-900 pr-4">{faq.question}</span>
                  <motion.div
                    animate={{ rotate: openIndex === index ? 180 : 0 }}
                    transition={{ duration: 0.2 }}
                  >
                    <ChevronDown className="w-5 h-5 text-gray-500" />
                  </motion.div>
                </button>
                <AnimatePresence>
                  {openIndex === index && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.2 }}
                    >
                      <div className="px-6 pb-5 text-gray-600">
                        {faq.answer}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </ScrollReveal>
          ))}
        </div>
      </div>
    </section>
  )
}`
}

// ============================================
// INDUSTRY-SPECIFIC COMPONENTS
// ============================================

function generateMenuPage(businessInfo: BusinessInfo): string {
  const menu = businessInfo.menu
  if (!menu) return ''

  // If PDF menu only
  if (menu.menuPdfUrl && menu.categories.length === 0) {
    return `import { Navbar } from '@/components/ui/navbar'
import { Footer } from '@/components/ui/footer'
import { FileText, ExternalLink } from 'lucide-react'

export const metadata = {
  title: 'Menu | ${businessInfo.name}',
  description: 'View our menu.',
}

export default function MenuPage() {
  return (
    <>
      <Navbar />
      <main className="pt-20">
        <section className="section-padding bg-gray-50">
          <div className="container-custom text-center">
            <h1 className="heading-1 text-gray-900 mb-6">Our Menu</h1>
            <a href="${menu.menuPdfUrl}" target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-3 px-8 py-4 bg-primary-600 text-white rounded-xl hover:bg-primary-700 transition-colors text-lg font-semibold">
              <FileText className="w-6 h-6" /> View PDF Menu <ExternalLink className="w-5 h-5" />
            </a>
          </div>
        </section>
      </main>
      <Footer />
    </>
  )
}`
  }

  const categoriesCode = menu.categories.map(cat => {
    const itemsCode = cat.items.map(item => {
      const dietaryArr = (item.dietary || []).map(d => `'${d}'`).join(', ')
      return `{ id: '${item.id}', name: '${escapeJs(item.name)}', description: '${escapeJs(item.description || '')}', price: '${escapeJs(item.price)}', dietary: [${dietaryArr}], isPopular: ${item.isPopular || false} }`
    }).join(',\n        ')
    return `{ id: '${cat.id}', name: '${escapeJs(cat.name)}', description: '${escapeJs(cat.description || '')}', items: [\n        ${itemsCode}\n      ] }`
  }).join(',\n    ')

  const priceDisplay = menu.showPrices ? '<span className="text-primary-600 font-bold text-lg">{item.price}</span>' : ''
  const noteSection = menu.note ? `<section className="pb-16"><div className="container-custom"><p className="text-center text-gray-500 text-sm">${escapeJs(menu.note)}</p></div></section>` : ''

  return `'use client'

import { useState } from 'react'
import { Navbar } from '@/components/ui/navbar'
import { Footer } from '@/components/ui/footer'
import { motion } from 'framer-motion'
import { Star } from 'lucide-react'
import { ScrollReveal } from '@/components/animations/scroll-reveal'

const menuCategories = [
    ${categoriesCode}
  ]

const dietaryIcons: Record<string, { icon: string; label: string }> = {
  'vegetarian': { icon: '🥬', label: 'Vegetarian' },
  'vegan': { icon: '🌱', label: 'Vegan' },
  'gluten-free': { icon: '🌾', label: 'Gluten-Free' },
  'dairy-free': { icon: '🥛', label: 'Dairy-Free' },
  'nut-free': { icon: '🥜', label: 'Nut-Free' },
  'spicy': { icon: '🌶️', label: 'Spicy' },
}

export default function MenuPage() {
  const [activeCategory, setActiveCategory] = useState(menuCategories[0]?.id || '')

  return (
    <>
      <Navbar />
      <main className="pt-20">
        <section className="section-padding bg-gray-50">
          <div className="container-custom text-center">
            <ScrollReveal>
              <span className="text-primary-600 font-semibold text-sm uppercase tracking-wider">Our Menu</span>
              <h1 className="heading-1 text-gray-900 mt-4 mb-6">Delicious Offerings</h1>
            </ScrollReveal>
          </div>
        </section>

        <section className="sticky top-20 z-40 bg-white border-b border-gray-200 shadow-sm">
          <div className="container-custom">
            <div className="flex gap-2 overflow-x-auto py-4">
              {menuCategories.map((category) => (
                <button key={category.id} onClick={() => setActiveCategory(category.id)}
                  className={\`px-6 py-3 rounded-full font-medium whitespace-nowrap transition-all \${activeCategory === category.id ? 'bg-primary-600 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}\`}>
                  {category.name}
                </button>
              ))}
            </div>
          </div>
        </section>

        <section className="section-padding">
          <div className="container-custom">
            {menuCategories.map((category) => (
              <motion.div key={category.id} initial={{ opacity: 0 }}
                animate={{ opacity: activeCategory === category.id ? 1 : 0, display: activeCategory === category.id ? 'block' : 'none' }}>
                <div className="grid md:grid-cols-2 gap-6">
                  {category.items.map((item, index) => (
                    <ScrollReveal key={item.id} delay={index * 0.05}>
                      <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
                        <div className="flex justify-between items-start gap-4">
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-2">
                              <h3 className="font-semibold text-lg text-gray-900">{item.name}</h3>
                              {item.isPopular && <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-amber-100 text-amber-700 text-xs font-medium rounded-full"><Star className="w-3 h-3" /> Popular</span>}
                            </div>
                            {item.description && <p className="text-gray-600 text-sm mb-3">{item.description}</p>}
                            {item.dietary?.length > 0 && (
                              <div className="flex flex-wrap gap-1">
                                {item.dietary.map((d) => (<span key={d} className="px-2 py-0.5 bg-gray-100 text-gray-600 text-xs rounded-full">{dietaryIcons[d]?.icon} {dietaryIcons[d]?.label}</span>))}
                              </div>
                            )}
                          </div>
                          ${priceDisplay}
                        </div>
                      </div>
                    </ScrollReveal>
                  ))}
                </div>
              </motion.div>
            ))}
          </div>
        </section>
        ${noteSection}
      </main>
      <Footer />
    </>
  )
}`
}

function generateBookingComponent(businessInfo: BusinessInfo): string {
  const booking = businessInfo.booking
  if (!booking || !booking.enabled) return ''

  const servicesCode = (booking.services || []).map(s =>
    `{ id: '${s.id}', name: '${escapeJs(s.name)}', duration: '${escapeJs(s.duration)}', price: '${escapeJs(s.price)}', description: '${escapeJs(s.description || '')}' }`
  ).join(',\n    ')

  const walkinsText = booking.acceptWalkins ? ' Walk-ins welcome!' : ''
  const servicesSection = (booking.services || []).length > 0 ? `<div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          {services.map((service, index) => (
            <ScrollReveal key={service.id} delay={index * 0.1}>
              <div className="bg-white rounded-xl p-6 shadow-sm">
                <h3 className="font-semibold text-lg text-gray-900 mb-2">{service.name}</h3>
                {service.description && <p className="text-gray-600 text-sm mb-4">{service.description}</p>}
                <div className="flex items-center justify-between text-sm">
                  <span className="flex items-center gap-1 text-gray-500"><Clock className="w-4 h-4" /> {service.duration}</span>
                  <span className="text-primary-600 font-semibold">{service.price}</span>
                </div>
              </div>
            </ScrollReveal>
          ))}
        </div>` : ''

  const bookButton = booking.bookingUrl ? `<div className="text-center">
          <a href="${booking.bookingUrl}" target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 px-8 py-4 bg-primary-600 text-white rounded-xl hover:bg-primary-700 transition-colors text-lg font-semibold">
            <Calendar className="w-5 h-5" /> Book Appointment <ExternalLink className="w-4 h-4" />
          </a>
        </div>` : ''

  const depositText = booking.requireDeposit && booking.depositAmount ? `<p>Deposit of ${escapeJs(booking.depositAmount)} required.</p>` : ''
  const policyText = booking.cancellationPolicy ? `<p>${escapeJs(booking.cancellationPolicy)}</p>` : ''

  return `'use client'

import { Calendar, Clock, ExternalLink } from 'lucide-react'
import { ScrollReveal } from '@/components/animations/scroll-reveal'

const services = [
    ${servicesCode}
  ]

export function BookingSection() {
  return (
    <section className="section-padding bg-primary-50">
      <div className="container-custom">
        <ScrollReveal>
          <div className="text-center max-w-3xl mx-auto mb-12">
            <span className="text-primary-600 font-semibold text-sm uppercase tracking-wider">Book Now</span>
            <h2 className="heading-2 text-gray-900 mt-4 mb-6">Schedule Your Appointment</h2>
            <p className="text-lg text-gray-600">Choose from our services.${walkinsText}</p>
          </div>
        </ScrollReveal>
        ${servicesSection}
        ${bookButton}
        <div className="mt-12 text-center text-sm text-gray-500 space-y-2">
          ${depositText}
          ${policyText}
        </div>
      </div>
    </section>
  )
}`
}

function generateMedicalComponent(businessInfo: BusinessInfo): string {
  const medical = businessInfo.medical
  if (!medical) return ''

  const insuranceArr = medical.insuranceAccepted.map(i => `'${escapeJs(i)}'`).join(', ')
  const credentialsArr = (medical.credentials || []).map(c => `'${escapeJs(c)}'`).join(', ')
  const hospitalsArr = (medical.hospitalAffiliations || []).map(h => `'${escapeJs(h)}'`).join(', ')
  const languagesArr = (medical.languages || []).map(l => `'${escapeJs(l)}'`).join(', ')

  const newPatientsCard = medical.acceptingNewPatients ? `<ScrollReveal delay={0.1}>
            <div className="bg-green-50 rounded-xl p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2 bg-green-100 rounded-lg"><CheckCircle className="w-6 h-6 text-green-600" /></div>
                <h3 className="font-semibold text-lg text-gray-900">Accepting New Patients</h3>
              </div>
              <p className="text-gray-600">We welcome new patients.</p>
            </div>
          </ScrollReveal>` : ''

  const telehealthCard = medical.telehealth ? `<ScrollReveal delay={0.2}>
            <div className="bg-blue-50 rounded-xl p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2 bg-blue-100 rounded-lg"><Video className="w-6 h-6 text-blue-600" /></div>
                <h3 className="font-semibold text-lg text-gray-900">Telehealth Available</h3>
              </div>
              <p className="text-gray-600">Virtual appointments available.</p>
            </div>
          </ScrollReveal>` : ''

  const languagesCard = (medical.languages || []).length > 0 ? `<ScrollReveal delay={0.3}>
            <div className="bg-purple-50 rounded-xl p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2 bg-purple-100 rounded-lg"><Globe className="w-6 h-6 text-purple-600" /></div>
                <h3 className="font-semibold text-lg text-gray-900">Languages</h3>
              </div>
              <div className="flex flex-wrap gap-2">
                {medicalInfo.languages.map((l) => (<span key={l} className="px-3 py-1 bg-white rounded-full text-sm">{l}</span>))}
              </div>
            </div>
          </ScrollReveal>` : ''

  const credentialsCard = (medical.credentials || []).length > 0 ? `<ScrollReveal delay={0.4}>
            <div className="bg-gray-50 rounded-xl p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2 bg-gray-200 rounded-lg"><Stethoscope className="w-6 h-6 text-gray-600" /></div>
                <h3 className="font-semibold text-lg text-gray-900">Credentials</h3>
              </div>
              <div className="flex flex-wrap gap-2">
                {medicalInfo.credentials.map((c) => (<span key={c} className="px-3 py-1 bg-white rounded-full text-sm border">{c}</span>))}
              </div>
            </div>
          </ScrollReveal>` : ''

  const hospitalsCard = (medical.hospitalAffiliations || []).length > 0 ? `<ScrollReveal delay={0.5}>
            <div className="bg-gray-50 rounded-xl p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2 bg-gray-200 rounded-lg"><Building2 className="w-6 h-6 text-gray-600" /></div>
                <h3 className="font-semibold text-lg text-gray-900">Hospital Affiliations</h3>
              </div>
              <ul className="space-y-2">
                {medicalInfo.hospitalAffiliations.map((h) => (<li key={h} className="flex items-center gap-2 text-gray-600"><CheckCircle className="w-4 h-4 text-primary-500" />{h}</li>))}
              </ul>
            </div>
          </ScrollReveal>` : ''

  const insuranceSection = medical.insuranceAccepted.length > 0 ? `<ScrollReveal delay={0.6}>
          <div className="mt-12 bg-gray-50 rounded-xl p-8">
            <div className="flex items-center gap-3 mb-6">
              <Shield className="w-6 h-6 text-primary-600" />
              <h3 className="font-semibold text-xl text-gray-900">Insurance Accepted</h3>
            </div>
            <div className="flex flex-wrap gap-3">
              {medicalInfo.insuranceAccepted.map((ins) => (<span key={ins} className="px-4 py-2 bg-white rounded-lg text-gray-700 border">{ins}</span>))}
            </div>
          </div>
        </ScrollReveal>` : ''

  const portalSection = medical.patientPortalUrl ? `<div className="mt-8 text-center">
          <a href="${medical.patientPortalUrl}" target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 px-6 py-3 bg-primary-600 text-white rounded-xl hover:bg-primary-700">
            Patient Portal <ExternalLink className="w-4 h-4" />
          </a>
        </div>` : ''

  const emergencySection = medical.emergencyNotice ? `<div className="mt-12 bg-amber-50 border border-amber-200 rounded-xl p-6">
          <div className="flex items-start gap-3">
            <AlertTriangle className="w-6 h-6 text-amber-600 flex-shrink-0" />
            <div>
              <h4 className="font-semibold text-amber-800 mb-1">Important</h4>
              <p className="text-amber-700">${escapeJs(medical.emergencyNotice)}</p>
            </div>
          </div>
        </div>` : ''

  return `'use client'

import { CheckCircle, Shield, Globe, Video, Building2, AlertTriangle, Stethoscope, ExternalLink } from 'lucide-react'
import { ScrollReveal } from '@/components/animations/scroll-reveal'

const medicalInfo = {
  acceptingNewPatients: ${medical.acceptingNewPatients},
  insuranceAccepted: [${insuranceArr}],
  credentials: [${credentialsArr}],
  hospitalAffiliations: [${hospitalsArr}],
  languages: [${languagesArr}],
  telehealth: ${medical.telehealth},
}

export function MedicalInfo() {
  return (
    <section className="section-padding bg-white">
      <div className="container-custom">
        <ScrollReveal>
          <div className="text-center max-w-3xl mx-auto mb-12">
            <span className="text-primary-600 font-semibold text-sm uppercase tracking-wider">Practice Information</span>
            <h2 className="heading-2 text-gray-900 mt-4 mb-6">About Our Practice</h2>
          </div>
        </ScrollReveal>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          ${newPatientsCard}
          ${telehealthCard}
          ${languagesCard}
          ${credentialsCard}
          ${hospitalsCard}
        </div>

        ${insuranceSection}
        ${portalSection}
        ${emergencySection}
      </div>
    </section>
  )
}`
}
