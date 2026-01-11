import { NextRequest, NextResponse } from 'next/server'
import { BusinessInfo, PortfolioSection } from '@/lib/types'
import * as fs from 'fs'
import * as path from 'path'
import { execSync } from 'child_process'

async function downloadImage(url: string, filepath: string): Promise<boolean> {
  try {
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

    // Create a temporary directory for the data
    const tempDir = path.join(process.cwd(), 'temp-download')
    const dataDir = path.join(tempDir, `${sanitizeFilename(businessInfo.name)}-data`)
    const imagesDir = path.join(dataDir, 'images')

    // Clean up and create directories
    if (fs.existsSync(tempDir)) {
      fs.rmSync(tempDir, { recursive: true })
    }
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
    } else if (businessInfo.heroImage && businessInfo.heroImage.startsWith('blob:')) {
      // Handle blob URLs (uploaded files) - they'll be included as-is for now
      heroImagePath = businessInfo.heroImage
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
          if (image.url) {
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

    // Create ZIP file using PowerShell (Windows compatible)
    const zipPath = path.join(tempDir, `${sanitizeFilename(businessInfo.name)}-data.zip`)

    try {
      // Use PowerShell to create ZIP on Windows
      execSync(
        `powershell -Command "Compress-Archive -Path '${dataDir}' -DestinationPath '${zipPath}' -Force"`,
        { stdio: 'pipe' }
      )
    } catch (zipError) {
      console.error('ZIP creation error:', zipError)
      // If PowerShell fails, try using tar
      try {
        execSync(`tar -czvf "${zipPath}" -C "${tempDir}" "${path.basename(dataDir)}"`, { stdio: 'pipe' })
      } catch {
        throw new Error('Failed to create ZIP file')
      }
    }

    // Read the ZIP file
    const zipBuffer = fs.readFileSync(zipPath)

    // Clean up temp directory
    fs.rmSync(tempDir, { recursive: true })

    // Return the ZIP file
    return new NextResponse(zipBuffer, {
      status: 200,
      headers: {
        'Content-Type': 'application/zip',
        'Content-Disposition': `attachment; filename="${sanitizeFilename(businessInfo.name)}-data.zip"`,
      },
    })
  } catch (error) {
    console.error('Download data error:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to create download' },
      { status: 500 }
    )
  }
}

function sanitizeFilename(name: string): string {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '')
    .substring(0, 50)
}

function generateClaudePrompt(info: BusinessInfo): string {
  return `# Website Generation Prompt for Claude

## IMPORTANT: Read This First
You have been provided with business data files in this folder. Use the data from \`business-info.json\`, \`testimonials.json\`, and \`portfolio.json\` to generate a complete, production-ready website.

---

## Your Mission
Create an **Awwwards-level, premium, high-end website** for "${info.name}" that would genuinely compete for design awards. This is NOT a basic template - it must be a sophisticated, visually stunning website that demonstrates cutting-edge web design.

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
Use for:
- Premium button variants
- Advanced form components
- Sophisticated card layouts
- Navigation components
- Footer designs

#### 3. shadcn/ui (Base Components)
\`\`\`bash
npx shadcn@latest init
\`\`\`
Use for foundational UI components that you'll enhance with animations.

---

## Design Requirements (Awwwards Level)

### Visual Excellence
- **Micro-interactions everywhere**: Every hover, click, and scroll should feel alive
- **Smooth page transitions**: Use Framer Motion for route transitions
- **Parallax effects**: Multiple depth layers on scroll
- **Cursor effects**: Custom cursors, magnetic buttons, hover trails
- **Loading states**: Skeleton loaders, shimmer effects, progress indicators
- **Gradient mastery**: Dynamic gradients, mesh gradients, animated color shifts

### Typography
- **Variable fonts**: Use Inter, Cal Sans, or similar premium fonts
- **Dynamic sizing**: Fluid typography with clamp()
- **Text animations**: Reveal on scroll, character-by-character animations
- **Hierarchy**: Clear visual hierarchy with dramatic size contrasts

### Layout & Spacing
- **Generous whitespace**: Premium sites breathe
- **Asymmetric grids**: Break the monotony of standard layouts
- **Full-bleed sections**: Edge-to-edge impact areas
- **Bento grids**: Modern card arrangements (use Aceternity's Bento Grid)

### Color & Light
- **Dark mode first**: With seamless light mode toggle
- **Glow effects**: Subtle glows on interactive elements
- **Glass morphism**: Frosted glass cards where appropriate
- **Dynamic shadows**: Shadows that respond to interaction

### Motion Design
- **60fps animations**: Smooth, performant animations
- **Staggered animations**: Elements entering in sequence
- **Scroll-triggered animations**: Reveal content as user scrolls
- **Physics-based motion**: Natural easing, spring animations
- **Magnetic elements**: Buttons and links that attract the cursor

---

## Page Structure

### 1. Homepage
- **Hero Section**: Full-screen, immersive hero with the provided hero image as background. Use Aceternity's Spotlight or Aurora Background effects overlaid on the image
- **About Preview**: Compelling story snippet with scroll-triggered reveal
- **Services Grid**: Bento grid layout with hover 3D effects
- **Portfolio Showcase**: Infinite scrolling gallery or 3D card carousel
- **Testimonials**: Animated testimonial carousel with 3D cards
- **CTA Section**: Magnetic button with glow effect
- **Footer**: Comprehensive with animated links

### 2. About Page
- **Story Section**: Timeline with Tracing Beam effect
- **Team/Values**: Card grid with hover effects
- **Stats Counter**: Animated number counters on scroll

### 3. Services Page
- **Service Cards**: Expandable cards with detailed info
- **Process Section**: Step-by-step with connecting animations
- **Pricing/Packages**: If applicable, with comparison features

### 4. Portfolio/Work Page
- **Filterable Gallery**: Smooth filter transitions
- **Project Cards**: 3D hover effects, quick preview modals
- **Case Studies**: Detailed project breakdowns

### 5. Contact Page
- **Interactive Form**: Floating labels, validation animations
- **Map Integration**: Styled map or location visual
- **Contact Info**: With copy-to-clipboard animations

---

## Business Data to Use

### Business Name: ${info.name}
### Tagline: ${info.tagline || 'Create a compelling tagline'}
### Description: ${info.description || 'Create compelling copy based on the business type'}
### Business Type: ${info.businessType}
### Years in Business: ${info.yearsInBusiness || 'Established business'}

### Services Offered:
${info.services?.length ? info.services.map(s => `- ${s}`).join('\n') : '- Use appropriate services for this business type'}

### Service Areas:
${info.serviceAreas?.length ? info.serviceAreas.map(a => `- ${a}`).join('\n') : '- Local area'}

### Contact Information:
- Email: ${info.email}
- Phone: ${info.phone}
- Address: ${info.address}, ${info.city}, ${info.state} ${info.zipCode}

### Social Media:
${info.googleProfileUrl ? `- Google: ${info.googleProfileUrl}` : ''}
${info.facebookUrl ? `- Facebook: ${info.facebookUrl}` : ''}
${info.instagramUrl ? `- Instagram: ${info.instagramUrl}` : ''}
${info.linkedinUrl ? `- LinkedIn: ${info.linkedinUrl}` : ''}
${info.yelpUrl ? `- Yelp: ${info.yelpUrl}` : ''}

### Hero Image:
${info.heroImage ? `**IMPORTANT**: Use the provided hero image located at \`images/hero.jpg\` (or similar extension) as the background for the landing page hero section. This image should be displayed full-width behind the hero content with an appropriate overlay for text readability.` : 'No hero image provided - use a dynamic gradient or Aceternity background effect instead.'}

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

## SEO Requirements
- Semantic HTML5 structure
- Proper heading hierarchy (single H1 per page)
- Meta tags for all pages
- Open Graph tags for social sharing
- JSON-LD structured data for Local Business
- Alt text for all images
- Sitemap.xml
- robots.txt

---

## Performance Requirements
- Lighthouse score 90+ on all metrics
- Lazy loading for images and components
- Code splitting for routes
- Optimized fonts with next/font
- Proper image optimization with next/image
- Minimal JavaScript bundle

---

## File Structure to Generate

\`\`\`
${sanitizeFilename(info.name)}-website/
├── app/
│   ├── layout.tsx
│   ├── page.tsx
│   ├── about/page.tsx
│   ├── services/page.tsx
│   ├── portfolio/page.tsx
│   ├── contact/page.tsx
│   └── globals.css
├── components/
│   ├── ui/           (shadcn + Aceternity components)
│   ├── layout/       (Navbar, Footer, etc.)
│   ├── sections/     (Hero, About, Services, etc.)
│   └── shared/       (Buttons, Cards, etc.)
├── lib/
│   ├── utils.ts
│   └── constants.ts
├── public/
│   └── images/
├── tailwind.config.ts
├── next.config.js
├── package.json
└── tsconfig.json
\`\`\`

---

## Final Checklist
- [ ] Uses Aceternity UI components for premium animations
- [ ] Includes 21st.dev components where beneficial
- [ ] Fully responsive (mobile-first approach)
- [ ] Dark/Light mode toggle
- [ ] All pages have smooth transitions
- [ ] Scroll animations throughout
- [ ] Interactive hover states on all clickable elements
- [ ] Contact form with validation
- [ ] SEO meta tags on all pages
- [ ] JSON-LD structured data
- [ ] Performance optimized
- [ ] Accessibility compliant (WCAG 2.1)
- [ ] Cross-browser compatible

---

## How to Start

1. Create new Next.js project:
\`\`\`bash
npx create-next-app@latest ${sanitizeFilename(info.name)}-website --typescript --tailwind --eslint --app
\`\`\`

2. Install dependencies:
\`\`\`bash
npm install framer-motion clsx tailwind-merge @radix-ui/react-icons lucide-react
\`\`\`

3. Initialize shadcn:
\`\`\`bash
npx shadcn@latest init
\`\`\`

4. Copy Aceternity components from https://ui.aceternity.com/components

5. Start building the premium website!

---

**Remember: This website should look like it belongs on Awwwards. Every pixel matters. Every animation should feel intentional. The end result should make visitors say "wow" the moment they land on the page.**
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
    `Business Name: ${info.name}`,
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
    `Primary Color: ${info.primaryColor || 'N/A'}`,
    `Secondary Color: ${info.secondaryColor || 'N/A'}`,
    '',
    'OPENING HOURS',
    '-'.repeat(40),
  ]

  const days = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday']
  for (const day of days) {
    const hours = info.openingHours?.[day as keyof typeof info.openingHours]
    lines.push(`${day.charAt(0).toUpperCase() + day.slice(1)}: ${hours || 'N/A'}`)
  }

  lines.push('')
  lines.push('TESTIMONIALS')
  lines.push('-'.repeat(40))
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
      section.images?.forEach((img, j) => {
        lines.push(`      ${j + 1}. ${img.alt || 'Image'}: ${img.url}`)
      })
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
