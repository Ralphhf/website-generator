import { NextRequest, NextResponse } from 'next/server'
import { BusinessInfo, PortfolioSection } from '@/lib/types'
import * as fs from 'fs'
import * as path from 'path'
import archiver from 'archiver'
import { Writable } from 'stream'

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

function getImageExtension(url: string): string {
  if (url.startsWith('blob:')) return '.jpg'
  const urlPath = url.split('?')[0]
  const ext = path.extname(urlPath).toLowerCase()
  if (['.jpg', '.jpeg', '.png', '.gif', '.webp', '.svg'].includes(ext)) {
    return ext
  }
  return '.jpg' // default
}

export async function POST(request: NextRequest) {
  try {
    const businessInfo: BusinessInfo = await request.json()

    // Use /tmp for Vercel serverless compatibility
    const tempDir = path.join('/tmp', 'download-' + Date.now())
    const dataDir = path.join(tempDir, `${sanitizeFilename(businessInfo.name || 'business')}-data`)
    const imagesDir = path.join(dataDir, 'images')

    // Create directories
    fs.mkdirSync(dataDir, { recursive: true })
    fs.mkdirSync(imagesDir, { recursive: true })

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
          } else {
            // Keep non-http URLs as-is
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
    const promptContent = generateClaudePrompt(businessInfo)
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

    // Return the ZIP file
    return new NextResponse(zipBuffer, {
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

function generateClaudePrompt(info: BusinessInfo): string {
  return `# Website Generation Prompt for Claude

## IMPORTANT: Read This First
You have been provided with business data files in this folder. Use the data from \`business-info.json\`, \`testimonials.json\`, and \`portfolio.json\` to generate a complete, production-ready website.

---

## Your Mission
Create an **Awwwards-level, premium, high-end website** for "${info.name || 'this business'}" that would genuinely compete for design awards. This is NOT a basic template - it must be a sophisticated, visually stunning website that demonstrates cutting-edge web design.

---

## Tech Stack Requirements

### Core Framework
- **Next.js 14+** with App Router
- **TypeScript** (strict mode)
- **Tailwind CSS** for styling

### Required Component Libraries
You MUST use components from these libraries to achieve the premium look:

#### 1. Aceternity UI (Primary Animation Library)
\`\`\`bash
npm install framer-motion clsx tailwind-merge
\`\`\`
Use these Aceternity components (copy from https://ui.aceternity.com/components):
- **Hero sections**: Spotlight, Lamp Effect, Aurora Background, Vortex
- **Text effects**: Text Generate Effect, Typewriter Effect, Flip Words, Wavy Background
- **Cards**: 3D Card Effect, Hover Border Gradient, Moving Border, Glowing Stars
- **Navigation**: Floating Navbar, Sidebar with animation
- **Backgrounds**: Background Beams, Background Gradient Animation, Dot Background, Grid Background
- **Interactive**: Bento Grid, Infinite Moving Cards, Parallax Scroll, Tracing Beam
- **Testimonials**: Animated Testimonials, 3D Testimonial Cards

#### 2. 21st.dev Components (Premium UI Blocks)
Install via: \`npx shadcn@latest add "https://21st.dev/r/[component-path]"\`
Browse components at: https://21st.dev/

#### 3. shadcn/ui (Base Components)
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
${info.heroImage ? `**IMPORTANT**: Use the provided hero image located at \`images/hero.jpg\` (or similar extension) as the background for the landing page hero section.` : 'No hero image provided - use a dynamic gradient or Aceternity background effect instead.'}

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

**Remember: This website should look like it belongs on Awwwards. Every pixel matters. Every animation should feel intentional.**
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
