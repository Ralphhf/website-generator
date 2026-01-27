import { NextRequest, NextResponse } from 'next/server'
import { BusinessInfo, PortfolioSection } from '@/lib/types'
import * as fs from 'fs'
import * as path from 'path'
import archiver from 'archiver'
import { Writable } from 'stream'
import { WEBSITE_DESIGN_PROMPT } from '@/lib/website-design-prompt'
import { WEBSITE_DESIGN_PROMPT_CLASSIC } from '@/lib/website-design-prompt-classic'

type WebsiteStyle = 'modern' | 'classic'

async function downloadImage(url: string, filepath: string): Promise<boolean> {
  try {
    // Skip blob URLs - they can't be downloaded server-side
    if (url.startsWith('blob:')) {
      return false
    }
    const response = await fetch(url)
    if (!response.ok) return false
    const buffer = await response.arrayBuffer()
    fs.writeFileSync(filepath, Buffer.from(buffer))
    return true
  } catch (error) {
    console.error(`Failed to download image: ${url}`, error)
    return false
  }
}

// Save base64 data URL to file
function saveBase64Image(dataUrl: string, filepath: string): boolean {
  try {
    // Extract base64 data from data URL (format: data:image/jpeg;base64,/9j/4AAQ...)
    const matches = dataUrl.match(/^data:image\/(\w+);base64,(.+)$/)
    if (!matches) {
      console.error('Invalid base64 data URL format')
      return false
    }
    const base64Data = matches[2]
    const buffer = Buffer.from(base64Data, 'base64')
    fs.writeFileSync(filepath, buffer)
    return true
  } catch (error) {
    console.error('Failed to save base64 image:', error)
    return false
  }
}

function getImageExtension(url: string): string {
  // Handle base64 data URLs
  if (url.startsWith('data:image/')) {
    const match = url.match(/^data:image\/(\w+);/)
    if (match) {
      const format = match[1].toLowerCase()
      if (format === 'jpeg') return '.jpg'
      return `.${format}`
    }
  }
  if (url.startsWith('blob:')) return '.jpg'
  const urlPath = url.split('?')[0]
  const ext = path.extname(urlPath).toLowerCase()
  if (['.jpg', '.jpeg', '.png', '.gif', '.webp', '.svg'].includes(ext)) {
    return ext
  }
  return '.jpg' // default
}

export async function POST(request: NextRequest) {
  console.log('Download API called')

  try {
    const body = await request.json()
    const businessInfo: BusinessInfo = body.businessInfo || body
    const style: WebsiteStyle = body.style || 'modern'
    console.log('Business name:', businessInfo.name, '| Style:', style)

    // Use /tmp for Vercel serverless compatibility (required for write access)
    const tempDir = '/tmp/download-' + Date.now()
    const dataDir = `${tempDir}/${sanitizeFilename(businessInfo.name || 'business')}-data`
    const imagesDir = `${dataDir}/images`

    console.log('Creating directories:', { tempDir, dataDir, imagesDir })

    // Create directories
    fs.mkdirSync(dataDir, { recursive: true })
    fs.mkdirSync(imagesDir, { recursive: true })

    console.log('Directories created successfully')

    // Download logo if provided
    let logoPath = businessInfo.logo
    if (businessInfo.logo && businessInfo.logo.startsWith('http')) {
      const ext = getImageExtension(businessInfo.logo)
      const logoFilename = `logo${ext}`
      const logoFilepath = path.join(imagesDir, logoFilename)
      const downloaded = await downloadImage(businessInfo.logo, logoFilepath)
      if (downloaded) {
        logoPath = `images/${logoFilename}`
      }
    }

    // Download hero image if provided
    let heroImagePath = businessInfo.heroImage
    if (businessInfo.heroImage && businessInfo.heroImage.startsWith('http')) {
      const ext = getImageExtension(businessInfo.heroImage)
      const heroFilename = `hero${ext}`
      const heroFilepath = path.join(imagesDir, heroFilename)
      const downloaded = await downloadImage(businessInfo.heroImage, heroFilepath)
      if (downloaded) {
        heroImagePath = `images/${heroFilename}`
      }
    }

    // Create the main business info JSON
    const mainData = {
      exportDate: new Date().toISOString(),
      businessInfo: {
        name: businessInfo.name,
        tagline: businessInfo.tagline,
        description: businessInfo.description,
        yearsInBusiness: businessInfo.yearsInBusiness,
        businessType: businessInfo.businessType,
        services: businessInfo.services,
        serviceAreas: businessInfo.serviceAreas,
      },
      contact: {
        email: businessInfo.email,
        phone: businessInfo.phone,
        address: businessInfo.address,
        city: businessInfo.city,
        state: businessInfo.state,
        zipCode: businessInfo.zipCode,
      },
      socialMedia: {
        googleProfileUrl: businessInfo.googleProfileUrl,
        facebookUrl: businessInfo.facebookUrl,
        instagramUrl: businessInfo.instagramUrl,
        linkedinUrl: businessInfo.linkedinUrl,
        yelpUrl: businessInfo.yelpUrl,
      },
      branding: {
        logo: logoPath,
        originalLogo: businessInfo.logo,
        heroImage: heroImagePath,
        originalHeroImage: businessInfo.heroImage,
        primaryColor: businessInfo.primaryColor,
        secondaryColor: businessInfo.secondaryColor,
      },
      openingHours: businessInfo.openingHours,
    }

    // Write the main data file
    fs.writeFileSync(
      path.join(dataDir, 'business-info.json'),
      JSON.stringify(mainData, null, 2)
    )

    // Download testimonial images and write testimonials
    if (businessInfo.testimonials && businessInfo.testimonials.length > 0) {
      const updatedTestimonials = []
      let testimonialImageCounter = 0

      for (const testimonial of businessInfo.testimonials) {
        let imagePath = testimonial.image
        if (testimonial.image && testimonial.image.startsWith('http')) {
          testimonialImageCounter++
          const ext = getImageExtension(testimonial.image)
          const filename = `testimonial-${testimonialImageCounter}${ext}`
          const filepath = path.join(imagesDir, filename)
          const downloaded = await downloadImage(testimonial.image, filepath)
          if (downloaded) {
            imagePath = `images/${filename}`
          }
        }
        updatedTestimonials.push({
          ...testimonial,
          image: imagePath,
          originalImage: testimonial.image
        })
      }

      fs.writeFileSync(
        path.join(dataDir, 'testimonials.json'),
        JSON.stringify(updatedTestimonials, null, 2)
      )
    }

    // Download portfolio images and update paths
    let updatedPortfolioSections: PortfolioSection[] = []
    if (businessInfo.portfolioSections && businessInfo.portfolioSections.length > 0) {
      let imageCounter = 0

      for (const section of businessInfo.portfolioSections) {
        const updatedImages = []

        for (const image of section.images || []) {
          if (image.url && image.url.startsWith('http')) {
            // Handle external URLs (Unsplash, etc.)
            imageCounter++
            const ext = getImageExtension(image.url)
            const filename = `portfolio-${imageCounter}${ext}`
            const filepath = path.join(imagesDir, filename)

            const downloaded = await downloadImage(image.url, filepath)

            updatedImages.push({
              ...image,
              url: downloaded ? `images/${filename}` : image.url,
              originalUrl: image.url
            })
          } else if (image.url && image.url.startsWith('data:image/')) {
            // Handle base64 uploaded images
            imageCounter++
            const ext = getImageExtension(image.url)
            const filename = `portfolio-${imageCounter}${ext}`
            const filepath = path.join(imagesDir, filename)

            const saved = saveBase64Image(image.url, filepath)

            updatedImages.push({
              ...image,
              url: saved ? `images/${filename}` : image.url,
              originalUrl: 'uploaded-image'
            })
          } else {
            // Keep other URLs as-is
            updatedImages.push({
              ...image,
              originalUrl: image.url
            })
          }
        }

        updatedPortfolioSections.push({
          ...section,
          images: updatedImages
        })
      }

      fs.writeFileSync(
        path.join(dataDir, 'portfolio.json'),
        JSON.stringify(updatedPortfolioSections, null, 2)
      )
    }

    // Create a summary text file for easy reading
    const summaryContent = generateSummaryText(businessInfo)
    fs.writeFileSync(
      path.join(dataDir, 'summary.txt'),
      summaryContent
    )

    // Create the Claude prompt file
    const promptContent = generateClaudePrompt(businessInfo, style)
    fs.writeFileSync(
      path.join(dataDir, 'CLAUDE_PROMPT.md'),
      promptContent
    )

    // Create ZIP file using archiver (works on Linux/Vercel)
    const zipBuffer = await createZipBuffer(dataDir)

    // Clean up temp directory
    try {
      fs.rmSync(tempDir, { recursive: true })
    } catch (e) {
      console.error('Cleanup error:', e)
    }

    // Return the ZIP file (convert Buffer to Uint8Array for NextResponse compatibility)
    return new NextResponse(new Uint8Array(zipBuffer), {
      status: 200,
      headers: {
        'Content-Type': 'application/zip',
        'Content-Disposition': `attachment; filename="${sanitizeFilename(businessInfo.name || 'business')}-data.zip"`,
      },
    })
  } catch (error) {
    console.error('Download data error:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to create download', details: String(error) },
      { status: 500 }
    )
  }
}

async function createZipBuffer(sourceDir: string): Promise<Buffer> {
  return new Promise((resolve, reject) => {
    const chunks: Buffer[] = []

    const writableStream = new Writable({
      write(chunk, encoding, callback) {
        chunks.push(chunk)
        callback()
      }
    })

    const archive = archiver('zip', { zlib: { level: 9 } })

    writableStream.on('finish', () => {
      resolve(Buffer.concat(chunks))
    })

    archive.on('error', (err) => {
      reject(err)
    })

    archive.pipe(writableStream)
    archive.directory(sourceDir, path.basename(sourceDir))
    archive.finalize()
  })
}

function sanitizeFilename(name: string): string {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '')
    .substring(0, 50) || 'business'
}

function generateClaudePrompt(info: BusinessInfo, style: WebsiteStyle): string {
  const isClassic = style === 'classic'

  const styleSection = isClassic ? `
## Design Style: CLASSIC PROFESSIONAL

This website should convey **trust, professionalism, and reliability**. Think established law firm, medical practice, or financial advisor - not a trendy startup.

### Design Philosophy
- Clean, organized layouts with clear visual hierarchy
- Subtle animations ONLY (simple fade-ins, max 0.3s duration)
- NO parallax, NO glassmorphism, NO complex animations
- Solid color backgrounds (white, light gray, navy)
- Professional color palette (navy, dark blue, forest green, or burgundy + gold accents)

### Typography
- **Headings**: Serif fonts (Georgia, Playfair Display) for elegance and trust
- **Body**: Clean sans-serif (Inter, Open Sans) for readability
- Large, readable text sizes

### Component Style
- Clean white cards with subtle box shadows
- Simple icon + text service blocks
- Grid-based testimonial layouts (NO carousels)
- Straightforward contact forms
- Professional footer with organized columns
- Button hover: darken color + subtle shadow only

### AVOID These Effects
- Glassmorphism
- Parallax scrolling
- Magnetic/animated buttons
- Staggered animations
- Text reveal animations
- Floating elements
- Complex gradients
- Neon or vibrant colors

### Trust Elements to Include
- Years in business prominently displayed
- Professional certifications/credentials
- Clear contact information on every page
- Client testimonials with full names
` : `
## Design Style: MODERN & CREATIVE

This website should be **Awwwards-level, premium, and cutting-edge**. Think design agency, tech startup, or trendy restaurant - visually stunning and memorable.

### Design Philosophy
- Bold, innovative layouts that push boundaries
- Rich animations and micro-interactions throughout
- Glassmorphism, gradients, and layered depth
- Dynamic backgrounds with visual interest

### Required Animation Libraries
You MUST use components from these libraries:

#### 1. Aceternity UI (Primary Animation Library)
\`\`\`bash
npm install framer-motion clsx tailwind-merge
\`\`\`
Use these Aceternity components (copy from https://ui.aceternity.com/components):
- **Hero sections**: Spotlight, Lamp Effect, Aurora Background, Vortex
- **Text effects**: Text Generate Effect, Typewriter Effect, Flip Words
- **Cards**: 3D Card Effect, Hover Border Gradient, Moving Border
- **Backgrounds**: Background Beams, Gradient Animation, Grid Background
- **Interactive**: Bento Grid, Infinite Moving Cards, Parallax Scroll

#### 2. 21st.dev Components (Premium UI Blocks)
Browse at: https://21st.dev/

### Component Style
- Floating cards with glassmorphism effects
- Animated counters for statistics
- Testimonial carousels with smooth transitions
- Magnetic buttons with hover effects
- Scroll-triggered animations
- Parallax effects on images
- Text reveal animations
- Staggered list animations
`

  return `# Website Generation Prompt for Claude

## IMPORTANT: Read This First
You have been provided with business data files in this folder. Use the data from \`business-info.json\`, \`testimonials.json\`, and \`portfolio.json\` to generate a complete, production-ready website.

---

## Your Mission
Create a **${isClassic ? 'professional, trustworthy, and clean' : 'premium, high-end, Awwwards-level'}** website for "${info.name || 'this business'}" ${isClassic ? 'that conveys reliability and expertise.' : 'that would genuinely compete for design awards.'}

---
${styleSection}
---

## Tech Stack Requirements

### Core Framework
- **Next.js 14+** with App Router
- **TypeScript** (strict mode)
- **Tailwind CSS** for styling
${isClassic ? '- **Minimal Framer Motion** (subtle fades only)' : '- **Framer Motion** for animations'}

### Base Components
\`\`\`bash
npx shadcn@latest init
\`\`\`

---

## Business Data to Use

### Business Name: ${info.name || 'Business Name'}
### Tagline: ${info.tagline || 'Create a compelling tagline'}
### Description: ${info.description || 'Create compelling copy based on the business type'}
### Business Type: ${info.businessType || 'General Business'}
### Years in Business: ${info.yearsInBusiness || 'Established business'}

### Services Offered:
${info.services?.length ? info.services.map(s => `- ${s}`).join('\n') : '- Use appropriate services for this business type'}

### Service Areas:
${info.serviceAreas?.length ? info.serviceAreas.map(a => `- ${a}`).join('\n') : '- Local area'}

### Contact Information:
- Email: ${info.email || 'N/A'}
- Phone: ${info.phone || 'N/A'}
- Address: ${info.address || ''}, ${info.city || ''}, ${info.state || ''} ${info.zipCode || ''}

### Social Media:
${info.googleProfileUrl ? `- Google: ${info.googleProfileUrl}` : ''}
${info.facebookUrl ? `- Facebook: ${info.facebookUrl}` : ''}
${info.instagramUrl ? `- Instagram: ${info.instagramUrl}` : ''}
${info.linkedinUrl ? `- LinkedIn: ${info.linkedinUrl}` : ''}
${info.yelpUrl ? `- Yelp: ${info.yelpUrl}` : ''}

### Hero Image:
${info.heroImage ? `**IMPORTANT**: Use the provided hero image located at \`images/hero.jpg\` (or similar extension) as the background for the landing page hero section.` : isClassic ? 'No hero image provided - use a clean solid color or subtle gradient background.' : 'No hero image provided - use a dynamic gradient or Aceternity background effect instead.'}

### Testimonials:
${info.testimonials?.length ? info.testimonials.map(t => `
**"${t.content}"**
— ${t.author}${t.role ? `, ${t.role}` : ''}${t.company ? ` at ${t.company}` : ''}
Rating: ${t.rating}/5 stars
`).join('\n') : 'Create 3-5 realistic testimonials based on the business type'}

### Portfolio/Work Sections:
${info.portfolioSections?.length ? info.portfolioSections.map(s => `
**${s.title}**
${s.description || ''}
Images: ${s.images?.length || 0} items
`).join('\n') : 'Create appropriate portfolio sections for this business type'}

---

## File Structure to Generate

\`\`\`
${sanitizeFilename(info.name || 'business')}-website/
├── app/
│   ├── layout.tsx
│   ├── page.tsx
│   ├── about/page.tsx
│   ├── services/page.tsx
│   ├── portfolio/page.tsx
│   ├── contact/page.tsx
│   └── globals.css
├── components/
│   ├── ui/
│   ├── layout/
│   ├── sections/
│   └── shared/
├── lib/
├── public/images/
├── tailwind.config.ts
├── next.config.js
├── package.json
└── tsconfig.json
\`\`\`

---

**Style Selected: ${isClassic ? 'CLASSIC PROFESSIONAL' : 'MODERN & CREATIVE'}**

${isClassic
  ? '**Remember: This website should convey trust and professionalism. Clean layouts, readable typography, and subtle interactions. No flashy effects.**'
  : '**Remember: This website should look like it belongs on Awwwards. Every pixel matters. Every animation should feel intentional.**'
}
`
}

function generateSummaryText(info: BusinessInfo): string {
  const lines: string[] = [
    '='.repeat(60),
    `BUSINESS INFORMATION EXPORT`,
    `Generated: ${new Date().toLocaleString()}`,
    '='.repeat(60),
    '',
    'BASIC INFORMATION',
    '-'.repeat(40),
    `Business Name: ${info.name || 'N/A'}`,
    `Tagline: ${info.tagline || 'N/A'}`,
    `Description: ${info.description || 'N/A'}`,
    `Years in Business: ${info.yearsInBusiness || 'N/A'}`,
    `Business Type: ${info.businessType || 'N/A'}`,
    '',
    'SERVICES',
    '-'.repeat(40),
    ...(info.services?.length ? info.services.map(s => `• ${s}`) : ['N/A']),
    '',
    'SERVICE AREAS',
    '-'.repeat(40),
    ...(info.serviceAreas?.length ? info.serviceAreas.map(a => `• ${a}`) : ['N/A']),
    '',
    'CONTACT INFORMATION',
    '-'.repeat(40),
    `Email: ${info.email || 'N/A'}`,
    `Phone: ${info.phone || 'N/A'}`,
    `Address: ${info.address || 'N/A'}`,
    `City: ${info.city || 'N/A'}`,
    `State: ${info.state || 'N/A'}`,
    `Zip Code: ${info.zipCode || 'N/A'}`,
    '',
    'SOCIAL MEDIA',
    '-'.repeat(40),
    `Google Profile: ${info.googleProfileUrl || 'N/A'}`,
    `Facebook: ${info.facebookUrl || 'N/A'}`,
    `Instagram: ${info.instagramUrl || 'N/A'}`,
    `LinkedIn: ${info.linkedinUrl || 'N/A'}`,
    `Yelp: ${info.yelpUrl || 'N/A'}`,
    '',
    'BRANDING',
    '-'.repeat(40),
    `Logo: ${info.logo || 'N/A'}`,
    `Hero Image: ${info.heroImage || 'N/A'}`,
    '',
    'TESTIMONIALS',
    '-'.repeat(40),
  ]

  if (info.testimonials?.length) {
    info.testimonials.forEach((t, i) => {
      lines.push(`[${i + 1}] "${t.content}"`)
      lines.push(`    - ${t.author}${t.role ? `, ${t.role}` : ''}${t.company ? ` at ${t.company}` : ''}`)
      lines.push(`    Rating: ${'★'.repeat(t.rating)}${'☆'.repeat(5 - t.rating)}`)
      lines.push('')
    })
  } else {
    lines.push('N/A')
  }

  lines.push('')
  lines.push('PORTFOLIO SECTIONS')
  lines.push('-'.repeat(40))
  if (info.portfolioSections?.length) {
    info.portfolioSections.forEach((section, i) => {
      lines.push(`[${i + 1}] ${section.title}`)
      lines.push(`    Description: ${section.description || 'N/A'}`)
      lines.push(`    Images: ${section.images?.length || 0}`)
      lines.push('')
    })
  } else {
    lines.push('N/A')
  }

  lines.push('')
  lines.push('='.repeat(60))
  lines.push('END OF EXPORT')
  lines.push('='.repeat(60))

  return lines.join('\n')
}
