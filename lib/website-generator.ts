import { BusinessInfo } from './types'
import { generateJsonLd, generateSEOConfig, generatePageTitle, generateMetaDescription } from './seo'
import { slugify, getBusinessTypeName, formatPhoneNumber } from './utils'

// Generate a complete Next.js website for a business
export function generateWebsiteCode(businessInfo: BusinessInfo): Record<string, string> {
  const files: Record<string, string> = {}

  // Package.json
  files['package.json'] = generatePackageJson(businessInfo)

  // Next.js config
  files['next.config.js'] = generateNextConfig()

  // Tailwind config
  files['tailwind.config.ts'] = generateTailwindConfig()

  // App files
  files['app/layout.tsx'] = generateRootLayout(businessInfo)
  files['app/globals.css'] = generateGlobalStyles()
  files['app/page.tsx'] = generateHomePage(businessInfo)
  files['app/about/page.tsx'] = generateAboutPage(businessInfo)
  files['app/services/page.tsx'] = generateServicesPage(businessInfo)
  files['app/contact/page.tsx'] = generateContactPage(businessInfo)

  // Components
  files['components/Navbar.tsx'] = generateNavbar(businessInfo)
  files['components/Footer.tsx'] = generateFooter(businessInfo)
  files['components/Hero.tsx'] = generateHero(businessInfo)
  files['components/Services.tsx'] = generateServicesSection(businessInfo)
  files['components/Testimonials.tsx'] = generateTestimonialsSection(businessInfo)
  files['components/Portfolio.tsx'] = generatePortfolioSection(businessInfo)
  files['components/Contact.tsx'] = generateContactSection(businessInfo)
  files['components/CTA.tsx'] = generateCTASection(businessInfo)

  // Public files
  files['public/robots.txt'] = generateRobotsTxt(businessInfo)

  // Config files
  files['tsconfig.json'] = generateTsConfig()
  files['postcss.config.js'] = 'module.exports = { plugins: { tailwindcss: {}, autoprefixer: {} } }'

  return files
}

function generatePackageJson(businessInfo: BusinessInfo): string {
  const slug = slugify(businessInfo.name)
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
      react: '^18',
      'react-dom': '^18',
      'framer-motion': '^11.0.0',
      'lucide-react': '^0.400.0',
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
  images: {
    remotePatterns: [
      { protocol: 'https', hostname: '**' },
    ],
  },
}
module.exports = nextConfig`
}

function generateTailwindConfig(): string {
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
          50: '#f0f9ff',
          100: '#e0f2fe',
          200: '#bae6fd',
          300: '#7dd3fc',
          400: '#38bdf8',
          500: '#0ea5e9',
          600: '#0284c7',
          700: '#0369a1',
          800: '#075985',
          900: '#0c4a6e',
        },
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
      paths: { '@/*': ['./*'] },
    },
    include: ['next-env.d.ts', '**/*.ts', '**/*.tsx', '.next/types/**/*.ts'],
    exclude: ['node_modules'],
  }, null, 2)
}

function generateRootLayout(businessInfo: BusinessInfo): string {
  const seoConfig = generateSEOConfig(businessInfo, '')
  const jsonLd = generateJsonLd(businessInfo, '')

  return `import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: '${seoConfig.title}',
  description: '${seoConfig.description}',
  keywords: ${JSON.stringify(seoConfig.keywords)},
  openGraph: {
    title: '${seoConfig.title}',
    description: '${seoConfig.description}',
    type: 'website',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: \`${jsonLd}\` }}
        />
      </head>
      <body className={inter.className}>
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
  html {
    scroll-behavior: smooth;
  }
}

@layer components {
  .btn-primary {
    @apply bg-primary-600 text-white px-6 py-3 rounded-lg font-medium transition-all hover:bg-primary-700 hover:shadow-lg;
  }

  .btn-secondary {
    @apply border-2 border-primary-600 text-primary-600 px-6 py-3 rounded-lg font-medium transition-all hover:bg-primary-50;
  }

  .section-padding {
    @apply py-16 md:py-24 px-4 md:px-8;
  }

  .container-custom {
    @apply max-w-7xl mx-auto;
  }
}`
}

function generateNavbar(businessInfo: BusinessInfo): string {
  return `'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Menu, X, Phone } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false)

  const links = [
    { href: '/', label: 'Home' },
    { href: '/about', label: 'About' },
    { href: '/services', label: 'Services' },
    { href: '/contact', label: 'Contact' },
  ]

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-white/90 backdrop-blur-md border-b border-gray-100">
      <nav className="container-custom flex items-center justify-between h-20 px-4">
        <Link href="/" className="text-2xl font-bold text-gray-900">
          ${businessInfo.name}
        </Link>

        {/* Desktop Nav */}
        <div className="hidden md:flex items-center gap-8">
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="text-gray-600 hover:text-primary-600 transition-colors font-medium"
            >
              {link.label}
            </Link>
          ))}
          <a href="tel:${businessInfo.phone}" className="btn-primary flex items-center gap-2">
            <Phone size={18} />
            ${formatPhoneNumber(businessInfo.phone)}
          </a>
        </div>

        {/* Mobile menu button */}
        <button
          className="md:hidden p-2"
          onClick={() => setIsOpen(!isOpen)}
          aria-label="Toggle menu"
        >
          {isOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </nav>

      {/* Mobile Nav */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden bg-white border-b border-gray-100"
          >
            <div className="container-custom py-4 px-4 flex flex-col gap-4">
              {links.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="text-gray-600 hover:text-primary-600 transition-colors font-medium py-2"
                  onClick={() => setIsOpen(false)}
                >
                  {link.label}
                </Link>
              ))}
              <a href="tel:${businessInfo.phone}" className="btn-primary text-center">
                Call Now
              </a>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  )
}`
}

function generateFooter(businessInfo: BusinessInfo): string {
  return `import Link from 'next/link'
import { MapPin, Phone, Mail, Clock } from 'lucide-react'

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-white">
      <div className="container-custom section-padding">
        <div className="grid md:grid-cols-4 gap-12">
          {/* Brand */}
          <div className="md:col-span-2">
            <h3 className="text-2xl font-bold mb-4">${businessInfo.name}</h3>
            <p className="text-gray-400 mb-6 max-w-md">
              ${businessInfo.tagline || `Providing quality ${getBusinessTypeName(businessInfo.businessType).toLowerCase()} services in ${businessInfo.city} and surrounding areas.`}
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-semibold text-lg mb-4">Quick Links</h4>
            <ul className="space-y-2">
              <li><Link href="/" className="text-gray-400 hover:text-white transition-colors">Home</Link></li>
              <li><Link href="/about" className="text-gray-400 hover:text-white transition-colors">About Us</Link></li>
              <li><Link href="/services" className="text-gray-400 hover:text-white transition-colors">Services</Link></li>
              <li><Link href="/contact" className="text-gray-400 hover:text-white transition-colors">Contact</Link></li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="font-semibold text-lg mb-4">Contact</h4>
            <ul className="space-y-3">
              <li className="flex items-start gap-3 text-gray-400">
                <MapPin size={20} className="flex-shrink-0 mt-1" />
                <span>${businessInfo.address}<br />${businessInfo.city}, ${businessInfo.state} ${businessInfo.zipCode}</span>
              </li>
              <li className="flex items-center gap-3 text-gray-400">
                <Phone size={20} />
                <a href="tel:${businessInfo.phone}" className="hover:text-white transition-colors">
                  ${formatPhoneNumber(businessInfo.phone)}
                </a>
              </li>
              <li className="flex items-center gap-3 text-gray-400">
                <Mail size={20} />
                <a href="mailto:${businessInfo.email}" className="hover:text-white transition-colors">
                  ${businessInfo.email}
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-12 pt-8 text-center text-gray-500">
          <p>&copy; {new Date().getFullYear()} ${businessInfo.name}. All rights reserved.</p>
        </div>
      </div>
    </footer>
  )
}`
}

function generateHero(businessInfo: BusinessInfo): string {
  const typeName = getBusinessTypeName(businessInfo.businessType)

  return `'use client'

import { motion } from 'framer-motion'
import { ArrowRight, Phone } from 'lucide-react'
import Link from 'next/link'

export default function Hero() {
  return (
    <section className="relative min-h-screen flex items-center pt-20 bg-gradient-to-br from-gray-50 to-white">
      {/* Background decoration */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 right-0 w-96 h-96 bg-primary-100 rounded-full blur-3xl opacity-50" />
        <div className="absolute bottom-0 left-0 w-80 h-80 bg-primary-50 rounded-full blur-3xl opacity-50" />
      </div>

      <div className="container-custom relative z-10 px-4">
        <div className="max-w-4xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <span className="inline-block px-4 py-2 bg-primary-100 text-primary-700 rounded-full text-sm font-medium mb-6">
              Trusted ${typeName} in ${businessInfo.city}
            </span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-5xl md:text-7xl font-bold text-gray-900 mb-6 leading-tight"
          >
            ${businessInfo.name}
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-xl text-gray-600 mb-8 max-w-2xl"
          >
            ${businessInfo.tagline || `Professional ${typeName.toLowerCase()} services in ${businessInfo.city}, ${businessInfo.state}. ${businessInfo.yearsInBusiness > 0 ? `Serving our community for over ${businessInfo.yearsInBusiness} years.` : ''}`}
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="flex flex-col sm:flex-row gap-4"
          >
            <Link href="/contact" className="btn-primary flex items-center justify-center gap-2">
              Get a Free Quote
              <ArrowRight size={18} />
            </Link>
            <a href="tel:${businessInfo.phone}" className="btn-secondary flex items-center justify-center gap-2">
              <Phone size={18} />
              Call Us Now
            </a>
          </motion.div>
        </div>
      </div>
    </section>
  )
}`
}

function generateServicesSection(businessInfo: BusinessInfo): string {
  const services = businessInfo.services.length > 0 ? businessInfo.services : ['Quality Service', 'Professional Work', 'Customer Satisfaction']

  return `'use client'

import { motion } from 'framer-motion'
import { CheckCircle } from 'lucide-react'

const services = ${JSON.stringify(services)}

export default function Services() {
  return (
    <section id="services" className="section-padding bg-white">
      <div className="container-custom">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl font-bold text-gray-900 mb-4">Our Services</h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            We provide a wide range of professional services to meet your needs.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {services.map((service, index) => (
            <motion.div
              key={service}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className="bg-gray-50 rounded-2xl p-8 hover:shadow-xl transition-shadow"
            >
              <div className="w-12 h-12 bg-primary-100 rounded-xl flex items-center justify-center mb-6">
                <CheckCircle className="text-primary-600" size={24} />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">{service}</h3>
              <p className="text-gray-600">
                Professional {service.toLowerCase()} services tailored to your specific needs and requirements.
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}`
}

function generateTestimonialsSection(businessInfo: BusinessInfo): string {
  const testimonials = businessInfo.testimonials.length > 0
    ? businessInfo.testimonials
    : [{
        author: 'Happy Customer',
        content: 'Excellent service and professional team. Highly recommended!',
        rating: 5,
        role: 'Verified Customer',
      }]

  return `'use client'

import { motion } from 'framer-motion'
import { Star, Quote } from 'lucide-react'

const testimonials = ${JSON.stringify(testimonials)}

export default function Testimonials() {
  return (
    <section className="section-padding bg-gray-50">
      <div className="container-custom">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl font-bold text-gray-900 mb-4">What Our Customers Say</h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Don't just take our word for it - hear from our satisfied customers.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className="bg-white rounded-2xl p-8 shadow-lg"
            >
              <Quote className="text-primary-200 mb-4" size={40} />
              <div className="flex gap-1 mb-4">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    size={20}
                    className={i < testimonial.rating ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'}
                  />
                ))}
              </div>
              <p className="text-gray-700 mb-6 italic">"{testimonial.content}"</p>
              <div>
                <p className="font-semibold text-gray-900">{testimonial.author}</p>
                {testimonial.role && (
                  <p className="text-sm text-gray-500">{testimonial.role}</p>
                )}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}`
}

function generatePortfolioSection(businessInfo: BusinessInfo): string {
  if (businessInfo.portfolioSections.length === 0) {
    return `export default function Portfolio() {
  return null
}`
  }

  return `'use client'

import { motion } from 'framer-motion'
import Image from 'next/image'

const portfolioSections = ${JSON.stringify(businessInfo.portfolioSections)}

export default function Portfolio() {
  return (
    <section className="section-padding bg-white">
      <div className="container-custom">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl font-bold text-gray-900 mb-4">Our Work</h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Browse through our portfolio of completed projects.
          </p>
        </motion.div>

        {portfolioSections.map((section, sectionIndex) => (
          <div key={section.id} className="mb-16 last:mb-0">
            <h3 className="text-2xl font-semibold text-gray-900 mb-8">{section.title}</h3>
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {section.images.map((image, imageIndex) => (
                <motion.div
                  key={image.id}
                  initial={{ opacity: 0, scale: 0.9 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: imageIndex * 0.05 }}
                  className="relative aspect-square rounded-xl overflow-hidden group"
                >
                  <Image
                    src={image.url}
                    alt={image.alt}
                    fill
                    className="object-cover transition-transform duration-300 group-hover:scale-110"
                  />
                </motion.div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}`
}

function generateContactSection(businessInfo: BusinessInfo): string {
  return `'use client'

import { motion } from 'framer-motion'
import { MapPin, Phone, Mail, Clock } from 'lucide-react'

export default function Contact() {
  return (
    <section id="contact" className="section-padding bg-gray-50">
      <div className="container-custom">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl font-bold text-gray-900 mb-4">Contact Us</h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Ready to get started? Reach out to us today!
          </p>
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-12">
          {/* Contact Info */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
          >
            <h3 className="text-2xl font-semibold text-gray-900 mb-6">Get in Touch</h3>
            <div className="space-y-6">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-primary-100 rounded-xl flex items-center justify-center flex-shrink-0">
                  <MapPin className="text-primary-600" size={24} />
                </div>
                <div>
                  <h4 className="font-medium text-gray-900">Address</h4>
                  <p className="text-gray-600">${businessInfo.address}<br />${businessInfo.city}, ${businessInfo.state} ${businessInfo.zipCode}</p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-primary-100 rounded-xl flex items-center justify-center flex-shrink-0">
                  <Phone className="text-primary-600" size={24} />
                </div>
                <div>
                  <h4 className="font-medium text-gray-900">Phone</h4>
                  <a href="tel:${businessInfo.phone}" className="text-primary-600 hover:underline">
                    ${formatPhoneNumber(businessInfo.phone)}
                  </a>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-primary-100 rounded-xl flex items-center justify-center flex-shrink-0">
                  <Mail className="text-primary-600" size={24} />
                </div>
                <div>
                  <h4 className="font-medium text-gray-900">Email</h4>
                  <a href="mailto:${businessInfo.email}" className="text-primary-600 hover:underline">
                    ${businessInfo.email}
                  </a>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Contact Form */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
          >
            <form className="bg-white rounded-2xl p-8 shadow-lg">
              <div className="grid sm:grid-cols-2 gap-4 mb-4">
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">Name</label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:border-primary-500"
                    required
                  />
                </div>
                <div>
                  <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-2">Phone</label>
                  <input
                    type="tel"
                    id="phone"
                    name="phone"
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:border-primary-500"
                  />
                </div>
              </div>
              <div className="mb-4">
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">Email</label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:border-primary-500"
                  required
                />
              </div>
              <div className="mb-6">
                <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-2">Message</label>
                <textarea
                  id="message"
                  name="message"
                  rows={4}
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:border-primary-500 resize-none"
                  required
                />
              </div>
              <button type="submit" className="btn-primary w-full">
                Send Message
              </button>
            </form>
          </motion.div>
        </div>
      </div>
    </section>
  )
}`
}

function generateCTASection(businessInfo: BusinessInfo): string {
  return `'use client'

import { motion } from 'framer-motion'
import { Phone, ArrowRight } from 'lucide-react'
import Link from 'next/link'

export default function CTA() {
  return (
    <section className="section-padding bg-primary-600">
      <div className="container-custom text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <h2 className="text-4xl font-bold text-white mb-4">
            Ready to Get Started?
          </h2>
          <p className="text-xl text-primary-100 mb-8 max-w-2xl mx-auto">
            Contact us today for a free consultation and estimate.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href="tel:${businessInfo.phone}"
              className="bg-white text-primary-600 px-8 py-4 rounded-xl font-semibold flex items-center justify-center gap-2 hover:bg-primary-50 transition-colors"
            >
              <Phone size={20} />
              Call Now
            </a>
            <Link
              href="/contact"
              className="border-2 border-white text-white px-8 py-4 rounded-xl font-semibold flex items-center justify-center gap-2 hover:bg-primary-700 transition-colors"
            >
              Contact Us
              <ArrowRight size={20} />
            </Link>
          </div>
        </motion.div>
      </div>
    </section>
  )
}`
}

function generateHomePage(businessInfo: BusinessInfo): string {
  return `import Hero from '@/components/Hero'
import Services from '@/components/Services'
import Testimonials from '@/components/Testimonials'
import Portfolio from '@/components/Portfolio'
import CTA from '@/components/CTA'

export default function Home() {
  return (
    <>
      <Hero />
      <Services />
      ${businessInfo.portfolioSections.length > 0 ? '<Portfolio />' : ''}
      <Testimonials />
      <CTA />
    </>
  )
}`
}

function generateAboutPage(businessInfo: BusinessInfo): string {
  const typeName = getBusinessTypeName(businessInfo.businessType)

  return `import { Metadata } from 'next'
import { motion } from 'framer-motion'

export const metadata: Metadata = {
  title: 'About Us | ${businessInfo.name}',
  description: 'Learn more about ${businessInfo.name}, your trusted ${typeName.toLowerCase()} in ${businessInfo.city}, ${businessInfo.state}.',
}

export default function AboutPage() {
  return (
    <div className="pt-20">
      <section className="section-padding bg-gradient-to-br from-gray-50 to-white">
        <div className="container-custom">
          <div className="max-w-4xl mx-auto">
            <h1 className="text-5xl font-bold text-gray-900 mb-6">About Us</h1>
            <p className="text-xl text-gray-600 leading-relaxed mb-8">
              ${businessInfo.description || `${businessInfo.name} has been proudly serving ${businessInfo.city} and the surrounding areas${businessInfo.yearsInBusiness > 0 ? ` for over ${businessInfo.yearsInBusiness} years` : ''}. We are committed to providing exceptional ${typeName.toLowerCase()} services with a focus on quality, reliability, and customer satisfaction.`}
            </p>
            ${businessInfo.yearsInBusiness > 0 ? `
            <div className="grid sm:grid-cols-3 gap-8 mt-12">
              <div className="text-center">
                <p className="text-5xl font-bold text-primary-600 mb-2">${businessInfo.yearsInBusiness}+</p>
                <p className="text-gray-600">Years of Experience</p>
              </div>
              <div className="text-center">
                <p className="text-5xl font-bold text-primary-600 mb-2">500+</p>
                <p className="text-gray-600">Happy Customers</p>
              </div>
              <div className="text-center">
                <p className="text-5xl font-bold text-primary-600 mb-2">100%</p>
                <p className="text-gray-600">Satisfaction Rate</p>
              </div>
            </div>
            ` : ''}
          </div>
        </div>
      </section>
    </div>
  )
}`
}

function generateServicesPage(businessInfo: BusinessInfo): string {
  const typeName = getBusinessTypeName(businessInfo.businessType)

  return `import { Metadata } from 'next'
import Services from '@/components/Services'
import CTA from '@/components/CTA'

export const metadata: Metadata = {
  title: 'Our Services | ${businessInfo.name}',
  description: 'Explore our professional ${typeName.toLowerCase()} services in ${businessInfo.city}, ${businessInfo.state}. Quality work and customer satisfaction guaranteed.',
}

export default function ServicesPage() {
  return (
    <div className="pt-20">
      <section className="section-padding bg-gradient-to-br from-gray-50 to-white">
        <div className="container-custom">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-5xl font-bold text-gray-900 mb-6">Our Services</h1>
            <p className="text-xl text-gray-600">
              We offer a comprehensive range of ${typeName.toLowerCase()} services tailored to meet your specific needs.
            </p>
          </div>
        </div>
      </section>
      <Services />
      <CTA />
    </div>
  )
}`
}

function generateContactPage(businessInfo: BusinessInfo): string {
  return `import { Metadata } from 'next'
import Contact from '@/components/Contact'

export const metadata: Metadata = {
  title: 'Contact Us | ${businessInfo.name}',
  description: 'Get in touch with ${businessInfo.name} in ${businessInfo.city}, ${businessInfo.state}. Request a free quote or consultation today.',
}

export default function ContactPage() {
  return (
    <div className="pt-20">
      <Contact />
    </div>
  )
}`
}

function generateRobotsTxt(businessInfo: BusinessInfo): string {
  return `User-agent: *
Allow: /

# Sitemap
Sitemap: https://${slugify(businessInfo.name)}.netlify.app/sitemap.xml`
}
